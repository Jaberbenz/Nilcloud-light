"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Composant qui protège les routes nécessitant une authentification
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Vérifie l'état d'authentification auprès du serveur
    const checkAuth = async () => {
      try {
        // Appel à l'API de vérification d'auth avec les credentials
        const response = await fetch("https://api.nilcloud.net/check-auth", {
          method: "GET",
          credentials: "include", // Inclut les cookies dans la requête
        });

        if (!response.ok) {
          // Si non authentifié, mise à jour du store et redirection
          useAuthStore.getState().setAuth(false);
          router.push("/login");
          return;
        }

        // Si authentifié, mise à jour du store avec les données utilisateur
        const data = await response.json();
        useAuthStore.getState().setAuth(true, data.user);
      } catch (error) {
        console.error("Auth check failed:", error);
        useAuthStore.getState().setAuth(false);
        router.push("/login");
      }
    };

    // Lance la vérification si l'utilisateur n'est pas déjà authentifié
    if (!isAuthenticated) {
      checkAuth();
    }
  }, [isAuthenticated, router]);

  // Retourne null pendant la vérification d'auth
  if (!isAuthenticated) {
    return null;
  }

  // Affiche le contenu protégé si authentifié
  return <>{children}</>;
}
