import { useState } from "react";
import { defaultAssessment } from "./types";
import FloatingButton from "./FloatingButton";
import ChatPanel from "./ChatPanel";

const EMERGENCY_KEYWORDS = [
  "shortness of breath",
  "chest pain",
  "loss of consciousness",
  "seizure",
  "severe bleeding",
  "stroke",
];

const INITIAL_FOLLOW_UP_MESSAGES = [
  {
    type: "ai",
    text: "How can I help you further? Feel free to ask any questions about your symptoms or the assessment results.",
  },
];

export default function PhilaChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState("welcome");
  const [assessment, setAssessment] =
    useState(defaultAssessment);
  const [messages, setMessages] = useState(
    INITIAL_FOLLOW_UP_MESSAGES
  );
  const [inputValue, setInputValue] =
    useState("");
  const [errorType] = useState("network");

  const isEmergency =
    assessment.symptoms.some((symptom) =>
      EMERGENCY_KEYWORDS.some((keyword) =>
        symptom
          .toLowerCase()
          .includes(keyword)
      )
    );

  const handleAssessmentChange = (data) => {
    setAssessment((previous) => ({
      ...previous,
      ...data,
    }));
  };

  const handleRestart = () => {
    setAssessment(defaultAssessment);
    setMessages(
      INITIAL_FOLLOW_UP_MESSAGES
    );
    setStep("quick-start");
  };

  const handleSend = () => {
    const text = inputValue.trim();

    if (!text) {
      return;
    }

    setMessages((previous) => [
      ...previous,
      {
        type: "user",
        text,
      },
    ]);

    setInputValue("");

    const responses = [
      "Thank you for sharing that. Based on the symptoms you described, I recommend monitoring your condition over the next 24–48 hours and staying hydrated.",

      "That's a good question. Remember that PhilaChatBot provides general health guidance only — please consult a healthcare professional for personalised advice.",

      "I understand your concern. If your symptoms worsen or you develop new symptoms, please contact your clinic or seek medical attention.",

      "Based on your assessment, your symptoms appear to be mild to moderate. A pharmacist can advise on suitable over-the-counter relief options.",

      "It's important to rest and give your body time to recover. If you're unsure about any medication, always check with a pharmacist or your doctor first.",
    ];

    const response =
      responses[
        Math.floor(
          Math.random() *
            responses.length
        )
      ];

    setTimeout(() => {
      setMessages((previous) => [
        ...previous,
        {
          type: "ai",
          text: response,
        },
      ]);
    }, 1200);
  };

  return (
    <>
      <FloatingButton
        onClick={() =>
          setIsOpen(
            (previous) => !previous
          )
        }
      />

      <ChatPanel
        isOpen={isOpen}
        step={step}
        assessment={assessment}
        messages={messages}
        inputValue={inputValue}
        errorType={errorType}
        isEmergency={isEmergency}
        onClose={() =>
          setIsOpen(false)
        }
        onMinimize={() =>
          setIsOpen(false)
        }
        onStepChange={setStep}
        onAssessmentChange={
          handleAssessmentChange
        }
        onInputChange={setInputValue}
        onSend={handleSend}
        onRestart={handleRestart}
      />
    </>
  );
}
