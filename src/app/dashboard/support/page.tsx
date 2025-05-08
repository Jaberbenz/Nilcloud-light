"use client";

import React from "react";

const SupportPage = () => {
  const supportOptions = [
    {
      title: "Learn",
      subtitle: "Documentation",
      additionalInfo: "<page_number>",
    },
    {
      title: "Community",
      subtitle: "Discord",
      additionalInfo: "<member_number>",
    },
  ];

  return (
    <div className=" flex min-h-screen flex-col items-center bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text p-10">
      {/* Titre */}
      <h1 className="mb-6 text-center text-4xl font-extrabold text-light-primary dark:text-dark-primary">
        Need Help?
      </h1>
      <p className="mb-12 text-center text-lg text-light-secondary dark:text-dark-secondary">
        Sometimes, reading the documentation is the best option...
      </p>

      {/* Cartes de support */}
      <div className="flex flex-wrap justify-center gap-8">
        {supportOptions.map((option, index) => (
          <div
            key={index}
            className="flex w-80 flex-col justify-between rounded-lg bg-light-card p-6 shadow-lg transition-transform hover:scale-105 dark:bg-dark-card"
          >
            <h2 className="mb-2 text-xl font-bold text-light-primary dark:text-dark-highlight">
              {option.title}
            </h2>
            <p className="text-2xl font-semibold text-light-secondary dark:text-dark-secondary">
              {option.subtitle}
            </p>
            <p className="mt-2 text-light-text dark:text-dark-text">
              {option.additionalInfo}
            </p>
            <div className="mt-4 text-right">
              <button className="text-xl text-light-primary hover:underline dark:text-dark-highlight">
                &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupportPage;
