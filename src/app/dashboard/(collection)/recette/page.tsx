"use client";

import React, { useEffect, useState } from "react";

type SavedStructure = {
  label: string;
};

const ProductionPage = () => {
  const [structures, setStructures] = useState<SavedStructure[]>([]);

  useEffect(() => {
    // Charger les structures à partir du LocalStorage
    const savedStructures = localStorage.getItem("savedWorkflowStructure");
    if (savedStructures) {
      setStructures(JSON.parse(savedStructures));
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col p-10 text-gray-900 dark:text-gray-100">
      <h1 className="mb-6 text-center text-3xl font-bold">
        Explorez vos Structures
      </h1>
      <div className="mx-auto grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {structures.map((structure, index) => (
          <div
            key={index}
            className="cursor-pointer rounded-lg bg-white p-6 shadow-md transition-all hover:bg-gray-700 dark:bg-gray-800"
          >
            <h2 className="text-xl font-semibold text-gray-100">
              {structure.label || `Structure ${index + 1}`}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductionPage;
