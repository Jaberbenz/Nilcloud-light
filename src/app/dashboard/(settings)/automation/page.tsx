"use client";

import SimplifiedWorkflow from "@/components/SimplifiedWorkFlow";
import React, { useState } from "react";

type Option = {
  id: string;
  name: string;
  details: {
    name: string;
    type: string;
    mandatory: string;
    description: string;
    default: string;
  }[];
};

// Définition des options et de leurs détails
const options: Option[] = [
  {
    id: "generate_doc",
    name: "Générer Documentation",
    details: [
      {
        name: "stage",
        type: "string",
        mandatory: "false",
        description: "Defines the stage name",
        default: "documenting",
      },
      {
        name: "job_name",
        type: "string",
        mandatory: "false",
        description: "Defines the job name",
        default: "generate_doc",
      },
      {
        name: "doxyfile_path",
        type: "string",
        mandatory: "false",
        description: "Define the doxyfile directory path",
        default: "./DOCS/Doxyfile",
      },
      {
        name: "cache_key",
        type: "string",
        mandatory: "false",
        description: "Define the python cache key",
        default: "doxygen_generation_cache_$CI_PIPELINE_IID",
      },
    ],
  },
  {
    id: "quality_code",
    name: "Qualité du Code",
    details: [
      // détails supplémentaires pour cette option
    ],
  },
  {
    id: "packaging_cxfreeze",
    name: "Packaging - CXFreeze",
    details: [
      // détails supplémentaires pour cette option
    ],
  },
  // Ajoutez d'autres options ici si nécessaire...
];

const AutomationPage: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("generate_doc");

  const handleOptionClick = (id: string) => {
    setSelectedOption(id);
  };

  const selectedDetails = options.find(
    (option) => option.id === selectedOption,
  );

  return (
    <div>
      <SimplifiedWorkflow />

      <div className="min-h-screen bg-gray-900 p-6 text-white">
        {/* Section supérieure - Options et Détails */}
        <div className="mb-6 flex w-full">
          {/* Sidebar avec les options */}
          <div className="w-1/4 border-r border-gray-800 pr-6">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                className={`mb-2 w-full rounded-lg p-4 text-left transition-colors ${
                  selectedOption === option.id ? "bg-gray-800" : "bg-gray-700"
                } hover:bg-gray-600`}
              >
                {option.name}
              </button>
            ))}
          </div>

          {/* Tableau de Détails */}
          <div className="w-3/4 pl-6">
            {selectedDetails && (
              <>
                <h2 className="mb-4 text-2xl font-semibold">
                  {selectedDetails.name}
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto border-collapse text-left">
                    <thead>
                      <tr className="bg-gray-800">
                        <th className="border-b border-gray-700 px-4 py-2">
                          Name
                        </th>
                        <th className="border-b border-gray-700 px-4 py-2">
                          Type
                        </th>
                        <th className="border-b border-gray-700 px-4 py-2">
                          Mandatory
                        </th>
                        <th className="border-b border-gray-700 px-4 py-2">
                          Description
                        </th>
                        <th className="border-b border-gray-700 px-4 py-2">
                          Default
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedDetails.details.map((detail, index) => (
                        <tr key={index} className="hover:bg-gray-700">
                          <td className="border-b border-gray-800 px-4 py-2">
                            {detail.name}
                          </td>
                          <td className="border-b border-gray-800 px-4 py-2">
                            {detail.type}
                          </td>
                          <td className="border-b border-gray-800 px-4 py-2">
                            {detail.mandatory}
                          </td>
                          <td className="border-b border-gray-800 px-4 py-2">
                            {detail.description}
                          </td>
                          <td className="border-b border-gray-800 px-4 py-2">
                            {detail.default}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationPage;
