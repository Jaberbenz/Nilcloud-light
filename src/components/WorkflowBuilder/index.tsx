"use client";

import { useSessionStore } from "@/store/sessionStore";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { type Edge, MarkerType, type Node, Position } from "reactflow";
import Modal from "../Modal";
import NodeContainer from "@/components/NodeContainer";
import NodeLibrary from "@/components/NodeLibrary";
import ReactFlowCanvas from "@/components/ReactFlowCanva";

type NodeData = {
  label: string | React.ReactNode;
  icon?: string;
  apcuEnabled?: boolean;
  opcacheEnabled?: boolean;
  mailFunctionEnabled?: boolean;
  smtp?: string;
  port?: number;
  selectedTemplate?: string;
  packageManager?: string;
  type?: string;
  nodes?: NodeData[];
};

type SavedStructure = {
  name: string;
  description: string;
  nodes: (Node<NodeData> & { position: { x: number; y: number } })[];
};

interface WorkflowBuilderProps {
  onNodesChange?: (nodes: Node<NodeData>[]) => void;
}

export default function WorkflowBuilder({
  onNodesChange,
}: WorkflowBuilderProps) {
  const [nodes, setNodes] = useState<Node<NodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [savedStructures, setSavedStructures] = useState<SavedStructure[]>([]);

  // Utiliser le store au lieu de localStorage
  const { getSessionId } = useSessionStore();

  // Notifier le parent des changements de nodes
  useEffect(() => {
    if (onNodesChange) {
      console.log(
        "Notifying parent of nodes change:",
        JSON.stringify(nodes, null, 2)
      );
      onNodesChange(nodes);
    }
  }, [nodes, onNodesChange]);

  const onDragStart = (event: React.DragEvent, node: Node<NodeData>) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify(node));
    event.dataTransfer.effectAllowed = "move";
  };

  // Ouvrir la modal pour charger
  const handleOpenLoadModal = () => {
    const keys = Object.keys(localStorage).filter((key) =>
      key.startsWith("workflowStructure_")
    );
    const loadedStructures: SavedStructure[] = keys.map((key) => {
      const structure = JSON.parse(localStorage.getItem(key) || "");
      return { name: key.replace("workflowStructure_", ""), ...structure };
    });
    setSavedStructures(loadedStructures);
    setIsLoadModalOpen(true);
  };

  // Fermer la modal
  const handleCloseModal = () => {
    setIsLoadModalOpen(false);
  };

  // Charger la structure à partir du LocalStorage
  const handleLoadStructure = useCallback(
    (selectedName: string) => {
      const savedStructure = localStorage.getItem(
        `workflowStructure_${selectedName}`
      );
      if (savedStructure) {
        const parsedStructure: { description: string; nodes: NodeData[] } =
          JSON.parse(savedStructure);

        if (parsedStructure && parsedStructure.nodes.length > 0) {
          const loadedNodes: Node<NodeData>[] = [];
          const loadedEdges: Edge[] = [];

          parsedStructure.nodes.forEach((data, index) => {
            const position = data.position || { x: index * 300, y: 0 };

            const parentNode: Node<NodeData> = {
              id: data.id || `node_${index}`,
              position,
              data: {
                label: (
                  <NodeContainer
                    nodes={data.nodes || []}
                    onDeleteNode={(nodeIndex) =>
                      handleDeleteNestedNode(`node_${index}`, nodeIndex)
                    }
                    onDeleteParent={() => handleDeleteNode(`node_${index}`)}
                  />
                ),
                nodes: data.nodes,
              },
              type: "default",
              style: {
                backgroundColor: "#1E293B",
                border: "2px solid #444",
                color: "#ffffff",
                padding: "10px",
                borderRadius: "12px",
              },
              sourcePosition: Position.Right,
              targetPosition: Position.Left,
            };

            loadedNodes.push(parentNode);

            if (index > 0) {
              loadedEdges.push({
                id: `edge_node_${index - 1}_node_${index}`,
                source: `node_${index - 1}`,
                target: `node_${index}`,
                markerEnd: { type: MarkerType.Arrow },
              });
            }
          });

          setNodes(loadedNodes);
          setEdges(loadedEdges);

          console.log(
            `Structure "${selectedName}" loaded successfully from LocalStorage.`
          );
          setIsLoadModalOpen(false);
        } else {
          console.error("No valid structure found in LocalStorage.");
        }
      } else {
        console.error("No structure found in LocalStorage.");
      }
    },
    [setNodes, setEdges]
  );

  // Handle deleting a nested node
  const handleDeleteNestedNode = useCallback(
    (parentId: string, nodeIndex: number) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === parentId) {
            const updatedNodes = [...(node.data.nodes || [])];
            updatedNodes.splice(nodeIndex, 1);

            return {
              ...node,
              data: {
                ...node.data,
                nodes: updatedNodes,
                label: (
                  <NodeContainer
                    nodes={updatedNodes}
                    onDeleteNode={(index) =>
                      handleDeleteNestedNode(node.id, index)
                    }
                    onDeleteParent={() => handleDeleteNode(node.id)}
                  />
                ),
              },
            };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );
    },
    [setNodes, setEdges]
  );

  return (
    <div className="bg-gradient-to-b from-slate-800 to-slate-900 min-h-screen text-white p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
            Workflow Builder
          </h1>
          <span className="ml-3 px-3 py-1 text-xs font-medium rounded-full bg-indigo-900/50 border border-indigo-700/50 text-indigo-300">
            Étape 3
          </span>
        </div>

        {/* Canvas ReactFlow */}
        <div className="relative mb-8 h-[600px] w-full rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm shadow-lg overflow-hidden">
          <ReactFlowCanvas
            nodes={nodes}
            setNodes={setNodes}
            edges={edges}
            setEdges={setEdges}
          />
        </div>

        {/* Bibliothèque de nœuds / NodeLibrary */}
        <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm shadow-lg overflow-hidden mb-8">
          <div className="border-b border-slate-700/50 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              Bibliothèque de composants
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Faites glisser les composants sur le canevas pour construire votre
              workflow
            </p>
          </div>
          <div className="p-6">
            <NodeLibrary onDragStart={onDragStart} />
          </div>
        </div>

        {/* Modals : Load */}
        {isLoadModalOpen && (
          <Modal onClose={handleCloseModal}>
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-xl">
              <h3 className="text-xl font-semibold text-white mb-4">
                Charger une structure
              </h3>
              {savedStructures.length > 0 ? (
                <div className="max-h-96 overflow-y-auto space-y-3">
                  {savedStructures.map((structure) => (
                    <div
                      key={structure.name}
                      className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-700/50 p-4 hover:bg-slate-700 transition-colors"
                    >
                      <div>
                        <h4 className="font-medium text-white">
                          {structure.name}
                        </h4>
                        <p className="text-sm text-slate-400">
                          {structure.description || "Aucune description"}
                        </p>
                      </div>
                      <button
                        onClick={() => handleLoadStructure(structure.name)}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500 transition-colors"
                      >
                        Charger
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <svg
                    className="w-16 h-16 text-slate-600 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <p className="text-slate-400">
                    Aucune structure sauvegardée trouvée.
                  </p>
                </div>
              )}
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
