import { v4 as uuidv4 } from "uuid";

const API_URL = "https://api.nilcloud.net";

export const projectService = {
  // Récupère tous les projets
  async getAllProjects() {
    const response = await fetch(`${API_URL}/project/`, {
      credentials: "include",
    });
    if (!response.ok) {
      const errText = await response.text();
      console.error("Error details:", errText);
      throw new Error("Failed to fetch projects");
    }
    return response.json();
  },

  // Récupère un projet via son identifiant
  async getProjectById(id: string) {
    console.log("Fetching project details for id:", id);
    const response = await fetch(`${API_URL}/project/${id}`, {
      credentials: "include",
    });
    if (!response.ok) {
      const errText = await response.text();
      console.error("Error details:", errText);
      throw new Error("Failed to fetch project details");
    }
    return response.json();
  },

  // Crée un nouveau projet en initialisant le pipeline
  async createProject() {
    // Génération d'un identifiant de session unique
    const sessionId = uuidv4();
    const response = await fetch("https://an-dir.nilcloud.net/api/pipeline/init", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ session_id: sessionId }),
      credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to initialize pipeline");

    // Stocke le sessionId pour un usage ultérieur
    localStorage.setItem("pipelineSessionId", sessionId);
    return sessionId;
  },
};
