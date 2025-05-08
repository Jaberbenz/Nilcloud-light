const API_BASE_URL = "http://localhost:5000/api"; // Modifié pour pointer vers l'API Python

interface ApiResponse {
  data: Array<
    {
      file: string;
      processed_content: {
        type: string;
        metadata: {
          env: {
            APP_NAME: string;
            DOMINANT_LANGUAGE: string;
            PACKAGE_MANAGER: string;
            FRAMEWORK_DETECTED: string;
            APP_MAIN: string;
            APP_CONFIG: string;
            ENTRYPOINT: string;
          };
          dependencies?: string[];
        };
      };
    }[]
  >;
}

export const apiService = {
  async uploadFile(formData: FormData): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/analyze_dir`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erreur API :", errorText);
        throw new Error(`Erreur lors de l'analyse du fichier : ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur lors de l'upload :", error);
      throw error;
    }
  },

  async fetchServices() {
    try {
      const response = await fetch(`${API_BASE_URL}/services`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur fetchServices:", error);
      throw new Error("Erreur lors de la récupération des services");
    }
  },

  async fetchLanguages() {
    try {
      const response = await fetch(`${API_BASE_URL}/languages`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur fetchLanguages:", error);
      throw new Error("Erreur lors de la récupération des langages");
    }
  },

  async fetchDatabases() {
    try {
      const response = await fetch(`${API_BASE_URL}/databases`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des bases de données");
      }
      return response.json();
    } catch (error) {
      console.error("❌ Erreur fetchDatabases:", error);
      throw error;
    }
  },
};
