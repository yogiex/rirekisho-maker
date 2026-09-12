'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { rirekishoSchema, getDefaultValues, type RirekishoFormData } from '@/lib/schema/rirekisho-schema';
import type { Resolver } from 'react-hook-form';
import { StepIndicator } from './step-indicator';
import { WizardNav } from './wizard-nav';
import { Step1BasicInfo } from './steps/step1-basic-info';
import { Step2History } from './steps/step2-history';
import { Step3Licenses } from './steps/step3-licenses';
import { Step4Preferences } from './steps/step4-preferences';
import { Step5Preview } from './steps/step5-preview';
import { loadDraft, saveDraftDebounced, clearDraft } from '@/lib/storage/draft';

const STEP_FIELDS: (keyof RirekishoFormData)[][] = [
  ['furigana', 'fullName', 'dateOfBirth', 'postalCode', 'prefecture', 'address'],
  ['history'],
  ['licenses'],
  ['motivation', 'requests'],
  [],
];

export function WizardShell() {
  const [currentStep, setCurrentStep] = useState(0);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([0]));
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<RirekishoFormData>({
    resolver: zodResolver(rirekishoSchema) as Resolver<RirekishoFormData>,
    defaultValues: getDefaultValues(),
  });

  const { watch, formState: { errors }, setValue, reset } = form;

  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      reset(draft.data);
      toast.info('下書きが復元されました');
    }
  }, [reset]);

  useEffect(() => {
    const subscription = watch((data) => {
      setIsSaving(true);
      saveDraftDebounced(data as RirekishoFormData, () => {
        setIsSaving(false);
        setLastSaved(new Date());
      });
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const goToNext = useCallback(async () => {
    const fields = STEP_FIELDS[currentStep];
    if (fields.length > 0) {
      const isValid = await form.trigger(fields);
      if (!isValid) return;
    }
    const next = Math.min(currentStep + 1, 4);
    setCurrentStep(next);
    setVisitedSteps(prev => new Set([...prev, next]));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep, form]);

  const goToPrev = useCallback(() => {
    const prev = Math.max(currentStep - 1, 0);
    setCurrentStep(prev);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    if (visitedSteps.has(step)) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [visitedSteps]);

  const handleReset = useCallback(() => {
    clearDraft();
    reset(getDefaultValues());
    setCurrentStep(0);
    setVisitedSteps(new Set([0]));
    setLastSaved(null);
    toast.success('リセットしました');
  }, [reset]);

  const handleLoadSample = useCallback(async () => {
    const { SAMPLE_DRAFT } = await import('@/lib/constants/sample-draft');
    reset(SAMPLE_DRAFT);
    toast.success('サンプルデータを読み込みました');
  }, [reset]);

  const stepErrors: Record<string, string> = {};
  const fieldNames = STEP_FIELDS[currentStep];
  fieldNames.forEach(field => {
    const error = errors[field];
    if (error) stepErrors[field] = error.message as string;
  });

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <Step1BasicInfo data={form.watch()} errors={stepErrors} onUpdate={(field, value) => setValue(field, value as never)} />;
      case 1: return <Step2History />;
      case 2: return <Step3Licenses />;
      case 3: return <Step4Preferences />;
      case 4: return <Step5Preview data={form.watch()} onReset={handleReset} />;
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 pb-20 md:pb-4">
      <StepIndicator
        currentStep={currentStep}
        visitedSteps={visitedSteps}
        onStepClick={goToStep}
      />
      <div className="py-4">
        {renderStep()}
      </div>
      <WizardNav
        onPrev={goToPrev}
        onNext={currentStep === 4 ? () => {} : goToNext}
        isFirst={currentStep === 0}
        isLast={currentStep === 4}
        isSaving={isSaving}
        lastSaved={lastSaved}
      />
    </div>
  );
}
