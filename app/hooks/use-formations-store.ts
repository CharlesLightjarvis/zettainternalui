import { create } from "zustand";
import { api } from "~/api";
import type { UpdateCategorieData } from "~/types/categorie";
import type {
  CreateFormationData,
  Formation,
  UpdateFormationData,
} from "~/types/formation";

interface SuccessResponse {
  success: boolean;
  message: string;
}

interface FormationsState {
  formations: Formation[];
  isLoading: boolean;
  error: string | null;
  selectedFormation: Formation | null;
  updateFormation: (
    formationId: string,
    formationData: UpdateFormationData
  ) => Promise<string>;

  // Actions
  getFormations: () => Promise<void>;
  deleteFormation: (formationId: string) => Promise<string>;
  createFormation: (formationData: CreateFormationData) => Promise<string>;

  setSelectedFormation: (formation: Formation | null) => void;
  clearError: () => void;
}

export const useFormationsStore = create<FormationsState>()((set, get) => ({
  formations: [],
  isLoading: false,
  error: null,
  selectedFormation: null,

  getFormations: async () => {
    set((state) => {
      if (state.isLoading) return state;
      return { ...state, isLoading: true, error: null };
    });

    try {
      const response = await api.get<{ formations: Formation[] }>(
        "/api/v1/admin/formations"
      );
      set({
        formations: response.data.formations,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Erreur lors du chargement des categories:", error);
      set({
        error: "Erreur lors du chargement des categories",
        isLoading: false,
        formations: [],
      });
      throw error;
    }
  },

  deleteFormation: async (formationId: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.delete<SuccessResponse>(
        `/api/v1/admin/formations/${formationId}`
      );
      set({ isLoading: false, error: null });
      await get().getFormations(); // Rafraîchir la liste après suppression
      return response.data.message;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete categorie";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  createFormation: async (formationData: CreateFormationData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.post<SuccessResponse>(
        "/api/v1/admin/formations",
        formationData
      );

      // Rafraîchir la liste des categories après création
      await get().getFormations(); // Rafraîchir la liste après création

      set({ isLoading: false, error: null });
      return response.data.message;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create categorie";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  updateFormation: async (
    formationId: string,
    formationData: UpdateFormationData
  ) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.put<SuccessResponse>(
        `/api/v1/admin/formations/${formationId}`,
        formationData
      );
      set({ isLoading: false, error: null });
      await get().getFormations(); // Rafraîchir la liste après mise à jour
      return response.data.message;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update categorie";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  setSelectedFormation: (formation) => {
    set({ selectedFormation: formation });
  },

  clearError: () => {
    set({ error: null });
  },
}));
