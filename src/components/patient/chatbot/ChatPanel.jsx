import ChatHeader from "./ChatHeader";

import WelcomeScreen from "./steps/WelcomeScreen";
import QuickStartScreen from "./steps/QuickStartScreen";
import AssessmentAge from "./steps/AssessmentAge";
import AssessmentSymptoms from "./steps/AssessmentSymptoms";
import AssessmentDuration from "./steps/AssessmentDuration";
import AssessmentAllergies from "./steps/AssessmentAllergies";
import AssessmentMedications from "./steps/AssessmentMedications";
import AssessmentConditions from "./steps/AssessmentConditions";
import ReviewScreen from "./steps/ReviewScreen";
import LoadingScreen from "./steps/LoadingScreen";
import EmergencyScreen from "./steps/EmergencyScreen";
import ResultsScreen from "./steps/ResultsScreen";
import FollowUpScreen from "./steps/FollowUpScreen";
import ErrorScreen from "./steps/ErrorScreen";

export default function ChatPanel({
  isOpen,
  step,
  assessment,
  assessmentResult,
  messages,
  inputValue,
  errorType,
  sending,
  onClose,
  onMinimize,
  onStepChange,
  onAssessmentChange,
  onAnalyze,
  onInputChange,
  onSend,
  onRestart,
}) {
  const renderStep = () => {
    switch (step) {
      case "welcome":
        return (
          <WelcomeScreen
            onAccept={() =>
              onStepChange(
                "quick-start"
              )
            }
          />
        );

      case "quick-start":
        return (
          <QuickStartScreen
            onStartAssessment={() =>
              onStepChange(
                "age"
              )
            }
            onSelectOption={(
              selectedStep
            ) =>
              onStepChange(
                selectedStep
              )
            }
          />
        );

      case "age":
        return (
          <AssessmentAge
            assessment={
              assessment
            }
            onUpdate={
              onAssessmentChange
            }
            onNext={() =>
              onStepChange(
                "symptoms"
              )
            }
            onBack={() =>
              onStepChange(
                "quick-start"
              )
            }
          />
        );

      case "symptoms":
        return (
          <AssessmentSymptoms
            assessment={
              assessment
            }
            onUpdate={
              onAssessmentChange
            }
            onNext={() =>
              onStepChange(
                "duration"
              )
            }
            onBack={() =>
              onStepChange(
                "age"
              )
            }
          />
        );

      case "duration":
        return (
          <AssessmentDuration
            assessment={
              assessment
            }
            onUpdate={
              onAssessmentChange
            }
            onNext={() =>
              onStepChange(
                "allergies"
              )
            }
            onBack={() =>
              onStepChange(
                "symptoms"
              )
            }
          />
        );

      case "allergies":
        return (
          <AssessmentAllergies
            assessment={
              assessment
            }
            onUpdate={
              onAssessmentChange
            }
            onNext={() =>
              onStepChange(
                "medications"
              )
            }
            onBack={() =>
              onStepChange(
                "duration"
              )
            }
          />
        );

      case "medications":
        return (
          <AssessmentMedications
            assessment={
              assessment
            }
            onUpdate={
              onAssessmentChange
            }
            onNext={() =>
              onStepChange(
                "conditions"
              )
            }
            onBack={() =>
              onStepChange(
                "allergies"
              )
            }
          />
        );

      case "conditions":
        return (
          <AssessmentConditions
            assessment={
              assessment
            }
            onUpdate={
              onAssessmentChange
            }
            onNext={() =>
              onStepChange(
                "review"
              )
            }
            onBack={() =>
              onStepChange(
                "medications"
              )
            }
          />
        );

      case "review":
        return (
          <ReviewScreen
            assessment={
              assessment
            }
            onEdit={(
              target
            ) =>
              onStepChange(
                target
              )
            }
            onAnalyze={
              onAnalyze
            }
            onBack={() =>
              onStepChange(
                "conditions"
              )
            }
          />
        );

      case "loading":
        return (
          <LoadingScreen />
        );

      case "emergency":
        return (
          <EmergencyScreen
            onContinue={() =>
              onStepChange(
                "results"
              )
            }
            onRestart={
              onRestart
            }
          />
        );

      case "results":
        return (
          <ResultsScreen
            assessment={
              assessment
            }
            assessmentResult={
              assessmentResult
            }
            onFollowUp={() =>
              onStepChange(
                "followup"
              )
            }
            onRestart={
              onRestart
            }
          />
        );

      case "error":
        return (
          <ErrorScreen
            errorType={
              errorType
            }
            onRetry={
              onAnalyze
            }
          />
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={[
        "fixed z-40 flex flex-col overflow-hidden rounded-corner-lg bg-surface-bg shadow-2xl",
        "transition-all duration-300",
        "inset-x-2 bottom-2",
        "h-[calc(100dvh-16px)]",
        "lg:inset-x-auto lg:left-[68px] lg:bottom-5 lg:h-[660px] lg:max-h-[calc(100vh-40px)] lg:w-[420px]",
        isOpen
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      ].join(" ")}
    >
      <ChatHeader
        onMinimize={
          onMinimize
        }
        onClose={
          onClose
        }
      />

      {step ===
      "followup" ? (
        <div className="flex min-h-0 flex-1 flex-col">
          <FollowUpScreen
            messages={
              messages
            }
            inputValue={
              inputValue
            }
            sending={
              sending
            }
            onInputChange={
              onInputChange
            }
            onSend={
              onSend
            }
          />
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-lg overflow-y-auto p-xl">
          {renderStep()}

          <div className="pb-md" />
        </div>
      )}
    </div>
  );
}