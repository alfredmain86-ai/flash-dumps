'use client';

import { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

/* ------------------------------------------------------------------ */
/*  Input                                                             */
/* ------------------------------------------------------------------ */

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id, className, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-semibold text-[#1A1A1A]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'block w-full rounded-lg border-2 bg-[#FEFEFE] px-4 text-[#1A1A1A] placeholder:text-[#9CA3AF] h-12',
            'transition-all duration-200',
            'focus:outline-none',
            error
              ? 'border-[#EF4444] focus:border-[#EF4444] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]'
              : 'border-[#E8E4DF] focus:border-[#FF6B00] focus:shadow-[0_0_0_3px_rgba(255,107,0,0.15)]',
            'disabled:cursor-not-allowed disabled:bg-[#FAF8F5] disabled:text-[#9CA3AF]',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-sm text-[#EF4444] font-medium">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-[#64748B]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

/* ------------------------------------------------------------------ */
/*  Textarea                                                          */
/* ------------------------------------------------------------------ */

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, id, className, rows = 4, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-semibold text-[#1A1A1A]"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={clsx(
            'block w-full rounded-lg border-2 bg-[#FEFEFE] px-4 py-3 text-[#1A1A1A] placeholder:text-[#9CA3AF]',
            'transition-all duration-200 resize-y',
            'focus:outline-none',
            error
              ? 'border-[#EF4444] focus:border-[#EF4444] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]'
              : 'border-[#E8E4DF] focus:border-[#FF6B00] focus:shadow-[0_0_0_3px_rgba(255,107,0,0.15)]',
            'disabled:cursor-not-allowed disabled:bg-[#FAF8F5] disabled:text-[#9CA3AF]',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-sm text-[#EF4444] font-medium">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="mt-1.5 text-sm text-[#64748B]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Input, Textarea };
