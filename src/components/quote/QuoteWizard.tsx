'use client';

import { useState, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import type { QuoteFormData, PriceEstimate } from '@/types';
import { calculatePrice } from '@/lib/pricing';
import { t } from '@/lib/i18n';
import { useLocaleStore } from '@/store/locale';
import { Button } from '@/components/ui/Button';

import WasteTypeStep from './steps/WasteTypeStep';
import LoadSizeStep from './steps/LoadSizeStep';
import AddressStep from './steps/AddressStep';
import FrequencyStep from './steps/FrequencyStep';
import ScheduleStep from './steps/ScheduleStep';
import ContactStep from './steps/ContactStep';
import QuoteResult from './steps/QuoteResult';

const STEP_KEYS = [
  'wasteType',
  'loadSize',
  'address',
  'frequency',
  'schedule',
  'contact',
  'result',
] as const;

type StepKey = (typeof STEP_KEYS)[number];

const STEP_LABEL_KEYS: Record<StepKey, string> = {
  wasteType: 'quote.step1',
  loadSize: 'quote.step2',
  address: 'quote.step3',
  frequency: 'quote.step4',
  schedule: 'quote.step5',
  contact: 'quote.step6',
  result: 'quote.result',
};

const INITIAL_FORM_DATA: QuoteFormData = {
  wasteTypes: [],
  loadSize: 'medium',
  address: '',
  frequency: 'one_time',
  preferredDate: undefined,
  timeSlot: undefined,
  isEmergency: false,
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  photos: [],
  notes: undefined,
};

export default function QuoteWizard() {
  const { locale } = useLocaleStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<QuoteFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');

  const updateFormData = useCallback((updates: Partial<QuoteFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const estimate: PriceEstimate | null = useMemo(() => {
    if (formData.wasteTypes.length === 0) return null;
    return calculatePrice({
      wasteTypes: formData.wasteTypes,
      loadSize: formData.loadSize,
      frequency: formData.frequency,
      isEmergency: formData.isEmergency,
    });
  }, [formData.wasteTypes, formData.loadSize, formData.frequency, formData.isEmergency]);

  const canProceed = useMemo(() => {
    const step = STEP_KEYS[currentStep];
    switch (step) {
      case 'wasteType':
        return formData.wasteTypes.length > 0;
      case 'loadSize':
        return !!formData.loadSize;
      case 'address':
        return formData.address.trim().length > 0;
      case 'frequency':
        return !!formData.frequency;
      case 'schedule':
        return true;
      case 'contact':
        return (
          formData.customerName.trim().length > 0 &&
          formData.customerEmail.trim().length > 0 &&
          formData.customerPhone.trim().length > 0
        );
      case 'result':
        return true;
      default:
        return false;
    }
  }, [currentStep, formData]);

  const goNext = useCallback(() => {
    if (currentStep < STEP_KEYS.length - 1) {
      setDirection('forward');
      setCurrentStep((s) => s + 1);
    }
  }, [currentStep]);

  const goBack = useCallback(() => {
    if (currentStep > 0) {
      setDirection('back');
      setCurrentStep((s) => s - 1);
    }
  }, [currentStep]);

  const handleSubmit = useCallback(
    async (action: 'book' | 'callback') => {
      setIsSubmitting(true);
      try {
        const payload = new FormData();
        payload.append('wasteTypes', JSON.stringify(formData.wasteTypes));
        payload.append('loadSize', formData.loadSize);
        payload.append('address', formData.address);
        payload.append('frequency', formData.frequency);
        payload.append('isEmergency', String(formData.isEmergency));
        payload.append('customerName', formData.customerName);
        payload.append('customerEmail', formData.customerEmail);
        payload.append('customerPhone', formData.customerPhone);
        payload.append('action', action);
        if (formData.preferredDate) payload.append('preferredDate', formData.preferredDate);
        if (formData.timeSlot) payload.append('timeSlot', formData.timeSlot);
        if (formData.notes) payload.append('notes', formData.notes);
        if (formData.lat) payload.append('lat', String(formData.lat));
        if (formData.lng) payload.append('lng', String(formData.lng));
        if (estimate) {
          payload.append('estimatedMin', String(estimate.finalMin));
          payload.append('estimatedMax', String(estimate.finalMax));
        }
        formData.photos.forEach((photo) => {
          payload.append('photos', photo);
        });

        const res = await fetch('/api/quotes', {
          method: 'POST',
          body: payload,
        });

        if (!res.ok) {
          throw new Error('Failed to submit quote');
        }

        setIsSubmitted(true);
        toast.success(t('quote.success', locale));
      } catch {
        toast.error(t('common.error', locale));
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, estimate, locale]
  );

  const progressPercent = ((currentStep + 1) / STEP_KEYS.length) * 100;
  const isLastInputStep = STEP_KEYS[currentStep] === 'contact';
  const isResultStep = STEP_KEYS[currentStep] === 'result';

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-[#1A1A1A] sm:text-5xl">
          {t('quote.title', locale)}
        </h1>
        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FFB800]" />
      </div>

      {/* Progress bar */}
      {!isSubmitted && (
        <div className="mb-10">
          {/* Step labels - desktop */}
          <div className="mb-3 hidden justify-between sm:flex">
            {STEP_KEYS.map((key, i) => (
              <span
                key={key}
                className={`font-body text-xs font-semibold uppercase tracking-wide transition-colors duration-300 ${
                  i <= currentStep ? 'text-[#FF6B00]' : 'text-[#1A1A1A]/30'
                }`}
              >
                {t(STEP_LABEL_KEYS[key], locale)}
              </span>
            ))}
          </div>
          {/* Step indicator - mobile */}
          <div className="mb-3 text-center sm:hidden">
            <span className="font-body text-sm font-bold text-[#FF6B00]">
              {t(STEP_LABEL_KEYS[STEP_KEYS[currentStep]], locale)}
            </span>
            <span className="font-body ml-2 text-sm font-medium text-[#1A1A1A]/40">
              {currentStep + 1} / {STEP_KEYS.length}
            </span>
          </div>
          {/* Track */}
          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-[#E8E4DF]">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FFB800] shadow-[0_0_12px_rgba(255,107,0,0.4)] transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Step content with slide transition */}
      <div className="relative min-h-[440px]">
        <div
          key={currentStep}
          className={`wizard-slide ${direction === 'forward' ? 'wizard-slide-forward' : 'wizard-slide-back'}`}
        >
          {STEP_KEYS[currentStep] === 'wasteType' && (
            <WasteTypeStep formData={formData} updateFormData={updateFormData} locale={locale} />
          )}
          {STEP_KEYS[currentStep] === 'loadSize' && (
            <LoadSizeStep formData={formData} updateFormData={updateFormData} locale={locale} />
          )}
          {STEP_KEYS[currentStep] === 'address' && (
            <AddressStep formData={formData} updateFormData={updateFormData} locale={locale} />
          )}
          {STEP_KEYS[currentStep] === 'frequency' && (
            <FrequencyStep formData={formData} updateFormData={updateFormData} locale={locale} />
          )}
          {STEP_KEYS[currentStep] === 'schedule' && (
            <ScheduleStep formData={formData} updateFormData={updateFormData} locale={locale} />
          )}
          {STEP_KEYS[currentStep] === 'contact' && (
            <ContactStep formData={formData} updateFormData={updateFormData} locale={locale} />
          )}
          {STEP_KEYS[currentStep] === 'result' && (
            <QuoteResult
              formData={formData}
              updateFormData={updateFormData}
              locale={locale}
              estimate={estimate}
              onBook={() => handleSubmit('book')}
              onCallback={() => handleSubmit('callback')}
              isSubmitting={isSubmitting}
              isSubmitted={isSubmitted}
            />
          )}
        </div>
      </div>

      {/* Navigation buttons */}
      {!isResultStep && !isSubmitted && (
        <div className="mt-10 flex items-center justify-between border-t border-[#E8E4DF] pt-6">
          <div>
            {currentStep > 0 && (
              <Button variant="ghost" size="lg" onClick={goBack} className="font-body gap-2 text-[#1A1A1A]/70 hover:text-[#1A1A1A]">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                {t('quote.back', locale)}
              </Button>
            )}
          </div>
          <Button
            variant="primary"
            size="lg"
            disabled={!canProceed}
            onClick={goNext}
            className="font-body min-w-[160px] gap-2 bg-[#FF6B00] text-base font-bold shadow-lg shadow-[#FF6B00]/25 hover:bg-[#E55F00] hover:shadow-xl hover:shadow-[#FF6B00]/30"
          >
            {isLastInputStep ? t('quote.submit', locale) : t('quote.next', locale)}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      )}

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes slideInForward {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInBack {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .wizard-slide-forward {
          animation: slideInForward 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .wizard-slide-back {
          animation: slideInBack 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
