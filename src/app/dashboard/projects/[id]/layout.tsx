"use client";

import type React from "react";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // On récupère l'id via useParams()
  const { id } = useParams() as { id: string };

  // Les onglets, chacun pointe vers un sous-chemin
  const tabs = [
    { name: "Overview", path: `/dashboard/projects/${id}` }, // page.tsx
    { name: "CI Logs", path: `/dashboard/projects/${id}/ciLogs` }, // ciLogs/page.tsx
    { name: "CD Logs", path: `/dashboard/projects/${id}/cdLogs` }, // cdLogs/page.tsx
  ];

  const [activeTab, setActiveTab] = useState("Overview");
  const pathname = usePathname();

  // Détecte quel onglet est actif en fonction de l'URL
  useEffect(() => {
    const currentTab =
      tabs.find((tab) => pathname === tab.path)?.name || "Overview";
    setActiveTab(currentTab);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B1120] text-slate-800 dark:text-slate-100">
      <div className="container mx-auto p-6">
        {/* En-tête avec navigation retour */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-indigo-600 dark:text-[#8B9FFF]">
            Project Details
          </h1>
        </div>

        {/* Barre d'onglets */}
        <div className="mb-6 border-b border-gray-200 dark:border-slate-800">
          <div className="flex space-x-6">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                href={tab.path}
                className="focus:outline-none"
              >
                <div
                  className={`px-2 py-3 border-b-2 transition-all font-medium ${
                    activeTab === tab.name
                      ? "border-indigo-600 dark:border-[#8B5CF6] text-indigo-700 dark:text-white"
                      : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  {tab.name}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Contenu de la page active */}
        <div className="rounded-xl bg-white dark:bg-[#151B2B] border border-gray-200 dark:border-slate-800 shadow-lg p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
