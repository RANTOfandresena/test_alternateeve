import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string | ReactNode;
  headerRight?: ReactNode;
  children: ReactNode;
}

const Modal = ({ open, onClose, title, headerRight, children }: ModalProps) => {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-300">
            <h2 className="text-lg font-semibold text-slate-800">
              {title}
            </h2>

            <div className="flex items-center gap-2">
              {headerRight}
              <button
                onClick={onClose}
                className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="px-6 py-6 max-h-[80vh] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
export default Modal;