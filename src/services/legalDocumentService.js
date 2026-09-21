import {
  api,
} from "./api/client.js";

// =====================================================
// GET LEGAL STATUS
// =====================================================

/*
 * GET /api/legal-documents/status
 *
 * Example response:
 *
 * {
 *   requiresAction: true,
 *   documents: [
 *     {
 *       id: "...",
 *       type: "TermsOfUse",
 *       title: "PhilaLink Terms of Use",
 *       version: "1.0",
 *       effectiveDate: "...",
 *       isCurrent: true,
 *       hasAccepted: false,
 *       action: null,
 *       acceptedAt: null
 *     }
 *   ]
 * }
 *
 * Authentication is automatically handled by
 * services/api/client.js.
 */
export const getLegalStatus =
  async () => {
    return api.get(
      "/api/legal-documents/status"
    );
  };

// =====================================================
// ACCEPT / ACKNOWLEDGE LEGAL DOCUMENT
// =====================================================

export const acceptLegalDocument =
  async (
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
  async (
    legalDocumentId
  ) => {
    return acceptLegalDocument(
      legalDocumentId,
      "Accepted"
    );
  };

// =====================================================
// ACKNOWLEDGE PRIVACY POLICY
// =====================================================

export const acknowledgePrivacyPolicy =
  async (
    legalDocumentId
  ) => {
    return acceptLegalDocument(
      legalDocumentId,
      "Acknowledged"
    );
  };

// =====================================================
// DOCUMENT TYPE HELPERS
// =====================================================

const normalizeDocumentType = (
  type
) => {
  return String(
    type || ""
  )
    .replace(
      /[\s_-]/g,
      ""
    )
    .toLowerCase();
};

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
// OUTSTANDING LEGAL DOCUMENTS
// =====================================================

export const hasOutstandingLegalDocuments =
  (
    legalStatus
  ) => {
    return (
      legalStatus
        ?.requiresAction ===
      true
    );
  };

// =====================================================
// GET OUTSTANDING DOCUMENTS
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
// GET COMPLETED DOCUMENTS
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
// EXPORT
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