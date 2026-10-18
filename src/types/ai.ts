export const receptionistAiTaskOptions = [
  { value: 'APPOINTMENT_REMINDER', label: 'Appointment reminder' },
  { value: 'APPOINTMENT_CONFIRMATION', label: 'Appointment confirmation' },
  { value: 'RESCHEDULING_GUIDANCE', label: 'Rescheduling guidance' },
  { value: 'CHECK_IN_INSTRUCTIONS', label: 'Check-in instructions' },
  {
    value: 'BILLING_PROCESS_EXPLANATION',
    label: 'Billing process explanation',
  },
  { value: 'REGISTRATION_CHECKLIST', label: 'Registration checklist' },
] as const;

export type ReceptionistAiTask =
  (typeof receptionistAiTaskOptions)[number]['value'];
