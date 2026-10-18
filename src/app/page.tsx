"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Activity, ArrowDownRight, ArrowRight, BrainCircuit, CalendarDays, Check, ChevronRight, ClipboardList, HeartPulse, Menu, ShieldCheck, Sparkles, Stethoscope, Users, X } from "lucide-react";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { FrostedGlassCard } from "@/components/ui/FrostedGlassCard";
import { PillTag } from "@/components/ui/PillTag";

const roles = [
  { id: "Admin", title: "One clear view of the whole hospital.", detail: "Keep operations, teams and patient flow moving together.", icon: ShieldCheck, metric: "98.4%", metricLabel: "bed occupancy", items: ["Operations overview", "Staff coordination", "Revenue insights"] },
  { id: "Doctor", title: "More time for the person in front of you.", detail: "Bring patient history, clinical notes and decision support into one calm workspace.", icon: Stethoscope, metric: "12", metricLabel: "patients in queue", items: ["Clinical summaries", "Visit documentation", "Care planning"] },
  { id: "Nurse", title: "Care details, always within reach.", detail: "Track observations, medication rounds and patient needs without losing the thread.", icon: HeartPulse, metric: "08:42", metricLabel: "last vitals check", items: ["Vitals monitoring", "Medication rounds", "Shift handover"] },
  { id: "Receptionist", title: "A smoother first step for every patient.", detail: "Make check-in, appointments and the OPD queue easier to manage.", icon: CalendarDays, metric: "06", metricLabel: "patients waiting", items: ["Appointment booking", "Patient registration", "Live queue"] },
  { id: "Patient", title: "A simpler way to stay on top of your care.", detail: "Appointments, prescriptions and health updates together in one place.", icon: Users, metric: "02", metricLabel: "upcoming visits", items: ["Visit history", "Prescriptions", "Care reminders"] },
];

const features = [
  { icon: BrainCircuit, eyebrow: "CLINICAL INTELLIGENCE", title: "The right context, at the right moment.", description: "AI assisted summaries help care teams find the signal in patient history, while clinicians stay in control.", accent: "mint", wide: true },
  { icon: CalendarDays, eyebrow: "PATIENT FLOW", title: "A queue that keeps everyone in sync.", description: "Coordinate appointments and OPD visits with a live view from check-in through consultation.", accent: "violet" },
  { icon: ClipboardList, eyebrow: "CONNECTED CARE", title: "Less chasing. More continuity.", description: "Bring clinical notes, prescriptions and everyday workflows into one shared system.", accent: "blue" },
];

export default function Home() {
  const [activeRole, setActiveRole] = useState("Doctor");
  const [menuOpen, setMenuOpen] = useState(false);
  const selectedRole = roles.find((role) => role.id === activeRole) ?? roles[1];
  const RoleIcon = selectedRole.icon;

  return (
    <main className="landing min-h-dvh overflow-hidden text-text-primary">
      <div className="landing-noise" aria-hidden="true" />
      <header className="landing-header">
        <nav className="landing-nav" aria-label="Main navigation">
          <Link href="/" className="landing-brand" aria-label="DocNode home">
            <span className="landing-brand-mark"><Image src="/logo.png" alt="" width={34} height={34} /></span>
            <span>DocNode<span className="landing-brand-dot">.</span></span>
          </Link>
          <div className={`landing-links ${menuOpen ? "is-open" : ""}`}>
            <a href="#platform" onClick={() => setMenuOpen(false)}>Platform</a>
            <a href="#workflows" onClick={() => setMenuOpen(false)}>Workflows</a>
            <a href="#plans" onClick={() => setMenuOpen(false)}>For hospitals</a>
          </div>
          <div className="landing-nav-actions">
            <ThemeSwitcher />
            <Link href="/login" className="landing-signin">Sign in <ArrowRight size={15} /></Link>
            <Link href="/register" className="landing-nav-cta">Get started <ChevronRight size={15} /></Link>
          </div>
          <button className="landing-menu-button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        </nav>
      </header>

      <section className="landing-hero">
        <div className="landing-orb landing-orb-one" aria-hidden="true" />
        <div className="landing-orb landing-orb-two" aria-hidden="true" />
        <div className="landing-hero-grid">
          <div className="landing-hero-copy reveal-up">
            <PillTag variant="accent" size="sm" icon={Sparkles}>A calmer way to run care</PillTag>
            <h1>Healthcare works better <span>when everything connects.</span></h1>
            <p className="landing-lede">One thoughtful operating system for the people, patients and decisions that move your hospital forward.</p>
            <div className="landing-hero-actions">
              <Link href="/register" className="landing-primary-cta">Explore DocNode <ArrowRight size={17} /></Link>
              <a href="#platform" className="landing-secondary-cta">See how it works <ArrowDownRight size={17} /></a>
            </div>
            <div className="landing-assurance"><span className="assurance-icon"><ShieldCheck size={15} /></span><span>Designed for care teams. Built around your workflows.</span></div>
          </div>

          <div className="landing-visual reveal-up delay-2" aria-label="Preview of the DocNode hospital operations dashboard">
            <div className="visual-aura" />
            <FrostedGlassCard variant="elevated" padding="none" className="landing-dashboard-card">
              <div className="preview-topbar"><div className="preview-brand"><span className="preview-brand-icon"><Activity size={16} /></span><span>Clinical overview</span></div><span className="preview-live"><i /> Live workspace</span></div>
              <div className="preview-welcome"><div><span className="preview-overline">MONDAY, OCTOBER 19</span><h2>Good morning, Dr. Rahman</h2><p>Your care teams are in sync today.</p></div><span className="preview-avatar">AR</span></div>
              <div className="preview-stats">
                <div className="preview-stat"><span>Appointments</span><strong>128</strong><small><span>↑ 12%</span> from last week</small><div className="stat-sparkline spark-violet"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div></div>
                <div className="preview-stat"><span>Care teams active</span><strong>24</strong><small><span>●</span> All departments</small><div className="stat-sparkline spark-mint"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div></div>
              </div>
              <div className="preview-queue-head"><div><span className="preview-overline">LIVE OPD QUEUE</span><strong>Today&apos;s patient flow</strong></div><span className="queue-count">06 waiting</span></div>
              <div className="preview-patient"><span className="patient-avatar avatar-violet">SK</span><span className="patient-name"><strong>Samira Khan</strong><small>General medicine · 09:30</small></span><span className="patient-status status-ready">Ready</span></div>
              <div className="preview-patient"><span className="patient-avatar avatar-blue">MH</span><span className="patient-name"><strong>Malik Hassan</strong><small>Cardiology · 09:45</small></span><span className="patient-status status-arrived">Arrived</span></div>
              <div className="preview-patient"><span className="patient-avatar avatar-mint">AN</span><span className="patient-name"><strong>Ayesha Noor</strong><small>Paediatrics · 10:00</small></span><span className="patient-status status-scheduled">Scheduled</span></div>
              <div className="preview-ai"><span className="ai-icon"><Sparkles size={15} /></span><span><strong>Clinical co-pilot</strong><small>Patient summary is ready for review</small></span><ChevronRight size={16} /></div>
            </FrostedGlassCard>
            <div className="floating-insight floating-insight-top"><span className="insight-icon mint-icon"><HeartPulse size={16} /></span><span><strong>Care, connected</strong><small>One shared patient story</small></span><span className="insight-check"><Check size={13}/></span></div>
            <div className="floating-insight floating-insight-bottom"><span className="insight-icon violet-icon"><Users size={16} /></span><span><strong>24 teams active</strong><small>Working in harmony</small></span></div>
          </div>
        </div>
        <a href="#platform" className="hero-scroll" aria-label="Scroll to explore"><span /> Scroll to explore</a>
      </section>

      <section className="landing-proof" aria-label="Platform highlights">
        <div className="proof-inner"><p>BETTER COORDINATION, ACROSS EVERY MOMENT OF CARE</p><div className="proof-metrics"><div><strong>One</strong><span>connected workspace</span></div><div><strong>Every</strong><span>role in the care journey</span></div><div><strong>More</strong><span>time for what matters</span></div></div></div>
      </section>

      <section className="landing-section platform-section" id="platform">
        <div className="section-heading reveal-up"><PillTag variant="glass" size="sm">THE DOCNODE PLATFORM</PillTag><h2>Complex care deserves <span>a clearer system.</span></h2><p>Hospital operations are connected. Your tools should be, too. Bring the everyday work of care into one considered experience.</p></div>
        <div className="feature-grid">
          {features.map((feature, index) => { const Icon = feature.icon; return <FrostedGlassCard key={feature.title} variant="interactive" hoverEffect className={`feature-card feature-${feature.accent} ${feature.wide ? "feature-wide" : ""} reveal-up delay-${index + 1}`}><div className="feature-card-top"><span className="feature-icon"><Icon size={19}/></span><span className="feature-index">0{index + 1}</span></div><div><span className="feature-eyebrow">{feature.eyebrow}</span><h3>{feature.title}</h3><p>{feature.description}</p></div>{feature.wide && <div className="copilot-note"><span className="copilot-spark"><Sparkles size={15}/></span><span><strong>Patient story, made clearer</strong><small>Relevant history and recent notes, ready for clinician review.</small></span><span className="copilot-status">Ready to review</span></div>}</FrostedGlassCard>; })}
        </div>
      </section>

      <section className="landing-workflows" id="workflows">
        <div className="workflow-layout">
          <div className="workflow-copy reveal-up"><PillTag variant="accent" size="sm" icon={Users}>MADE FOR THE WHOLE TEAM</PillTag><h2>One hospital.<br/><span>Every perspective.</span></h2><p>Give every role a workspace that fits the work, while keeping the whole care journey connected.</p><div className="workflow-role-list" role="tablist" aria-label="Choose a role workspace">{roles.map((role) => { const Icon = role.icon; return <button key={role.id} role="tab" id={`tab-${role.id}`} aria-selected={activeRole === role.id} aria-controls="role-preview" className={`workflow-role ${activeRole === role.id ? "is-active" : ""}`} onClick={() => setActiveRole(role.id)}><Icon size={17}/><span>{role.id}</span><ChevronRight size={15}/></button>; })}</div></div>
          <div className="role-preview-wrap reveal-up delay-2"><div className="role-preview-glow"/><FrostedGlassCard id="role-preview" role="tabpanel" aria-labelledby={`tab-${activeRole}`} variant="elevated" padding="none" className="role-preview"><div className="role-preview-top"><span className="role-preview-brand"><span className="role-preview-logo"><Image src="/logo.png" alt="" width={27} height={27}/></span>DocNode</span><span className="preview-live"><i/> Workspace</span></div><div className="role-preview-heading"><span className="role-icon"><RoleIcon size={18}/></span><span><small>{activeRole.toUpperCase()} WORKSPACE</small><h3>{selectedRole.title}</h3></span></div><p className="role-preview-detail">{selectedRole.detail}</p><div className="role-preview-metric"><span><small>AT A GLANCE</small><strong>{selectedRole.metric}</strong><small>{selectedRole.metricLabel}</small></span><div className="metric-chart" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div></div><div className="role-preview-list">{selectedRole.items.map((item) => <div key={item}><span className="list-check"><Check size={13}/></span>{item}<ArrowRight size={14}/></div>)}</div><Link href="/login" className="preview-open">Explore {activeRole.toLowerCase()} workspace <ArrowRight size={15}/></Link></FrostedGlassCard><div className="role-float"><span className="role-float-icon"><Activity size={16}/></span><span><strong>Every detail, connected</strong><small>Updates move with the patient</small></span></div></div>
        </div>
      </section>

      <section className="landing-section plans-section" id="plans"><div className="plans-card reveal-up"><div className="plans-glow"/><PillTag variant="emerald" size="sm" icon={Check}>BUILT TO GROW WITH YOU</PillTag><h2>Care is personal.<br/><span>Your platform should be, too.</span></h2><p>From a growing clinic to a connected hospital network, let&apos;s shape the right DocNode experience for your team.</p><Link href="/register" className="landing-primary-cta">Start a conversation <ArrowRight size={17}/></Link><span className="plans-footnote">No one-size-fits-all packages. Just the workflows you need.</span><div className="plans-orbit orbit-one"/><div className="plans-orbit orbit-two"/></div></section>

      <footer className="landing-footer"><div className="footer-main"><Link href="/" className="landing-brand"><span className="landing-brand-mark"><Image src="/logo.png" alt="" width={32} height={32}/></span><span>DocNode<span className="landing-brand-dot">.</span></span></Link><p>A clearer way to care, together.</p><div className="footer-links"><Link href="/login">Sign in</Link><Link href="/register">Get started</Link></div></div><div className="footer-bottom"><span>© 2026 DocNode. Built around better care.</span><span><i/> A connected care workspace</span></div></footer>
    </main>
  );
}
