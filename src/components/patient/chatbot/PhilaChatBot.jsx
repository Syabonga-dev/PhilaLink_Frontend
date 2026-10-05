import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useTranslation,
} from "react-i18next";

import {
  defaultAssessment,
} from "./types";

import FloatingButton from "./FloatingButton";
import ChatPanel from "./ChatPanel";

import {
  chatbotApi,
} from "../../../services/api/chatbot.js";

import {
  symptomAssessmentsApi,
} from "../../../services/api/symptomAssessments.js";

import {
  translateKnownServerText,
} from "../../../i18n/patientText.js";

function createInitialMessages(
  t
) {
  return [
    {
      type: "ai",
      initial: true,
      text:
        t(
          "chatbot.initialMessage"
        ),
    },
  ];
}

export default function PhilaChatBot() {
  const {
    t,
    i18n,
  } =
    useTranslation();

  const [
    isOpen,
    setIsOpen,
  ] =
    useState(false);

  const [
    step,
    setStep,
  ] =
    useState(
      "welcome"
    );

  const [
    assessment,
    setAssessment,
  ] =
    useState(
      defaultAssessment
    );

  const [
    assessmentResult,
    setAssessmentResult,
  ] =
    useState(null);

  const [
    messages,
    setMessages,
  ] =
    useState(
      () =>
        createInitialMessages(
          t
        )
    );

  const [
    inputValue,
    setInputValue,
  ] =
    useState("");

  const [
    errorType,
    setErrorType,
  ] =
    useState(
      "network"
    );

  const [
    isSending,
    setIsSending,
  ] =
    useState(false);

  const historyLoaded =
    useRef(false);

  useEffect(
    () => {
      setMessages(
        current => {
          if (
            current.length ===
              1 &&
            current[0]
              ?.initial
          ) {
            return createInitialMessages(
              t
            );
          }

          return current;
        }
      );
    },
    [
      i18n.resolvedLanguage,
      i18n.language,
      t,
    ]
  );

  useEffect(
    () => {
      if (
        !isOpen ||
        historyLoaded
          .current
      ) {
        return;
      }

      historyLoaded.current =
        true;

      chatbotApi
        .getHistory()
        .then(
          history => {
            if (
              !Array.isArray(
                history
                  ?.messages
              ) ||
              history
                .messages
                .length ===
                0
            ) {
              return;
            }

            setMessages(
              history
                .messages
                .map(
                  message => ({
                    type:
                      message
                        .role ===
                      "user"
                        ? "user"
                        : "ai",

                    text:
                      message
                        .role ===
                      "user"
                        ? message
                            .content
                        : translateKnownServerText(
                            message
                              .content
                          ),
                  })
                )
            );
          }
        )
        .catch(
          () => {
            historyLoaded.current =
              false;
          }
        );
    },
    [
      isOpen,
    ]
  );

  const handleAssessmentChange =
    data => {
      setAssessment(
        previous => ({
          ...previous,
          ...data,
        })
      );
    };

  const handleRestart =
    () => {
      setAssessment(
        defaultAssessment
      );

      setAssessmentResult(
        null
      );

      setErrorType(
        "network"
      );

      setInputValue("");

      setStep(
        "quick-start"
      );
    };

  const handleOpenChat =
    (
      prompt = ""
    ) => {
      setInputValue(
        String(
          prompt ?? ""
        )
      );

      setStep(
        "followup"
      );
    };

  const handleClearHistory =
    async () => {
      await chatbotApi
        .clearHistory();

      setMessages(
        createInitialMessages(
          t
        )
      );

      setInputValue("");

      historyLoaded.current =
        true;
    };

  const handleAnalyze =
    async () => {
      const symptoms =
        Array.isArray(
          assessment
            .symptoms
        )
          ? assessment
              .symptoms
              .filter(
                Boolean
              )
          : [];

      if (
        symptoms.length ===
        0
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
          await symptomAssessmentsApi
            .create(
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
      } catch (
        error
      ) {
        setErrorType(
          error
            ?.isNetworkError
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
        previous => [
          ...previous,
          {
            type: "user",
            text,
          },
        ]
      );

      setInputValue("");

      setIsSending(
        true
      );

      try {
        const response =
          await chatbotApi
            .sendMessage(
              text
            );

        setMessages(
          previous => [
            ...previous,
            {
              type: "ai",

              text:
                translateKnownServerText(
                  response
                    ?.message
                ) ||
                t(
                  "chatbot.noResponse"
                ),
            },
          ]
        );
      } catch (
        error
      ) {
        setMessages(
          previous => [
            ...previous,
            {
              type: "ai",

              text:
                error
                  ?.message ||
                t(
                  "chatbot.processError"
                ),
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
        onOpenChat={
          handleOpenChat
        }
        onClearHistory={
          handleClearHistory
        }
      />
    </>
  );
}
