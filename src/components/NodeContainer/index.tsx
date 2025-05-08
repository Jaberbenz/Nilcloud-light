"use client";
import type React from "react";
import { useEffect } from "react";
import { X, Code, Database, Server, Settings } from "lucide-react";

type NodeData = {
  label: string;
  icon?: string;
  selectedTemplate?: string;
  packageManager?: string;
  type?: "service" | "database" | "language";
};

type NodeContainerProps = {
  nodes: NodeData[];
  onDeleteNode?: (nodeIndex: number) => void;
  onDeleteParent?: () => void;
};

const NodeContainer: React.FC<NodeContainerProps> = ({
  nodes,
  onDeleteNode,
  onDeleteParent,
}) => {
  // Filtrer les nœuds qui n'ont pas de label ou un label vide
  const filteredNodes = nodes.filter(
    (node) => node.label && node.label.trim() !== ""
  );

  // Log les données initiales que NodeContainer reçoit
  useEffect(() => {
    console.log("NodeContainer received nodes (useEffect):", filteredNodes);
  }, [filteredNodes]);

  // Une fois avant chaque rendu pour voir si le composant reçoit bien les données correctes
  console.log("NodeContainer received nodes (before render):", filteredNodes);

  const getNodeIcon = (type?: string) => {
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

  if (!filteredNodes || filteredNodes.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-slate-700/50 bg-slate-800/70 p-5 text-slate-400 shadow-md">
        Aucun composant à afficher
      </div>
    );
  }

  return (
    <div className="w-full min-w-[280px]">
      {filteredNodes.map((node, index) => (
        <div
          key={index}
          className="relative w-full rounded-lg bg-slate-800/90 border border-slate-700/50 shadow-lg overflow-hidden mb-4 hover:border-slate-600 transition-colors duration-200"
        >
          {/* Header avec icône, nom et bouton de suppression */}
          <div className="flex items-center justify-between bg-slate-700/70 p-3 border-b border-slate-700/50">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800/70 border border-slate-700/50 mr-3">
                {node.icon && node.icon.endsWith(".svg") ? (
                  <img
                    src={`/${node.icon}`}
                    alt={node.label}
                    className="h-6 w-6"
                  />
                ) : (
                  getNodeIcon(node.type)
                )}
              </div>
              <div>
                <h3 className="text-white font-medium">{node.label}</h3>
                <p className="text-xs text-slate-400">
                  {node.type === "language" && node.packageManager
                    ? node.packageManager
                    : node.selectedTemplate || "Aucun template sélectionné"}
                </p>
              </div>
            </div>
            {onDeleteNode && (
              <button
                className="h-7 w-7 rounded-full bg-red-600/80 text-white flex items-center justify-center hover:bg-red-600 transition-colors absolute top-2 right-2"
                onClick={() => onDeleteNode(index)}
                title="Supprimer ce nœud"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Contenu du nœud avec plus d'informations */}
          <div className="p-3 text-white">
            {node.type === "service" && (
              <div className="text-sm space-y-1">
                <p className="flex items-center text-slate-300">
                  <Server className="h-4 w-4 mr-2 text-blue-400" />
                  Type: Service
                </p>
                {node.selectedTemplate && (
                  <p className="flex items-center text-slate-300">
                    <Settings className="h-4 w-4 mr-2 text-blue-400" />
                    Template: {node.selectedTemplate}
                  </p>
                )}
              </div>
            )}
            {node.type === "database" && (
              <div className="text-sm space-y-1">
                <p className="flex items-center text-slate-300">
                  <Database className="h-4 w-4 mr-2 text-green-400" />
                  Type: Database
                </p>
                {node.selectedTemplate && (
                  <p className="flex items-center text-slate-300">
                    <Settings className="h-4 w-4 mr-2 text-green-400" />
                    Template: {node.selectedTemplate}
                  </p>
                )}
              </div>
            )}
            {node.type === "language" && (
              <div className="text-sm space-y-1">
                <p className="flex items-center text-slate-300">
                  <Code className="h-4 w-4 mr-2 text-purple-400" />
                  Type: Language
                </p>
                {node.packageManager && (
                  <p className="flex items-center text-slate-300">
                    <Settings className="h-4 w-4 mr-2 text-purple-400" />
                    Package Manager: {node.packageManager}
                  </p>
                )}
                {node.selectedTemplate && (
                  <p className="flex items-center text-slate-300">
                    <Settings className="h-4 w-4 mr-2 text-purple-400" />
                    Template: {node.selectedTemplate}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      ))}

      {onDeleteParent && (
        <button
          className="w-full py-2.5 rounded-lg bg-red-600/80 text-white hover:bg-red-600 transition-colors flex items-center justify-center"
          onClick={onDeleteParent}
          title="Supprimer le groupe entier"
        >
          <X className="h-4 w-4 mr-2" />
          Supprimer le groupe
        </button>
      )}
    </div>
  );
};

export default NodeContainer;
