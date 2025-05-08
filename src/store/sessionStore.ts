import { v4 as uuidv4 } from "uuid"; // Assurez-vous d'installer uuid: npm install uuid
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types pour les données des étapes
interface StepData {
  [key: string]: any;
}

interface SessionState {
  // État
  sessionId: string | null;
  stepsData: {
    [stepId: string]: StepData;
  };
  verificationData: any; // Ajout pour stocker les données de vérification

  // Actions
  initSession: () => void;
  getSessionId: () => string | null;
  saveStepData: (stepId: string, data: StepData) => void;
  getStepData: (stepId: string) => StepData | null;
  clearSession: () => void;
  saveVerificationData: (data: any) => void; // Nouvelle fonction
  getVerificationData: () => any; // Nouvelle fonction
  resetSession: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      // État initial
      sessionId: null,
      stepsData: {},
      verificationData: null,

      // Initialiser le sessionId
      initSession: () => {
        const { sessionId } = get();
        if (!sessionId) {
          set({ sessionId: uuidv4() });
          console.log("✅ Nouveau sessionId créé:", get().sessionId);
        } else {
          console.log("✅ SessionId existant récupéré:", sessionId);
        }
      },

      // Récupérer le sessionId (avec création si nécessaire)
      getSessionId: () => {
        const { sessionId, initSession } = get();
        if (!sessionId) {
          initSession();
          return get().sessionId as string;
        }
        return sessionId;
      },

      // Sauvegarder les données d'une étape
      saveStepData: (stepId, data) => {
        console.log(`📝 Sauvegarde des données pour l'étape ${stepId}:`, data);
        set((state) => ({
          stepsData: {
            ...state.stepsData,
            [stepId]: data,
          },
        }));
        console.log(`✅ Données sauvegardées pour l'étape ${stepId}`);
      },

      // Récupérer les données d'une étape
      getStepData: (stepId) => {
        const { stepsData } = get();
        return stepsData[stepId] || null;
      },

      // Effacer toutes les données de session
      clearSession: () => set({ sessionId: null, stepsData: {} }),

      // Nouvelles fonctions pour les données de vérification
      saveVerificationData: (data) => {
        set({ verificationData: data });
      },

      getVerificationData: () => get().verificationData,

      resetSession: () => {
        set({
          sessionId: null,
          stepData: {},
          verificationData: null,
        });
      },
    }),
    {
      name: "session-storage", // Nom pour le stockage persistant
      onRehydrateStorage: (state) => {
        console.log("📦 Rehydratation du store session:", state);
      },
    }
  )
);
