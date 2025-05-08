"use client";

import React, { useEffect, useState } from "react";
import LargeModal from "../../../../components/LargeModal";
import StaticWorkflow from "../../../../components/StaticWorkflow";

import { Node, Edge } from "reactflow";

type NodeData = {
  label: string;
  icon?: string;
  nodes?: NodeData[];
};

type SavedStructure = {
  name: string;
  description: string;
  nodes: NodeData[];
};

const ProductionPage = () => {
  const [structures, setStructures] = useState<SavedStructure[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStructure, setSelectedStructure] =
    useState<SavedStructure | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (selectedStructure) {
      const convertToReactFlowNodes = (
        nodeDataList: NodeData[],
        parentId: string | null = null
      ): Node[] => {
        return nodeDataList.map((nodeData, index) => {
          const id = parentId ? `${parentId}_${index}` : `node_${index}`;
          const xPosition = (index % 3) * 300;
          const yPosition = Math.floor(index / 3) * 200;

          return {
            id,
            position: { x: xPosition, y: yPosition },
            data: { ...nodeData },
          };
        });
      };

      const transformedNodes = convertToReactFlowNodes(selectedStructure.nodes);

      const generateEdges = (nodeList: Node[]): Edge[] => {
        return nodeList.slice(0, -1).map((node, index) => ({
          id: `edge_${index}`,
          source: node.id,
          target: nodeList[index + 1].id,
          type: "smoothstep",
        }));
      };

      setNodes(transformedNodes);
      setEdges(generateEdges(transformedNodes));
    }
  }, [selectedStructure]);

  useEffect(() => {
    const keys = Object.keys(localStorage);
    const loadedStructures: SavedStructure[] = keys
      .filter((key) => key.startsWith("workflowStructure_"))
      .map((key) => {
        const savedStructure = localStorage.getItem(key);
        if (savedStructure) {
          try {
            return {
              name: key.replace("workflowStructure_", ""),
              ...JSON.parse(savedStructure),
            };
          } catch (error) {
            console.error(
              `Erreur lors de la lecture de la clé ${key} :`,
              error
            );
          }
        }
        return null;
      })
      .filter(Boolean) as SavedStructure[];

    setStructures(loadedStructures);
  }, []);

  const filteredStructures = structures.filter((structure) =>
    structure.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClickStructure = (structure: SavedStructure) => {
    setSelectedStructure(structure);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedStructure(null);
    setIsModalOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text p-10">
      {/* Barre de recherche */}
      <div className="mx-auto mb-8 w-full max-w-lg">
        <input
          type="text"
          placeholder="Rechercher une structure..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-light-border bg-light-card p-4 text-light-primary shadow-md focus:outline-none focus:ring-2 focus:ring-light-primary dark:border-dark-border dark:bg-dark-card dark:text-dark-text dark:focus:ring-dark-highlight"
        />
      </div>

      {/* Liste des structures */}
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredStructures.length > 0 ? (
          filteredStructures.map((structure, index) => (
            <div
              key={index}
              onClick={() => handleClickStructure(structure)}
              className="relative flex flex-col justify-between h-64 rounded-lg bg-light-card p-6 shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-light-highlight hover:text-white dark:bg-dark-card dark:hover:bg-dark-primary dark:hover:text-dark-background"
            >
              {/* Titre */}
              <h2 className="text-2xl font-bold text-light-primary dark:text-dark-highlight ">
                {structure.name || `Structure ${index + 1}`}
              </h2>
              {/* Description */}
              <p className="text-sm text-light-secondary dark:text-dark-secondary flex-grow mt-2">
                {structure.description?.substring(0, 100) ||
                  "Aucune description disponible."}
              </p>
              {/* Bouton View Structure */}
              <div className="absolute bottom-4 right-4">
                <span className="text-sm font-medium text-light-primary dark:text-dark-highlight hover:text-white cursor-pointer">
                  View Structure →
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-light-secondary dark:text-dark-secondary">
            Aucune structure sauvegardée pour le moment.
          </p>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedStructure && (
        <LargeModal onClose={handleCloseModal}>
          <h3 className="mb-4 text-2xl font-bold text-light-primary dark:text-dark-highlight">
            {selectedStructure.name}
          </h3>
          <p className="mb-6 text-light-secondary dark:text-dark-secondary">
            {selectedStructure.description}
          </p>
          <div className="relative mb-6 h-[600px] w-full">
            <StaticWorkflow nodes={nodes} edges={edges} />
          </div>
          <button
            onClick={handleCloseModal}
            className="rounded-lg bg-light-primary px-6 py-3 text-white shadow-md hover:bg-light-highlight dark:bg-dark-highlight dark:hover:bg-dark-border"
          >
            Fermer
          </button>
        </LargeModal>
      )}
    </div>
  );
};

export default ProductionPage;
