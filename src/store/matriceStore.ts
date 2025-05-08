import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Template {
  name: string;
}

interface Service {
  name: string;
  entrypoints: string;
  templates: string[];
}

interface Framework {
  name: string;
  templates: string[];
}

interface Language {
  name: string;
  frameworks: {
    [key: string]: string[];
  };
  package_managers: string[];
  templates: {
    [key: string]: string[];
  };
}

interface Database {
  name: string;
  entrypoints: string;
  templates: string[];
}

interface ServiceResponse {
  data: {
    [key: string]: {
      entrypoints: string;
      templates: string[];
    };
  };
  message: string;
}

interface DatabaseResponse {
  data: {
    [key: string]: {
      entrypoints: string;
      templates: string[];
    };
  };
  message: string;
}

interface LanguageResponse {
  data: {
    [key: string]: {
      frameworks: {
        [key: string]: string[];
      };
      package_managers: string[];
      templates: {
        [key: string]: string[];
      };
    };
  };
  message: string;
}

interface MatriceState {
  services: { [key: string]: Service };
  databases: { [key: string]: Database };
  languages: { [key: string]: Language };
  setServices: (response: ServiceResponse) => void;
  setDatabases: (response: DatabaseResponse) => void;
  setLanguages: (response: LanguageResponse) => void;
  clearMatrices: () => void;
}

export const useMatriceStore = create<MatriceState>()(
  persist(
    (set) => ({
      services: {},
      databases: {},
      languages: {},
      setServices: (response: ServiceResponse) => {
        console.log("🔄 setServices appelé avec:", response);
        try {
          if (!response?.data || typeof response.data !== "object") {
            throw new Error("Format de données de services invalide");
          }

          const formattedServices = Object.entries(response.data).reduce<{
            [key: string]: Service;
          }>((acc, [name, details]) => {
            if (!details?.entrypoints || !Array.isArray(details.templates)) {
              console.warn(
                `⚠️ Service ${name} ignoré : données invalides`,
                details
              );
              return acc;
            }
            return {
              ...acc,
              [name]: {
                name,
                entrypoints: details.entrypoints,
                templates: details.templates,
              },
            };
          }, {});

          set({ services: formattedServices });
          console.log("✅ Services mis à jour:", formattedServices);
        } catch (error) {
          console.error("❌ Erreur lors du traitement des services:", error);
        }
      },
      setDatabases: (response: DatabaseResponse) => {
        console.log("🔄 setDatabases appelé avec:", response);
        try {
          if (!response?.data || typeof response.data !== "object") {
            throw new Error("Format de données de bases de données invalide");
          }

          const formattedDatabases = Object.entries(response.data).reduce<{
            [key: string]: Database;
          }>((acc, [name, details]) => {
            if (!details?.entrypoints || !Array.isArray(details.templates)) {
              console.warn(
                `⚠️ Base de données ${name} ignorée : données invalides`,
                details
              );
              return acc;
            }
            return {
              ...acc,
              [name]: {
                name,
                entrypoints: details.entrypoints,
                templates: details.templates,
              },
            };
          }, {});

          set({ databases: formattedDatabases });
          console.log("✅ Bases de données mises à jour:", formattedDatabases);
        } catch (error) {
          console.error(
            "❌ Erreur lors du traitement des bases de données:",
            error
          );
        }
      },
      setLanguages: (response: LanguageResponse) => {
        console.log("🔄 setLanguages appelé avec:", response);
        try {
          if (!response?.data || typeof response.data !== "object") {
            throw new Error("Format de données de langages invalide");
          }

          const formattedLanguages = Object.entries(response.data).reduce<{
            [key: string]: Language;
          }>((acc, [name, details]) => {
            if (
              !details?.frameworks ||
              !Array.isArray(details.package_managers) ||
              !details.templates
            ) {
              console.warn(
                `⚠️ Langage ${name} ignoré : données invalides`,
                details
              );
              return acc;
            }
            return {
              ...acc,
              [name]: {
                name,
                frameworks: details.frameworks,
                package_managers: details.package_managers,
                templates: details.templates,
              },
            };
          }, {});

          set({ languages: formattedLanguages });
          console.log("✅ Langages mis à jour:", formattedLanguages);
        } catch (error) {
          console.error("❌ Erreur lors du traitement des langages:", error);
        }
      },
      clearMatrices: () => set({ services: {}, databases: {}, languages: {} }),
    }),
    {
      name: "matrice-storage",
      onRehydrateStorage: (state) => {
        console.log("📦 Rehydratation du store matrices:", state);
      },
    }
  )
);
