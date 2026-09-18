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
  onOpenChat,
  onClearHistory,
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
            onOpenChat={
              onOpenChat
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
            assessmentResult={
              assessmentResult
            }
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
        "fixed inset-0 z-[4000]",
        "flex h-[100dvh] w-screen flex-col",
        "overflow-hidden",
        "bg-surface-bg",
        "transition-opacity duration-200",
        isOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0",
      ].join(" ")}
      aria-hidden={
        !isOpen
      }
    >
      {/*
        Header remains permanently visible.
        Only the body below it scrolls.
      */}
      <ChatHeader
        onMinimize={
          onMinimize
        }
        onClose={
          onClose
        }
        onClearHistory={
          onClearHistory
        }
        sending={
          sending
        }
      />


      {step ===
      "followup" ? (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">

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
            onMenu={() =>
              onStepChange(
                "quick-start"
              )
            }
          />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col gap-lg overflow-y-auto overscroll-contain p-lg sm:p-xl">

          {renderStep()}

          <div className="pb-md" />
        </div>
      )}
    </div>
  );
}