import { create } from "zustand";
import { api } from "~/api";
import type {
  Certification,
  CreateCertificationData,
} from "~/types/certification";

interface SuccessResponse {
  success: boolean;
  message: string;
}

interface CertificationsState {
  certifications: Certification[];
  isLoading: boolean;
  error: string | null;
  selectedCertification: Certification | null;
  updateCertification: (
    certificationId: string,
    certificationData: Certification
  ) => Promise<string>;

  // Actions
  getCertifications: () => Promise<void>;
  deleteCertification: (certificationId: string) => Promise<string>;
  createCertification: (
    certificationData: CreateCertificationData
  ) => Promise<string>;

  setSelectedCertification: (certification: Certification | null) => void;
  clearError: () => void;
}

export const useCertificationsStore = create<CertificationsState>()(
  (set, get) => ({
    certifications: [],
    isLoading: false,
    error: null,
    selectedCertification: null,

    getCertifications: async () => {
      set((state) => {
        if (state.isLoading) return state;
        return { ...state, isLoading: true, error: null };
      });

      try {
        const response = await api.get<{ certifications: Certification[] }>(
          "/api/v1/admin/certifications"
        );
        set({
          certifications: response.data.certifications,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error("Erreur lors du chargement des categories:", error);
        set({
          error: "Erreur lors du chargement des categories",
          isLoading: false,
          certifications: [],
        });
        throw error;
      }
    },

    deleteCertification: async (certificationId: string) => {
      set({ isLoading: true, error: null });

      try {
        const response = await api.delete<SuccessResponse>(
          `/api/v1/admin/certifications/${certificationId}`
        );
        set({ isLoading: false, error: null });
        await get().getCertifications(); // Rafraîchir la liste après suppression
        return response.data.message;
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Failed to delete categorie";
        set({ error: errorMessage, isLoading: false });
        throw new Error(errorMessage);
      }
    },

    createCertification: async (certificationData: CreateCertificationData) => {
      set({ isLoading: true, error: null });

      try {
        const response = await api.post<SuccessResponse>(
          "/api/v1/admin/certifications",
          certificationData
        );

        // Rafraîchir la liste des categories après création
        await get().getCertifications(); // Rafraîchir la liste après création

        set({ isLoading: false, error: null });
        return response.data.message;
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Failed to create categorie";
        set({ error: errorMessage, isLoading: false });
        throw new Error(errorMessage);
      }
    },

    updateCertification: async (
      certificationId: string,
      certificationData: Certification
    ) => {
      set({ isLoading: true, error: null });

      try {
        const response = await api.put<SuccessResponse>(
          `/api/v1/admin/certifications/${certificationId}`,
          certificationData
        );
        set({ isLoading: false, error: null });
        await get().getCertifications(); // Rafraîchir la liste après mise à jour
        return response.data.message;
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Failed to update categorie";
        set({ error: errorMessage, isLoading: false });
        throw new Error(errorMessage);
      }
    },

    setSelectedCertification: (certification) => {
      set({ selectedCertification: certification });
    },

    clearError: () => {
      set({ error: null });
    },
  })
);
