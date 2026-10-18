import assert from 'node:assert/strict';
import { stat } from 'node:fs/promises';
import { chromium } from 'playwright';

const appUrl = process.env.E2E_APP_URL ?? 'http://localhost:3001';
const apiUrl = process.env.E2E_API_URL ?? 'http://localhost:3000';
const runId = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ acceptDownloads: true });
const results = [];
const captureErrors = [];
page.on('pageerror', (error) => captureErrors.push(error.message));
page.on('requestfailed', (request) => captureErrors.push(`${request.method()} ${request.url()}: ${request.failure()?.errorText}`));
const record = (name, details = {}) => { results.push({ step: name, ...details }); console.log(`PASS ${name}`); };
const login = async (email, password, route) => {
  await page.goto(`${appUrl}/login`);
  await page.locator('input[type=email]').fill(email);
  await page.locator('input[type=password]').fill(password);
  await page.getByRole('button', { name: 'Authenticate Workspace' }).click();
  await page.waitForURL(`**/${route}`, { timeout: 20000 });
};

try {
  const ownerEmail = `owner${runId}@e2e.docnode.local`;
  const doctorEmail = `doctor${runId}@e2e.docnode.local`;
  const receptionistEmail = `frontdesk${runId}@e2e.docnode.local`;
  const ownerPassword = 'WorkspaceOwner123!';
  const doctorPassword = 'DoctorTest123!';
  const receptionistPassword = 'FrontDeskTest123!';
  const hospitalName = `E2E Care ${runId}`;
  const medicineName = `E2E Tablet ${runId}`;

  await page.goto(`${appUrl}/register-hospital`);
  await page.getByLabel('Hospital name').fill(hospitalName);
  await page.getByLabel('Workspace slug').fill(`e2e-care-${runId}`);
  await page.getByLabel('Owner full name').fill('E2E Workspace Owner');
  await page.getByLabel('Owner email').fill(ownerEmail);
  await page.getByLabel('Password').fill(ownerPassword);
  await page.getByRole('button', { name: 'Create hospital workspace' }).click();
  await page.waitForURL('**/admin', { timeout: 20000 });
  record('hospital workspace creation and owner admin sign-in');

  const staffForm = page.locator('form').filter({ hasText: 'Add workspace staff' });
  const addStaff = async (role, name, email, password) => {
    await staffForm.locator('select').selectOption(role);
    await staffForm.getByPlaceholder('Full name').fill(name);
    await staffForm.getByPlaceholder('Work email').fill(email);
    await staffForm.getByPlaceholder('Temporary password').fill(password);
    if (role === 'DOCTOR') {
      await staffForm.getByPlaceholder('Department').fill('Cardiology');
      await staffForm.getByPlaceholder('Specialization').fill('Cardiology');
    }
    const responsePromise = page.waitForResponse((response) => response.url().endsWith('/auth/staff'), { timeout: 20000 });
    await staffForm.getByRole('button', { name: 'Add staff' }).click();
    const response = await responsePromise;
    assert.equal(response.status(), 201, `Staff creation response: ${response.status()} ${await response.text()}`);
  };
  await addStaff('DOCTOR', 'E2E Doctor', doctorEmail, doctorPassword);
  await addStaff('RECEPTIONIST', 'E2E Receptionist', receptionistEmail, receptionistPassword);
  record('admin provisions doctor and receptionist in the new workspace');

  const medicineResponse = await page.evaluate(async ({ endpoint, name }) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${endpoint}/medicines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, description: 'Workflow verification stock', price: 1, stock: 20 }),
    });
    return { status: response.status, body: await response.json() };
  }, { endpoint: apiUrl, name: medicineName });
  assert.equal(medicineResponse.status, 201, `Inventory setup failed with ${medicineResponse.status}`);
  record('workspace medicine inventory prepared for prescription');

  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  await login(receptionistEmail, receptionistPassword, 'receptionist');
  const patientName = `E2E Patient ${runId}`;
  await page.getByLabel('Patient name').fill(patientName);
  await page.getByLabel('Phone').fill('5550100');
  await page.getByLabel('Age').fill('35');
  await page.getByLabel('Gender').selectOption('FEMALE');
  await page.getByLabel('Assign doctor').selectOption({ label: 'E2E Doctor · Cardiology' });
  const appointmentTime = new Date(Date.now() + 30 * 60_000);
  const localSlot = new Date(appointmentTime.getTime() - appointmentTime.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
  await page.getByLabel('Appointment slot').fill(localSlot);
  await page.getByLabel('Consultation fee').fill('85');
  await page.getByLabel('Chief complaint').fill('E2E chest discomfort');
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 20000 }),
    page.getByRole('button', { name: 'Register, queue & collect payment' }).click(),
  ]);
  assert.match(download.suggestedFilename(), /\.pdf$/);
  const pdfPath = await download.path();
  assert.ok(pdfPath && (await stat(pdfPath)).size > 100);
  record('receptionist registers walk-in, queues appointment, collects payment and downloads PDF invoice', { file: download.suggestedFilename() });

  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  await login(doctorEmail, doctorPassword, 'doctor');
  await page.getByLabel('Diagnosis').fill('E2E clinical diagnosis');
  await page.getByLabel('Medication').selectOption({ label: medicineName });
  await page.getByLabel('Dosage and directions').fill('1 tablet daily for 5 days');
  const prescriptionPromise = page.waitForResponse((response) => response.url() === apiUrl + '/prescriptions' && response.request().method() === 'POST', { timeout: 20000 });
  await page.getByRole('button', { name: 'Complete Consultation' }).click();
  const prescriptionResponse = await prescriptionPromise;
  assert.equal(prescriptionResponse.status(), 201);
  await page.getByText('No patients are waiting.').waitFor({ timeout: 20000 });
  record('doctor saves diagnosis and prescription and completes the consultation');

  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  const patientListPromise = page.waitForResponse((response) => response.url() === apiUrl + '/patients' && response.request().method() === 'GET', { timeout: 20000 });
  const appointmentListPromise = page.waitForResponse((response) => response.url() === apiUrl + '/appointments' && response.request().method() === 'GET', { timeout: 20000 });
  await login(ownerEmail, ownerPassword, 'admin');
  await page.getByText('Completed Consultations Today').waitFor({ timeout: 20000 });
  const patientList = await (await patientListPromise).json();
  const appointmentList = await (await appointmentListPromise).json();
  assert.equal(patientList.length, 1, 'Admin sees only this workspace patient');
  assert.equal(patientList[0].name, patientName);
  assert.equal(appointmentList.length, 1, 'Admin sees only this workspace appointment');
  assert.equal(appointmentList[0].status, 'COMPLETED');
  record('tenant isolation and admin analytics reflect the completed visit');
  assert.deepEqual(captureErrors, [], `Browser errors: ${captureErrors.join('; ')}`);
  console.log(JSON.stringify({ result: 'PASS', results, browserErrors: captureErrors }, null, 2));
} catch (error) {
  console.error(JSON.stringify({ result: 'FAIL', message: error instanceof Error ? error.message : String(error), results, browserErrors: captureErrors }, null, 2));
  process.exitCode = 1;
} finally {
  await browser.close();
}
