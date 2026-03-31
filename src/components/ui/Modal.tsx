'use client';

import { useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { X } from 'lucide-react';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

const maxWidthStyles: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

function Modal({
  open,
  onClose,
  title,
  children,
  className,
  maxWidth = 'md',
}: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={clsx(
          'relative z-10 w-full rounded-2xl bg-[#FEFEFE] shadow-2xl',
          'mx-4 animate-in fade-in zoom-in-95 duration-200',
          'dark:bg-[#1A1A1A] dark:border dark:border-[rgba(255,255,255,0.1)]',
          maxWidthStyles[maxWidth],
          className
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between border-b border-[rgba(0,0,0,0.06)] dark:border-[rgba(255,255,255,0.1)] px-6 py-4">
            <h2
              id="modal-title"
              className="text-lg font-semibold text-[#1A1A1A] dark:text-white"
            >
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-[#1A1A1A]/40 hover:bg-[#1A1A1A]/10 hover:text-[#1A1A1A] dark:text-white/40 dark:hover:bg-white/10 dark:hover:text-white transition-all duration-200 cursor-pointer"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Close button when no title */}
        {!title && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 rounded-lg p-1.5 text-[#1A1A1A]/40 hover:bg-[#1A1A1A]/10 hover:text-[#1A1A1A] dark:text-white/40 dark:hover:bg-white/10 dark:hover:text-white transition-all duration-200 cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Content */}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
}

export { Modal };
