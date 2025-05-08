import { create } from "zustand";

// Définition de la structure d'un utilisateur
interface User {
  id: string;
  email: string;
  gitlabUserId?: string; // Optionnel - ID GitLab de l'utilisateur
  role?: string; // Optionnel - Rôle de l'utilisateur (admin, user, etc.)
  name?: string; // Nom complet de l'utilisateur
  username?: string; // Nom d'utilisateur
  avatarUrl?: string; // URL de l'avatar
}

// État global de l'authentification
interface AuthState {
  isAuthenticated: boolean; // État de connexion de l'utilisateur
  user: User | null; // Données de l'utilisateur connecté
  setAuth: (isAuthenticated: boolean, user?: User | null) => void; // Mettre à jour l'état d'auth
  logout: () => void; // Déconnecter l'utilisateur
  checkAuth: () => Promise<void>; // Vérifier l'état d'authentification
}

// Création du store d'authentification
export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  setAuth: (isAuthenticated, user = null) => set({ isAuthenticated, user }),
  logout: () => set({ isAuthenticated: false, user: null }),
  checkAuth: async () => {
    try {
      const response = await fetch("https://api.nilcloud.net/auth/check-auth", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        set({ isAuthenticated: data.isAuthenticated, user: data.user });
      } else {
        set({ isAuthenticated: false, user: null });
      }
    } catch (error) {
      console.error(
        "Erreur lors de la vérification de l'authentification:",
        error
      );
      set({ isAuthenticated: false, user: null });
    }
  },
}));
