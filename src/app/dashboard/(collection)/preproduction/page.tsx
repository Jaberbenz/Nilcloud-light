"use client";

import React from "react";

const PreproductionPage = () => {
  const sections = [
    { title: "Account" },
    { title: "SSH Keys" },
    { title: "Billing" },
    { title: "Environment" },
    { title: "Automatisation" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 p-10 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        {sections.map((section, index) => (
          <div
            key={index}
            className="rounded-lg bg-white p-6 shadow-lg transition-transform hover:scale-105 dark:bg-gray-800"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {section.title}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreproductionPage;
