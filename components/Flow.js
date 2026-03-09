/*
 * Flow.js — Flow Controller
 *
 * This component owns the "current step" state and decides which
 * step component to show. It's the brain of the 3-step flow.
 *
 * How it works:
 *   - useState(1) tracks which step we're on (1, 2, or 3)
 *   - goNext() increments the step
 *   - goBack() decrements the step
 *   - onFinish() is called when the user completes the last step
 *   - Simple if/else decides which Step component to render
 */

"use client";

import { useState } from "react";
import flowConfig from "@/config/flow-config";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";

export default function Flow() {
  // currentStep tracks which step is visible (1, 2, or 3)
  const [currentStep, setCurrentStep] = useState(1);

  // Move to the next step
  function goNext() {
    setCurrentStep(currentStep + 1);
  }

  // Move to the previous step
  function goBack() {
    setCurrentStep(currentStep - 1);
  }

  // Called when the user finishes the entire flow
  function onFinish() {
    // For now, just reset to step 1
    // Later this could navigate away, show a success screen, etc.
    setCurrentStep(1);
  }

  // Pull the config for the current step (array is 0-indexed, steps are 1-indexed)
  const stepConfig = flowConfig.steps[currentStep - 1];

  // Render the right component based on currentStep
  if (currentStep === 1) {
    return <StepOne config={stepConfig} onNext={goNext} />;
  }

  if (currentStep === 2) {
    return <StepTwo config={stepConfig} onNext={goNext} onBack={goBack} />;
  }

  if (currentStep === 3) {
    return <StepThree config={stepConfig} onBack={goBack} onFinish={onFinish} />;
  }

  // Fallback (should never happen)
  return null;
}
