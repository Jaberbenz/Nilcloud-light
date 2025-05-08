"use client";

import { useMatriceStore } from "@/store/matriceStore";
import { Code, Database, Search, Server, Settings } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

type Node = {
  id: string;
  label: string;
  icon: string;
  type: "service" | "database" | "language";
  isFromAnalysis: boolean;
  packageManager?: string;
  selectedFramework?: string;
  selectedTemplate?: string;
};

const NodeLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [availableTemplates, setAvailableTemplates] = useState<string[]>([]);
  const [selectedPackageManager, setSelectedPackageManager] =
    useState<string>("");
  const [availablePackageManagers, setAvailablePackageManagers] = useState<
    string[]
  >([]);

  const { services, databases } = useMatriceStore();

  const createNode = (
    name: string,
    details: unknown,
    type: "service" | "database" | "language"
  ): Node => ({
    id: `${type}-${name}`,
    label: name,
    icon: `${name.toLowerCase()}.svg`,
    type,
    isFromAnalysis: false,
  });

  useEffect(() => {
    console.log("🔄 useEffect déclenché avec les matrices:");
    console.log("📦 Services:", services);
    console.log("🗄️ Bases de données:", databases);

    const allNodes = [
      ...Object.entries(services).map(([name, details]) =>
        createNode(name, details, "service")
      ),
      ...Object.entries(databases).map(([name, details]) =>
        createNode(name, details, "database")
      ),
    ];

    console.log("✅ Tous les nœuds générés:", allNodes);
    setNodes(allNodes);
  }, [services, databases]);

  const filteredNodes = nodes.filter((node) =>
    node.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (node: Node) => {
    setSelectedNode(node);

    if (node.type === "database" && databases[node.label]) {
      setAvailableTemplates(databases[node.label].templates);
      setSelectedTemplate(node.selectedTemplate || "");

      setAvailablePackageManagers([]);
      setSelectedPackageManager("");
    } else if (node.type === "service" && services[node.label]) {
      setAvailableTemplates(services[node.label].templates);
      setSelectedTemplate(node.selectedTemplate || "");

      setAvailablePackageManagers([]);
      setSelectedPackageManager("");
    }

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNode(null);
    setAvailableTemplates([]);
    setSelectedTemplate("");
    setAvailablePackageManagers([]);
    setSelectedPackageManager("");
  };

  const saveChanges = () => {
    if (selectedNode) {
      const updatedNode = {
        ...selectedNode,
        selectedTemplate,
        packageManager: selectedPackageManager,
      };
      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === selectedNode.id ? updatedNode : node
        )
      );
      closeModal();
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "service":
        return <Server className="h-5 w-5 text-blue-400" />;
      case "database":
        return <Database className="h-5 w-5 text-green-400" />;
      case "language":
        return <Code className="h-5 w-5 text-purple-400" />;
      default:
        return <Settings className="h-5 w-5 text-gray-400" />;
    }
  };

  const renderModalContent = () => {
    if (!selectedNode) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-xl bg-slate-800 p-6 shadow-2xl border border-slate-700">
          <h2 className="mb-6 text-center text-2xl font-bold text-white">
            Configuration pour {selectedNode.label}
          </h2>

          <div className="space-y-4 mb-6">
            {(selectedNode.type === "database" ||
              selectedNode.type === "service") &&
              availableTemplates.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Template disponible
                  </label>
                  <select
                    className="w-full rounded-md border border-slate-600 bg-slate-700 p-2.5 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                  >
                    <option value="" className="bg-slate-700">
                      Sélectionner un template
                    </option>
                    {availableTemplates.map((template) => (
                      <option
                        key={template}
                        value={template}
                        className="bg-slate-700"
                      >
                        {template}
                      </option>
                    ))}
                  </select>
                </div>
              )}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={closeModal}
              className="rounded-md bg-slate-600 px-4 py-2 text-white hover:bg-slate-500 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={saveChanges}
              className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 transition-colors"
              disabled={
                (selectedNode.type === "database" ||
                  selectedNode.type === "service") &&
                !selectedTemplate
              }
            >
              Appliquer
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="node-library">
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="w-full rounded-lg border border-slate-600 bg-slate-700/50 pl-10 pr-4 py-3 text-white placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors duration-200"
          placeholder="Rechercher des composants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filteredNodes.map((node) => (
          <div
            key={node.id}
            draggable
            onDragStart={(e) => {
              const nodeData = {
                ...node,
                selectedTemplate: node.selectedTemplate || "",
                packageManager: node.packageManager || "",
              };

              console.log("🔄 Nœud en cours de déplacement:", nodeData);

              e.dataTransfer.setData(
                "application/reactflow",
                JSON.stringify(nodeData)
              );
              e.dataTransfer.effectAllowed = "move";
            }}
            className={`relative flex flex-col items-center justify-center rounded-lg p-4 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl cursor-grab
              ${
                node.type === "service"
                  ? "bg-blue-900/70 border border-blue-700/50 hover:border-blue-500/70"
                  : "bg-green-900/70 border border-green-700/50 hover:border-green-500/70"
              }`}
          >
            <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-slate-800/70 text-xs font-medium text-slate-300 border border-slate-700/50">
              {node.type}
            </div>

            <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-slate-800/70 border border-slate-700/50 mb-3">
              {node.icon ? (
                <img
                  src={`/${node.icon}`}
                  alt={node.label}
                  className="h-8 w-8"
                />
              ) : (
                <span className="text-white font-bold text-lg">
                  {node.label.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <span className="text-white font-medium text-center">
              {node.label}
            </span>

            {(node.type === "database" || node.type === "service") &&
              node.selectedTemplate && (
                <span className="mt-1 text-xs text-slate-300 text-center px-2 py-0.5 rounded-full bg-slate-800/50 border border-slate-700/50">
                  {node.selectedTemplate}
                </span>
              )}

            <button
              onClick={() => openModal(node)}
              className="absolute right-2 top-2 rounded-full bg-slate-800/70 border border-slate-700/50 p-1.5 text-white hover:bg-slate-700 transition-colors"
              title="Configurer le nœud"
            >
              <Settings className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && selectedNode && renderModalContent()}
    </div>
  );
};

export default NodeLibrary;
