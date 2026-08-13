import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { AiConciergeChat } from './AiConciergeChat';

export function AiConciergeLauncher() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full bg-concrete-900 px-5 py-3.5 text-sm font-semibold text-white shadow-2xl transition-transform hover:scale-105"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-safety-500 text-xs font-bold text-concrete-950">AI</span>
        Ask Tough Concrete AI
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Tough Concrete AI Concierge">
        <div className="h-[60vh]">
          <AiConciergeChat mode="lead" />
        </div>
      </Modal>
    </>
  );
}
