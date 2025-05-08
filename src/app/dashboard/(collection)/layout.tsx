"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SettingsLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const tabs = [
    { name: "Recette", path: "/dashboard/recette" },
    { name: "Preproduction", path: "/dashboard/preproduction" },
    { name: "Production", path: "/dashboard/production" },
  ];

  const [activeTab, setActiveTab] = useState("Production");
  const pathname = usePathname();

  useEffect(() => {
    const currentTab =
      tabs.find((tab) => pathname.includes(tab.path))?.name || "Production";
    setActiveTab(currentTab);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text px-6 py-10">
      {/* Grand Titre Centré */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-light-primary dark:text-dark-highlight">
          Collection
        </h1>
        <p className="mt-2 text-lg text-light-secondary dark:text-dark-secondary">
          Navigate through your collection
        </p>
      </div>

      {/* Navigation des Onglets */}
      <div className="mb-10 flex justify-center">
        <div className="flex space-x-4 rounded-full bg-light-card p-1 shadow-lg dark:bg-dark-card">
          {tabs.map((tab) => (
            <Link key={tab.name} href={tab.path}>
              <div
                className={`cursor-pointer rounded-full px-6 py-2 text-sm font-medium transition-all ${
                  activeTab === tab.name
                    ? "bg-light-primary text-white shadow-md dark:bg-dark-primary dark:text-dark-background"
                    : "text-light-secondary hover:text-light-primary dark:text-dark-secondary dark:hover:text-dark-highlight"
                }`}
              >
                {tab.name}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Contenu */}
      <div className="mx-auto w-full max-w-4xl rounded-xl bg-light-card p-6 shadow-lg dark:bg-dark-card dark:text-dark-text">
        {children}
      </div>
    </div>
  );
};

export default SettingsLayout;
