import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AnalysisResults {
  env: {
    APP_NAME: string;
    DOMINANT_LANGUAGE: string;
    PACKAGE_MANAGER: string;
    FRAMEWORK_DETECTED: string;
    APP_MAIN: string;
    APP_CONFIG: string;
    ENTRYPOINT: string;
    CONF: string;
    PBK_TO_BUILD: string;
  };
  // Ajout des nouveaux champs pour correspondre à l'API
  metadata?: any;
  files?: any[];
  dependencies?: any[];
}

interface AnalysisState {
  analysisResults: AnalysisResults | null;
  setAnalysisResults: (results: AnalysisResults) => void;
  clearAnalysisResults: () => void;
}

export const useAnalysisStore = create<AnalysisState>()(
  persist(
    (set) => ({
      analysisResults: null,
      setAnalysisResults: (results) => {
        console.log("🔄 setAnalysisResults appelé avec:", results);
        set({ analysisResults: results });
        console.log("✅ Nouvel état après set:", useAnalysisStore.getState());
      },
      clearAnalysisResults: () => set({ analysisResults: null }),
    }),
    {
      name: "analysis-storage",
      onRehydrateStorage: (state) => {
        console.log("📦 Rehydratation du store:", state);
      },
    }
  )
);
