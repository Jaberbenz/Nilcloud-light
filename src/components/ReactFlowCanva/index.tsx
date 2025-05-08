"use client";

import { useAnalysisStore } from "@/store/analysisStore";
import { useMatriceStore } from "@/store/matriceStore";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  type Connection,
  Controls,
  type Edge,
  type EdgeChange,
  MarkerType,
  type Node,
  type NodeChange,
  Position,
  type ReactFlowInstance,
  type XYPosition,
} from "reactflow";
import "reactflow/dist/style.css";
import NodeContainer from "@/components/NodeContainer";

type ReactFlowCanvasProps = {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
};

const ReactFlowCanvas: React.FC<ReactFlowCanvasProps> = ({
  nodes,
  setNodes,
  edges,
  setEdges,
}) => {
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const analysisResults = useAnalysisStore((state) => state.analysisResults);
  const { services, databases, languages } = useMatriceStore();

  // Créer les nœuds initiaux basés sur l'analyse
  useEffect(() => {
    if (analysisResults && nodes.length === 0) {
      console.log(
        "🔄 Création des nœuds initiaux depuis l'analyse:",
        analysisResults
      );
      const initialNodes: Node[] = [];
      let yPosition = 50;

      // Ajouter le langage dominant
      if (analysisResults.env.DOMINANT_LANGUAGE && languages) {
        const langName = analysisResults.env.DOMINANT_LANGUAGE.toLowerCase();
        console.log("📝 Ajout du langage:", langName);
        initialNodes.push({
          id: `language-${langName}-analysis`,
          type: "default",
          position: { x: 250, y: yPosition },
          data: {
            label: (
              <NodeContainer
                nodes={[
                  {
                    label: langName,
                    icon: `${langName.toLowerCase()}.svg`,
                    type: "language",
                  },
                ]}
                onDeleteNode={(nodeIndex: number) =>
                  handleDeleteNestedNode(
                    `language-${langName}-analysis`,
                    nodeIndex
                  )
                }
                onDeleteParent={() =>
                  handleDeleteNode(`language-${langName}-analysis`)
                }
              />
            ),
            icon: `${langName.toLowerCase()}.svg`,
            type: "language",
            isFromAnalysis: true,
            nodes: [
              {
                label: langName,
                icon: `${langName.toLowerCase()}.svg`,
                type: "language",
              },
            ],
          },
          width: 300,
          height: 250,
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
          style: {
            backgroundColor: "#1E293B",
            border: "2px solid #444",
            color: "#ffffff",
            padding: "10px",
            borderRadius: "12px",
            minWidth: "280px",
          },
        });
        yPosition += 150;
      }

      // Ajouter les bases de données détectées
      if (analysisResults.dependencies && databases) {
        console.log("🔍 Recherche des bases de données dans les dépendances");
        const dbMap = {
          mysql: "mariadb",
          postgresql: "postgres",
          redis: "redis",
          mongodb: "mongodb",
        };

        const detectedDatabases = new Set<string>();

        analysisResults.dependencies.forEach((dep) => {
          for (const [keyword, dbName] of Object.entries(dbMap)) {
            if (
              dep.toLowerCase().includes(keyword) &&
              databases[dbName] &&
              !detectedDatabases.has(dbName)
            ) {
              console.log(`📊 Base de données détectée: ${dbName}`);
              detectedDatabases.add(dbName);
              initialNodes.push({
                id: `database-${dbName}-analysis`,
                type: "default",
                position: { x: 250, y: yPosition },
                data: {
                  label: (
                    <NodeContainer
                      nodes={[
                        {
                          label: dbName,
                          icon: `${dbName.toLowerCase()}.svg`,
                          type: "database",
                        },
                      ]}
                      onDeleteNode={(nodeIndex: number) =>
                        handleDeleteNestedNode(
                          `database-${dbName}-analysis`,
                          nodeIndex
                        )
                      }
                      onDeleteParent={() =>
                        handleDeleteNode(`database-${dbName}-analysis`)
                      }
                    />
                  ),
                  icon: `${dbName.toLowerCase()}.svg`,
                  type: "database",
                  isFromAnalysis: true,
                  nodes: [
                    {
                      label: dbName,
                      icon: `${dbName.toLowerCase()}.svg`,
                      type: "database",
                    },
                  ],
                },
                width: 300,
                height: 250,
                sourcePosition: Position.Right,
                targetPosition: Position.Left,
                style: {
                  backgroundColor: "#1E293B",
                  border: "2px solid #444",
                  color: "#ffffff",
                  padding: "10px",
                  borderRadius: "12px",
                  minWidth: "280px",
                },
              });
              yPosition += 150;
            }
          }
        });
      }

      // Ajouter les services détectés
      if (analysisResults.env.APP_CONFIG && services) {
        console.log("🔍 Recherche des services dans la configuration");
        const config = analysisResults.env.APP_CONFIG.toLowerCase();
        const serverMap = {
          nginx: "nginx",
          apache: "apache",
          caddy: "caddy",
        };

        for (const [keyword, serverName] of Object.entries(serverMap)) {
          if (config.includes(keyword) && services[serverName]) {
            console.log(`🌐 Service web détecté: ${serverName}`);
            initialNodes.push({
              id: `service-${serverName}-analysis`,
              type: "default",
              position: { x: 250, y: yPosition },
              data: {
                label: (
                  <NodeContainer
                    nodes={[
                      {
                        label: serverName,
                        icon: `${serverName.toLowerCase()}.svg`,
                        type: "service",
                      },
                    ]}
                    onDeleteNode={(nodeIndex: number) =>
                      handleDeleteNestedNode(
                        `service-${serverName}-analysis`,
                        nodeIndex
                      )
                    }
                    onDeleteParent={() =>
                      handleDeleteNode(`service-${serverName}-analysis`)
                    }
                  />
                ),
                icon: `${serverName.toLowerCase()}.svg`,
                type: "service",
                isFromAnalysis: true,
                nodes: [
                  {
                    label: serverName,
                    icon: `${serverName.toLowerCase()}.svg`,
                    type: "service",
                  },
                ],
              },
              width: 300,
              height: 250,
              sourcePosition: Position.Right,
              targetPosition: Position.Left,
              style: {
                backgroundColor: "#1E293B",
                border: "2px solid #444",
                color: "#ffffff",
                padding: "10px",
                borderRadius: "12px",
                minWidth: "280px",
              },
            });
            break;
          }
        }
      }

      if (initialNodes.length > 0) {
        console.log("✅ Nœuds initiaux créés:", initialNodes);
        setNodes(initialNodes);
      }
    }
  }, [analysisResults, services, databases, languages, nodes.length, setNodes]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge({ ...params, markerEnd: { type: MarkerType.Arrow } }, eds)
      );
    },
    [setEdges]
  );

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const nodeDataString = event.dataTransfer.getData(
        "application/reactflow"
      );

      if (!nodeDataString) {
        return;
      }

      const nodeData = JSON.parse(nodeDataString);

      // Log des données du nœud déposé
      console.log("📥 Nœud déposé:", nodeData);
      console.log(
        "📋 Template sélectionné:",
        nodeData.selectedTemplate || "Aucun template sélectionné"
      );

      const position: XYPosition = reactFlowInstance?.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      }) || { x: 0, y: 0 };

      const targetNode = nodes.find((node) => {
        const nodeX = node.position.x;
        const nodeY = node.position.y;
        const nodeWidth = node.width || 300;
        const nodeHeight = node.height || 250;

        return (
          position.x >= nodeX &&
          position.x <= nodeX + nodeWidth &&
          position.y >= nodeY &&
          position.y <= nodeY + nodeHeight
        );
      });

      if (targetNode) {
        // Insertion dans un nœud parent existant
        const existingNodes = targetNode.data?.nodes || [];
        const updatedNode = {
          ...targetNode,
          data: {
            ...targetNode.data,
            nodes: [
              ...existingNodes,
              {
                label: nodeData.label,
                icon: nodeData.icon,
                selectedTemplate: nodeData.selectedTemplate || "",
                packageManager: nodeData.packageManager || "",
                type: nodeData.type,
              },
            ],
            label: (
              <NodeContainer
                nodes={[
                  ...existingNodes,
                  {
                    label: nodeData.label,
                    icon: nodeData.icon,
                    selectedTemplate: nodeData.selectedTemplate || "",
                    packageManager: nodeData.packageManager || "",
                    type: nodeData.type,
                  },
                ]}
                onDeleteNode={(nodeIndex: number) =>
                  handleDeleteNestedNode(targetNode.id, nodeIndex)
                }
                onDeleteParent={() => handleDeleteNode(targetNode.id)}
              />
            ),
          },
        };
        setNodes((nds) =>
          nds.map((node) => (node.id === updatedNode.id ? updatedNode : node))
        );
      } else {
        // Création d'un nouveau nœud
        const newNodeId = `node_${nodes.length}`;
        const newNode: Node = {
          id: newNodeId,
          type: "default",
          position,
          data: {
            ...nodeData,
            nodes: [
              {
                label: nodeData.label,
                icon: nodeData.icon,
                selectedTemplate: nodeData.selectedTemplate || "",
                packageManager: nodeData.packageManager || "",
                type: nodeData.type,
              },
            ],
            label: (
              <NodeContainer
                nodes={[
                  {
                    label: nodeData.label,
                    icon: nodeData.icon,
                    selectedTemplate: nodeData.selectedTemplate || "",
                    packageManager: nodeData.packageManager || "",
                    type: nodeData.type,
                  },
                ]}
                onDeleteNode={(nodeIndex: number) =>
                  handleDeleteNestedNode(newNodeId, nodeIndex)
                }
                onDeleteParent={() => handleDeleteNode(newNodeId)}
              />
            ),
          },
          width: 300,
          height: 250,
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
          style: {
            backgroundColor: "#1E293B",
            border: "2px solid #444",
            color: "#ffffff",
            padding: "10px",
            borderRadius: "12px",
            minWidth: "280px",
          },
        };

        setNodes((nds) => nds.concat(newNode));

        // Ajouter une connexion avec le dernier nœud ajouté
        if (nodes.length > 0) {
          const lastNodeId = nodes[nodes.length - 1].id;
          const newEdge: Edge = {
            id: `edge_${lastNodeId}_${newNodeId}`,
            source: lastNodeId,
            target: newNodeId,
            markerEnd: { type: MarkerType.Arrow },
          };
          setEdges((eds) => [...eds, newEdge]);
        }
      }
    },
    [reactFlowInstance, nodes, setNodes, edges]
  );

  // Handle deleting a nested node instead of deleting the entire container node.
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

  // Fonction pour gérer le drag and drop
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  return (
    <div className="h-full w-full bg-slate-900/30 rounded-lg overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={(changes: NodeChange[]) =>
          setNodes((nds) => applyNodeChanges(changes, nds))
        }
        onEdgesChange={(changes: EdgeChange[]) =>
          setEdges((eds) => applyEdgeChanges(changes, eds))
        }
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        fitView
        className="h-full w-full"
        defaultEdgeOptions={{
          style: { stroke: "#6366f1", strokeWidth: 2 },
          markerEnd: { type: MarkerType.Arrow, color: "#6366f1" },
        }}
      >
        <Controls className="bg-slate-800 border border-slate-700 rounded-lg p-1" />
        <Background color="#4b5563" gap={16} size={1} />
      </ReactFlow>
    </div>
  );
};

export default ReactFlowCanvas;
