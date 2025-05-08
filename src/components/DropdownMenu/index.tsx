import { useState } from "react";

const DropdownMenu = () => {
  const [selectedEnv, setSelectedEnv] = useState("Pré-production");
  const [isOpen, setIsOpen] = useState(false);

  const environments = ["Pré-production", "Recette", "Production"];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-lg bg-gray-200 px-4 py-2 focus:outline-none dark:bg-gray-800"
      >
        {selectedEnv}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 divide-y divide-gray-100 rounded-lg bg-white shadow-lg dark:divide-gray-700 dark:bg-gray-800">
          {environments.map((env) => (
            <button
              key={env}
              onClick={() => {
                setSelectedEnv(env);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              {env}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
