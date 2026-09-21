import {
  api,
} from "./api/client.js";

// =====================================================
// GET CURRENT LEGAL STATUS
// =====================================================

export const getLegalStatus =
  () =>
    api.get(
      "/api/legal-documents/status"
    );

// =====================================================
// RECORD LEGAL ACTION
// =====================================================

export const acceptLegalDocument =
  (
    legalDocumentId,
    action
  ) => {
    if (
      !legalDocumentId
    ) {
      throw new Error(
        "Legal document ID is required."
      );
    }

    if (
      !action
    ) {
      throw new Error(
        "Legal document action is required."
      );
    }

    return api.post(
      "/api/legal-documents/accept",
      {
        legalDocumentId,
        action,
      }
    );
  };

// =====================================================
// ACCEPT TERMS OF USE
// =====================================================

export const acceptTermsOfUse =
  (
    legalDocumentId
  ) =>
    acceptLegalDocument(
      legalDocumentId,
      "Accepted"
    );

// =====================================================
// ACKNOWLEDGE PRIVACY POLICY
// =====================================================

export const acknowledgePrivacyPolicy =
  (
    legalDocumentId
  ) =>
    acceptLegalDocument(
      legalDocumentId,
      "Acknowledged"
    );

// =====================================================
// DOCUMENT TYPE HELPERS
// =====================================================

const normalizeDocumentType = (
  type
) =>
  String(
    type || ""
  )
    .replace(
      /[\s_-]/g,
      ""
    )
    .toLowerCase();

// =====================================================
// FIND TERMS OF USE
// =====================================================

export const findTermsOfUse =
  (
    documents = []
  ) => {
    if (
      !Array.isArray(
        documents
      )
    ) {
      return null;
    }

    return (
      documents.find(
        (
          document
        ) =>
          normalizeDocumentType(
            document?.type
          ) ===
          "termsofuse"
      ) ||
      null
    );
  };

// =====================================================
// FIND PRIVACY POLICY
// =====================================================

export const findPrivacyPolicy =
  (
    documents = []
  ) => {
    if (
      !Array.isArray(
        documents
      )
    ) {
      return null;
    }

    return (
      documents.find(
        (
          document
        ) =>
          normalizeDocumentType(
            document?.type
          ) ===
          "privacypolicy"
      ) ||
      null
    );
  };

// =====================================================
// HAS OUTSTANDING LEGAL DOCUMENTS
// =====================================================

export const hasOutstandingLegalDocuments =
  (
    legalStatus
  ) =>
    legalStatus
      ?.requiresAction ===
    true;

// =====================================================
// GET OUTSTANDING LEGAL DOCUMENTS
// =====================================================

export const getOutstandingLegalDocuments =
  (
    legalStatus
  ) => {
    const documents =
      Array.isArray(
        legalStatus
          ?.documents
      )
        ? legalStatus
            .documents
        : [];

    return documents.filter(
      (
        document
      ) =>
        document
          ?.hasAccepted !==
        true
    );
  };

// =====================================================
// GET COMPLETED LEGAL DOCUMENTS
// =====================================================

export const getCompletedLegalDocuments =
  (
    legalStatus
  ) => {
    const documents =
      Array.isArray(
        legalStatus
          ?.documents
      )
        ? legalStatus
            .documents
        : [];

    return documents.filter(
      (
        document
      ) =>
        document
          ?.hasAccepted ===
        true
    );
  };

// =====================================================
// DEFAULT EXPORT
// =====================================================

const legalDocumentService = {
  getLegalStatus,

  acceptLegalDocument,

  acceptTermsOfUse,

  acknowledgePrivacyPolicy,

  findTermsOfUse,

  findPrivacyPolicy,

  hasOutstandingLegalDocuments,

  getOutstandingLegalDocuments,

  getCompletedLegalDocuments,
};

export default legalDocumentService;