"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const SettingsLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const tabs = [
    { name: "Account", path: "/dashboard/account" },
    { name: "SSH Keys", path: "/dashboard/sshKeys" },
    { name: "Billing", path: "/dashboard/billing" },
    { name: "Environment", path: "/dashboard/environment" },
    { name: "Automation", path: "/dashboard/automation" },
  ];

  const [activeTab, setActiveTab] = useState("Account");
  const pathname = usePathname();

  useEffect(() => {
    const currentTab =
      tabs.find((tab) => pathname.includes(tab.path))?.name || "Account";
    setActiveTab(currentTab);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text px-6 py-10">
      {/* Grand Titre Centré */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-light-primary dark:text-dark-highlight">
          Settings
        </h1>
        <p className="mt-2 text-lg text-light-secondary dark:text-dark-secondary">
          Setup everything you need
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
      <div className="mx-auto w-full max-w-6xl rounded-xl bg-light-card p-6 shadow-lg transition-all dark:bg-dark-card dark:text-dark-text">
        {children}
      </div>
    </div>
  );
};

export default SettingsLayout;
