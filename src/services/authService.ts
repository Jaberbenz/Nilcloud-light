// URL de base de l'API (gateway locale ou prod)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Service de gestion de l'authentification
export const authService = {
  // Vérifie l'état d'authentification de l'utilisateur
  async checkAuth() {
    const response = await fetch(`${API_URL}/auth/check-auth`, {
      credentials: "include", // Inclut les cookies dans la requête
    });

    if (!response.ok) throw new Error("Auth check failed");

    return response.json();
  },

  // Déconnexion de l'utilisateur (si tu ajoutes cette route plus tard dans le microservice)
  async logout() {
    const response = await fetch(`${API_URL}/auth/logout`, {
      credentials: "include",
    });

    if (!response.ok) throw new Error("Logout failed");

    return response.json();
  },

  // Redirige vers Authentik via le backend (pas besoin d'appel direct)
  login() {
    window.location.href = `${API_URL}/auth/login`;
  },

  // Plus utilisé car le callback est géré côté backend
  async handleCallback(_code: string) {
    // plus nécessaire : tout est géré via /auth/callback directement dans Express
    return { success: true };
  },
};
