'use client';

import { useRef, useState } from 'react';
import type { QuoteFormData, Locale } from '@/types';
import { t } from '@/lib/i18n';
import { Input, Textarea } from '@/components/ui/Input';

interface ContactStepProps {
  formData: QuoteFormData;
  updateFormData: (updates: Partial<QuoteFormData>) => void;
  locale: Locale;
}

export default function ContactStep({ formData, updateFormData, locale }: ContactStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
    updateFormData({ photos: [...formData.photos, ...imageFiles] });
  };

  const removePhoto = (index: number) => {
    updateFormData({ photos: formData.photos.filter((_, i) => i !== index) });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="font-display text-2xl font-extrabold text-[#1A1A1A]">
          {t('quote.step6', locale)}
        </h2>
        <p className="font-body mt-2 text-[#1A1A1A]/60">
          {locale === 'es'
            ? 'Ingrese su información de contacto'
            : 'Enter your contact information'}
        </p>
      </div>

      <div className="mx-auto max-w-md space-y-5">
        <Input
          label={t('common.name', locale)}
          placeholder={locale === 'es' ? 'Su nombre completo' : 'Your full name'}
          value={formData.customerName}
          onChange={(e) => updateFormData({ customerName: e.target.value })}
          required
          className="font-body"
        />

        <Input
          type="email"
          label={t('common.email', locale)}
          placeholder={locale === 'es' ? 'correo@ejemplo.com' : 'you@example.com'}
          value={formData.customerEmail}
          onChange={(e) => updateFormData({ customerEmail: e.target.value })}
          required
          className="font-body"
        />

        <Input
          type="tel"
          label={t('common.phone', locale)}
          placeholder="(305) 555-0123"
          value={formData.customerPhone}
          onChange={(e) => updateFormData({ customerPhone: e.target.value })}
          required
          className="font-body"
        />

        {/* Photo upload area */}
        <div>
          <label className="font-body mb-2 block text-sm font-semibold text-[#1A1A1A]">
            {locale === 'es' ? 'Fotos (opcional)' : 'Photos (optional)'}
          </label>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={() => setIsDragging(false)}
            onClick={() => fileInputRef.current?.click()}
            className={`
              group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8
              transition-all duration-200
              ${
                isDragging
                  ? 'border-[#FF6B00] bg-[rgba(255,107,0,0.05)] scale-[1.01]'
                  : 'border-[#E8E4DF] bg-[#FAF8F5] hover:border-[#FF6B00]/40 hover:bg-[rgba(255,107,0,0.03)]'
              }
            `}
          >
            <div className={`rounded-full p-3 transition-colors duration-200 ${isDragging ? 'bg-[#FF6B00]/10' : 'bg-[#E8E4DF]'}`}>
              <svg className={`h-6 w-6 transition-colors duration-200 ${isDragging ? 'text-[#FF6B00]' : 'text-[#1A1A1A]/30'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
            </div>
            <div className="text-center">
              <span className="font-body text-sm font-medium text-[#1A1A1A]/50">
                {locale === 'es'
                  ? 'Arrastre fotos aqui o haga clic para seleccionar'
                  : 'Drag photos here or click to select'}
              </span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>

          {formData.photos.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {formData.photos.map((file, i) => (
                <div key={i} className="group relative">
                  <div className="h-20 w-20 overflow-hidden rounded-xl border-2 border-[#E8E4DF] bg-[#FAF8F5] shadow-sm">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Upload ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removePhoto(i);
                    }}
                    className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#1A1A1A] text-white text-xs font-bold opacity-0 shadow-md transition-all duration-200 group-hover:opacity-100 hover:bg-red-500 cursor-pointer"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Textarea
          label={locale === 'es' ? 'Notas adicionales (opcional)' : 'Additional notes (optional)'}
          placeholder={
            locale === 'es'
              ? 'Instrucciones de acceso, detalles del proyecto, etc.'
              : 'Access instructions, project details, etc.'
          }
          rows={3}
          value={formData.notes ?? ''}
          onChange={(e) => updateFormData({ notes: e.target.value })}
          className="font-body"
        />
      </div>
    </div>
  );
}
