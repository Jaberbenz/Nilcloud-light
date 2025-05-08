"use client";

import { useAnalysisStore } from "@/store/analysisStore";
import { useEffect, useRef } from "react";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initStore = useRef(false);

  useEffect(() => {
    console.log("StoreProvider monté");
    console.log("État initial du store:", useAnalysisStore.getState());
  }, []);

  if (!initStore.current) {
    console.log("Première initialisation du StoreProvider");
    initStore.current = true;
  }

  return <>{children}</>;
}
