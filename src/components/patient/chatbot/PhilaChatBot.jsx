import {
  useEffect,
  useRef,
  useState,
} from "react";
import { defaultAssessment } from "./types";
import FloatingButton from "./FloatingButton";
import ChatPanel from "./ChatPanel";
import { chatbotApi } from "../../../services/api/chatbot.js";
import { symptomAssessmentsApi } from "../../../services/api/symptomAssessments.js";

const INITIAL_FOLLOW_UP_MESSAGES =
  [
    {
      type: "ai",
      text: "How can I help you further? Feel free to ask about your assessment or general health information.",
    },
  ];

export default function PhilaChatBot() {
  const [
    isOpen,
    setIsOpen,
  ] = useState(false);

  const [
    step,
    setStep,
  ] = useState("welcome");

  const [
    assessment,
    setAssessment,
  ] = useState(
    defaultAssessment
  );

  const [
    assessmentResult,
    setAssessmentResult,
  ] = useState(null);

  const [
    messages,
    setMessages,
  ] = useState(
    INITIAL_FOLLOW_UP_MESSAGES
  );

  const [
    inputValue,
    setInputValue,
  ] = useState("");

  const [
    errorType,
    setErrorType,
  ] = useState(
    "network"
  );

  const [
    isSending,
    setIsSending,
  ] = useState(false);

  const historyLoaded =
    useRef(false);

  useEffect(() => {
    if (
      !isOpen ||
      historyLoaded.current
    ) {
      return;
    }

    historyLoaded.current =
      true;

    chatbotApi
      .getHistory()
      .then((history) => {
        if (
          !Array.isArray(
            history?.messages
          ) ||
          history.messages
            .length === 0
        ) {
          return;
        }

        setMessages(
          history.messages.map(
            (message) => ({
              type:
                message.role ===
                "user"
                  ? "user"
                  : "ai",

              text:
                message.content,
            })
          )
        );
      })
      .catch(() => {
        historyLoaded.current =
          false;
      });
  }, [isOpen]);

  const handleAssessmentChange =
    (data) => {
      setAssessment(
        (previous) => ({
          ...previous,
          ...data,
        })
      );
    };

  const handleRestart = () => {
    setAssessment(
      defaultAssessment
    );

    setAssessmentResult(
      null
    );

    setErrorType(
      "network"
    );

    setStep(
      "quick-start"
    );
  };

  const handleAnalyze =
    async () => {
      const symptoms =
        Array.isArray(
          assessment.symptoms
        )
          ? assessment.symptoms
              .filter(Boolean)
          : [];

      if (
        symptoms.length === 0
      ) {
        setStep(
          "symptoms"
        );

        return;
      }

      setStep(
        "loading"
      );

      try {
        const result =
          await symptomAssessmentsApi.create(
            assessment
          );

        setAssessmentResult(
          result
        );

        if (
          result?.result ===
          "Emergency"
        ) {
          setStep(
            "emergency"
          );
        } else {
          setStep(
            "results"
          );
        }
      } catch (error) {
        setErrorType(
          error?.isNetworkError
            ? "network"
            : "unavailable"
        );

        setStep(
          "error"
        );
      }
    };

  const handleSend =
    async () => {
      const text =
        inputValue.trim();

      if (
        !text ||
        isSending
      ) {
        return;
      }

      setMessages(
        (previous) => [
          ...previous,
          {
            type: "user",
            text,
          },
        ]
      );

      setInputValue("");
      setIsSending(true);

      try {
        const response =
          await chatbotApi.sendMessage(
            text
          );

        setMessages(
          (previous) => [
            ...previous,
            {
              type: "ai",
              text:
                response
                  ?.message ||
                "No response was returned.",
            },
          ]
        );
      } catch (error) {
        setMessages(
          (previous) => [
            ...previous,
            {
              type: "ai",
              text:
                error?.message ||
                "I couldn't process that message right now.",
            },
          ]
        );
      } finally {
        setIsSending(
          false
        );
      }
    };

  return (
    <>
      {!isOpen && (
        <FloatingButton
          onClick={() =>
            setIsOpen(
              true
            )
          }
        />
      )}

      <ChatPanel
        isOpen={
          isOpen
        }
        step={
          step
        }
        assessment={
          assessment
        }
        assessmentResult={
          assessmentResult
        }
        messages={
          messages
        }
        inputValue={
          inputValue
        }
        errorType={
          errorType
        }
        sending={
          isSending
        }
        onClose={() =>
          setIsOpen(
            false
          )
        }
        onMinimize={() =>
          setIsOpen(
            false
          )
        }
        onStepChange={
          setStep
        }
        onAssessmentChange={
          handleAssessmentChange
        }
        onAnalyze={
          handleAnalyze
        }
        onInputChange={
          setInputValue
        }
        onSend={
          handleSend
        }
        onRestart={
          handleRestart
        }
      />
    </>
  );
}