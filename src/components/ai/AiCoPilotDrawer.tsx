'use client';

import React, { useState } from 'react';
import { FrostedGlassCard } from '@/components/ui/FrostedGlassCard';
import { PillButton } from '@/components/ui/PillButton';
import { PillTag } from '@/components/ui/PillTag';
import { api } from '@/services/api';
import {
  receptionistAiTaskOptions,
  type ReceptionistAiTask,
} from '@/types/ai';
import {
  Sparkles,
  X,
  Brain,
  FileSpreadsheet,
  Send,
  RefreshCw,
} from 'lucide-react';

export interface AiCoPilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPatientId?: string;
  selectedPatientName?: string;
  mode?: AssistantMode;
}

type ActiveTab = 'summary' | 'draft' | 'chat' | 'admin';
type AssistantMode = 'doctor' | 'nurse' | 'receptionist';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

export function AiCoPilotDrawer({
  isOpen,
  onClose,
  selectedPatientId,
  selectedPatientName,
  mode = 'doctor',
}: AiCoPilotDrawerProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>(
    mode === 'receptionist' ? 'admin' : mode === 'nurse' ? 'chat' : 'summary',
  );
  const [administrativeTask, setAdministrativeTask] =
    useState<ReceptionistAiTask>('APPOINTMENT_REMINDER');
  const [promptInput, setPromptInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const isReceptionist = mode === 'receptionist';

  if (!isOpen) return null;

  const handleSummarize = async () => {
    if (!selectedPatientId) return;
    setIsProcessing(true);
    setErrorMessage('');
    try {
      const response = await api.ai.summarize(selectedPatientId);
      setResult(response.data.summary);
    } catch (err) {
      setErrorMessage(readApiError(err));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateAdministrativeTemplate = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setErrorMessage('');
    setResult('');
    try {
      const response = await api.ai.receptionistCopilot(administrativeTask);
      setResult(response.data.response);
    } catch (err) {
      setErrorMessage(readApiError(err));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDraftNote = async () => {
    if (!selectedPatientId) return;
    setIsProcessing(true);
    setErrorMessage('');
    try {
      const response = await api.ai.draftClinicalNote(selectedPatientId);
      setResult(response.data.draft);
    } catch (err) {
      setErrorMessage(readApiError(err));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !promptInput.trim() ||
      isProcessing ||
      !selectedPatientId ||
      isReceptionist
    ) return;

    const userText = promptInput.trim();
    setPromptInput('');
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText, time: now },
    ]);

    setIsProcessing(true);
    setErrorMessage('');
    try {
      const res = mode === 'nurse'
        ? await api.ai.nurseCopilot(selectedPatientId, userText)
        : await api.ai.copilot(selectedPatientId, userText);
      const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: res.data.response,
          time: aiTime,
        },
      ]);
    } catch (err) {
      setPromptInput(userText);
      setErrorMessage(readApiError(err));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-xl bg-canvas border-l border-white/10 flex flex-col h-full shadow-2xl relative transition-all">
        {/* Drawer Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-glass-subtle">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6b62f2] text-white shadow-[0_0_20px_rgba(107,98,242,0.5)]">
              <Brain className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-text-primary">
                  {isReceptionist
                    ? 'Front Desk Assistant'
                    : mode === 'nurse'
                      ? 'Nursing Co-Pilot'
                      : 'AI Clinical Co-Pilot'}
                </h3>
                <PillTag variant="accent" size="sm">GEMINI</PillTag>
              </div>
              <p className="text-xs text-text-muted">
                {isReceptionist
                  ? 'Generic administrative templates only; no patient record is sent.'
                  : <>Patient: <span className="text-text-primary font-medium">{selectedPatientName || 'Not selected'}</span></>}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        {mode === 'doctor' && (
          <div className="px-6 py-3 border-b border-white/10 bg-white/5 flex gap-2 overflow-x-auto">
            {([
              { id: 'summary' as ActiveTab, label: 'Record Summary', icon: FileSpreadsheet },
              { id: 'draft' as ActiveTab, label: 'Clinical Note Draft', icon: RefreshCw },
              { id: 'chat' as ActiveTab, label: 'Live Consult', icon: Sparkles },
            ] satisfies { id: ActiveTab; label: string; icon: React.ElementType }[]).map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#6b62f2] text-white shadow-md shadow-[#6b62f2]/30'
                      : 'text-text-secondary hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {(activeTab === 'summary' || activeTab === 'draft') && (
            <div className="space-y-4">
              <FrostedGlassCard variant="elevated" padding="md" className="space-y-3">
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                  {activeTab === 'summary' ? 'Authorized Record Summary' : 'Clinical Note Draft'}
                </h4>
                <p className="text-xs text-text-secondary">
                  The response uses the selected patient&apos;s authorized chart data. A qualified clinician must review AI-generated content.
                </p>
                <PillButton
                  variant="accent"
                  size="sm"
                  icon={activeTab === 'summary' ? FileSpreadsheet : RefreshCw}
                  fullWidth
                  disabled={isProcessing || !selectedPatientId}
                  onClick={() => void (activeTab === 'summary' ? handleSummarize() : handleDraftNote())}
                >
                  {isProcessing
                    ? 'Generating response...'
                    : activeTab === 'summary'
                      ? 'Generate Summary'
                      : 'Draft Clinical Note'}
                </PillButton>
                {!selectedPatientId && (
                  <p className="text-xs text-amber-400">Select an authorized patient record first.</p>
                )}
              </FrostedGlassCard>
              {result && (
                <FrostedGlassCard variant="glow" padding="md">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-primary">{result}</p>
                </FrostedGlassCard>
              )}
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="flex flex-col h-[380px] justify-between space-y-4">
              {mode === 'nurse' && (
                <p className="text-xs text-text-secondary">
                  Uses only prescriptions and care records you documented for this patient. It cannot diagnose, change orders, or recommend treatment.
                </p>
              )}
              {!selectedPatientId && (
                <p className="text-xs text-amber-400">
                  {mode === 'nurse'
                    ? 'Select a patient with a nursing care record documented by your account.'
                    : 'Select an authorized patient record before using the co-pilot.'}
                </p>
              )}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#6b62f2] text-white rounded-br-none'
                          : 'bg-white/10 border border-white/10 text-text-primary rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-text-muted mt-1">{msg.time}</span>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex items-center gap-2 text-xs text-accent animate-pulse">
                    <Brain className="w-3.5 h-3.5" />
                    <span>Neural Co-Pilot thinking...</span>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={mode === 'nurse' ? 'Ask about recorded vitals or medication orders...' : 'Ask about the selected record...'}
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  disabled={isProcessing || !selectedPatientId}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isProcessing || !promptInput.trim() || !selectedPatientId}
                  className="p-2.5 rounded-xl bg-accent text-white hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
          {activeTab === 'admin' && isReceptionist && (
            <div className="space-y-4">
              <FrostedGlassCard variant="elevated" padding="md" className="space-y-3">
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">
                  Administrative Template
                </h4>
                <p className="text-xs text-text-secondary">
                  Choose a generic front-desk task. This assistant receives no free-text prompt or patient record.
                </p>
                <select
                  value={administrativeTask}
                  onChange={(event) => {
                    const selectedTask = receptionistAiTaskOptions.find(
                      ({ value }) => value === event.currentTarget.value,
                    );
                    if (selectedTask) setAdministrativeTask(selectedTask.value);
                  }}
                  className="w-full rounded-xl border border-white/10 bg-canvas px-3 py-2.5 text-xs text-text-primary focus:border-accent focus:outline-none"
                  aria-label="Administrative AI task"
                >
                  {receptionistAiTaskOptions.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <PillButton
                  variant="accent"
                  size="sm"
                  icon={Sparkles}
                  fullWidth
                  disabled={isProcessing}
                  onClick={() => void handleGenerateAdministrativeTemplate()}
                >
                  {isProcessing ? 'Generating template...' : 'Generate Template'}
                </PillButton>
              </FrostedGlassCard>
              {result && (
                <FrostedGlassCard variant="glow" padding="md">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-primary">{result}</p>
                </FrostedGlassCard>
              )}
            </div>
          )}
          {errorMessage && (
            <p role="alert" className="rounded-xl border border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-300">
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function readApiError(error: unknown): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'data' in error.response &&
    typeof error.response.data === 'object' &&
    error.response.data !== null &&
    'message' in error.response.data &&
    typeof error.response.data.message === 'string'
  ) {
    return error.response.data.message;
  }
  return error instanceof Error ? error.message : 'AI service is unavailable';
}
