"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CallbackPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
          }/auth/check-auth`,
          {
            credentials: "include",
          }
        );

        if (res.ok) {
          const data = await res.json();
          setAuth(true, data.user);
          router.push("/dashboard"); // redirection après login réussi
        } else {
          setAuth(false, null);
          router.push("/login"); // en cas d’échec d’authentification
        }
      } catch (err) {
        console.error("Erreur d'authentification :", err);
        setAuth(false, null);
        router.push("/login");
      }
    };

    checkAuth();
  }, [router, setAuth]);

  return <div className="p-4">Connexion en cours...</div>;
}
