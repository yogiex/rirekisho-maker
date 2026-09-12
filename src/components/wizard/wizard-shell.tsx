import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldPath } from "react-hook-form";
import { Check, Lock } from "lucide-react";

import { Step1BasicInfo } from "@/components/wizard/steps/step1-basic-info";
import { Step2History } from "@/components/wizard/steps/step2-history";
import { Step3Licenses } from "@/components/wizard/steps/step3-licenses";
import { Step4Preferences } from "@/components/wizard/steps/step4-preferences";
import { WizardNav } from "@/components/wizard/wizard-nav";
import { WizardErrorBoundary } from "@/components/wizard/wizard-error-boundary";
import { DraftFormContext } from "@/components/wizard/draft-form-context";
import { useDraftAutosave } from "@/components/wizard/hooks/use-draft-autosave";
import { strings } from "@/lib/constants/strings";
import { loadDraft } from "@/lib/storage/draft";
import {
  createDefaultDraft,
  rirekishoSchema,
  stepFields,
  type RirekishoData,
} from "@/lib/schema/rirekisho-schema";

const TOTAL_STEPS = strings.steps.length;

export function WizardShell() {
  const [isReady, setIsReady] = useState(false);
  const [step, setStep] = useState(1);

  const form = useForm<RirekishoData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(rirekishoSchema) as any,
    mode: "onBlur",
    defaultValues: useMemo(() => createDefaultDraft(new Date()), []),
  });

  useEffect(() => {
    const draft = loadDraft();
    form.reset(draft?.data ?? createDefaultDraft(new Date()));
    const id = requestAnimationFrame(() => setIsReady(true));
    return () => cancelAnimationFrame(id);
  }, [form]);

  const savedLabel = useDraftAutosave(form, isReady);
  const stepMeta = strings.steps[step - 1];

  async function handleNext(): Promise<void> {
    const rawFields = stepFields[step as keyof typeof stepFields] ?? [];
    const valid = await form.trigger(
      rawFields as unknown as FieldPath<RirekishoData>[],
      { shouldFocus: true },
    );
    if (!valid || step >= TOTAL_STEPS) return;
    setStep((s) => s + 1);
    window.scrollTo({ top: 0 });
  }

  function handleBack(): void {
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0 });
  }

  return (
    <WizardErrorBoundary>
      <DraftFormContext.Provider value={form}>
        <FormProvider {...form}>
          <div className="min-h-dvh bg-background">
            <header className="border-b">
              <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 md:px-6">
                <h1 className="text-lg font-semibold tracking-tight">
                  {strings.app.title}
                </h1>
                {savedLabel && (
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Check className="size-3 text-green-600" aria-hidden />
                    {savedLabel}
                  </p>
                )}
              </div>
            </header>

            <main className="mx-auto max-w-4xl px-4 pb-28 pt-6 md:px-6 md:pb-8 md:pt-8">
              {!isReady ? null : (
                <>
                  <div className="mb-6">
                    <p className="text-xs text-muted-foreground">
                      {step}/{TOTAL_STEPS}
                    </p>
                    <h2 tabIndex={-1} className="text-2xl font-semibold">
                      {stepMeta.jp}
                      <span className="ml-2 text-sm font-normal text-muted-foreground">
                        {stepMeta.id}
                      </span>
                    </h2>
                  </div>

                  {step === 1 && <Step1BasicInfo onNext={handleNext} />}
                  {step === 2 && <Step2History onNext={handleNext} />}
                  {step === 3 && <Step3Licenses onNext={handleNext} />}
                  {step === 4 && <Step4Preferences onNext={handleNext} />}
                  {step > 4 && (
                    <p className="text-sm text-muted-foreground">
                      {strings.misc.stepPlaceholder(step)}
                    </p>
                  )}

                  <p className="mt-10 flex items-start gap-1.5 text-xs text-muted-foreground">
                    <Lock className="mt-0.5 size-3 shrink-0" aria-hidden />
                    {strings.trust.privacyFooter}
                  </p>

                  {step < TOTAL_STEPS && (
                    <div className="mt-8">
                      <WizardNav
                        showBack={step > 1}
                        onBack={handleBack}
                        onNext={handleNext}
                      />
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </FormProvider>
      </DraftFormContext.Provider>
    </WizardErrorBoundary>
  );
}
