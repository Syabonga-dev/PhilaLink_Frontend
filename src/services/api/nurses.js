import {
  api,
} from "./client.js";

export const nursesApi = {
  // =====================================================
  // NURSE PROFILE
  // =====================================================

  getMe: () =>
    api.get(
      "/api/nurses/me"
    ),

  updateMe: (
    payload
  ) =>
    api.put(
      "/api/nurses/me",
      payload
    ),

  // =====================================================
  // DASHBOARD
  // =====================================================

  getDashboardStats: () =>
    api.get(
      "/api/nurses/me/dashboard"
    ),

  getUrgentAlerts: () =>
    api.get(
      "/api/nurses/me/alerts"
    ),

  // =====================================================
  // PATIENTS
  // =====================================================

  getAssignedPatients: () =>
    api.get(
      "/api/nurses/me/patients"
    ),

  getPatientCare: (
    patientId
  ) => {
    if (!patientId) {
      throw new Error(
        "A patient ID is required."
      );
    }

    return api.get(
      `/api/nurses/me/patients/${patientId}`
    );
  },

  // =====================================================
  // ALLERGIES
  // =====================================================

  createAllergy: (
    patientId,
    payload
  ) =>
    api.post(
      `/api/nurses/me/patients/${patientId}/allergies`,
      payload
    ),

  updateAllergy: (
    patientId,
    allergyId,
    payload
  ) =>
    api.put(
      `/api/nurses/me/patients/${patientId}/allergies/${allergyId}`,
      payload
    ),

  deleteAllergy: (
    patientId,
    allergyId
  ) =>
    api.delete(
      `/api/nurses/me/patients/${patientId}/allergies/${allergyId}`
    ),

  // =====================================================
  // CONDITIONS
  // =====================================================

  createCondition: (
    patientId,
    payload
  ) =>
    api.post(
      `/api/nurses/me/patients/${patientId}/conditions`,
      payload
    ),

  updateCondition: (
    patientId,
    conditionId,
    payload
  ) =>
    api.put(
      `/api/nurses/me/patients/${patientId}/conditions/${conditionId}`,
      payload
    ),

  archiveCondition: (
    patientId,
    conditionId
  ) =>
    api.delete(
      `/api/nurses/me/patients/${patientId}/conditions/${conditionId}`
    ),

  // =====================================================
  // MEDICATIONS
  // =====================================================

  createMedication: (
    payload
  ) =>
    api.post(
      "/api/medications",
      payload
    ),

  getPatientMedications: (
    patientId
  ) =>
    api.get(
      `/api/medications/patient/${patientId}`
    ),

  addMedicationSchedule: (
    medicationId,
    timeOfDay
  ) =>
    api.post(
      `/api/medications/${medicationId}/schedule`,
      {
        medicationId,
        timeOfDay,
        isActive:
          true,
      }
    ),

  getMedicationLogs: (
    medicationId
  ) =>
    api.get(
      `/api/medications/${medicationId}/logs`
    ),

  // =====================================================
  // COLLECTIONS
  // =====================================================

  scheduleCollection: (
    patientId,
    payload
  ) =>
    api.post(
      `/api/nurses/me/patients/${patientId}/collections`,
      payload
    ),

  getCollections: () =>
    api.get(
      "/api/collections"
    ),

  getCollectionSummary: () =>
    api.get(
      "/api/collections/summary"
    ),

  completeCollection: (
    collectionId,
    payload = {}
  ) =>
    api.patch(
      `/api/collections/${collectionId}/collect`,
      {
        proxyId:
          payload.proxyId ??
          null,

        notes:
          payload.notes ??
          null,
      }
    ),

  assignCollectionProxy: (
    collectionId,
    proxyId
  ) =>
    api.patch(
      `/api/collections/${collectionId}/proxy`,
      {
        proxyId,
      }
    ),

  // =====================================================
  // APPOINTMENTS
  // =====================================================

  getAppointments: () =>
    api.get(
      "/api/appointments"
    ),

  getAppointment: (
    appointmentId
  ) =>
    api.get(
      `/api/appointments/${appointmentId}`
    ),

  createAppointment: (
    payload
  ) =>
    api.post(
      "/api/appointments",
      payload
    ),

  updateAppointment: (
    appointmentId,
    payload
  ) =>
    api.put(
      `/api/appointments/${appointmentId}`,
      payload
    ),

  deleteAppointment: (
    appointmentId
  ) =>
    api.delete(
      `/api/appointments/${appointmentId}`
    ),

  // =====================================================
  // PROXIES
  // =====================================================

  getClinicProxies: () =>
    api.get(
      "/api/nurses/me/proxies"
    ),

  getPatientProxies: (
    patientId
  ) =>
    api.get(
      `/api/proxies/patient/${patientId}`
    ),

  assignProxy: (
    patientId,
    proxyId
  ) =>
    api.post(
      "/api/proxies/assign",
      {
        patientId,
        proxyId,
      }
    ),

  removeProxy: (
    proxyLinkId
  ) =>
    api.delete(
      `/api/proxies/${proxyLinkId}`
    ),
};
