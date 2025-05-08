// StaticWorkflow/index.tsx
"use client";

import React from "react";
import ReactFlow, { Node, Edge, Controls, Background } from "reactflow";
import "reactflow/dist/style.css";
import NodeContainer from "../NodeContainer";

type StaticWorkflowProps = {
  nodes: Node[];
  edges: Edge[];
};

const StaticWorkflow: React.FC<StaticWorkflowProps> = ({ nodes, edges }) => {
  console.log("StaticWorkflow reçoit les nœuds :", nodes);

  // Fonction pour transformer les données des nœuds de manière récursive
  const flattenNodes = (nodes: any[]): any[] => {
    let flatList: any[] = [];

    nodes.forEach((node) => {
      flatList.push({
        label: node.label || "",
        icon: node.icon || undefined,
        apcuEnabled: node.apcuEnabled || false,
        opcacheEnabled: node.opcacheEnabled || false,
        mailFunctionEnabled: node.mailFunctionEnabled || false,
        smtp: node.smtp || undefined,
        port: node.port || undefined,
      });

      // Si ce nœud a des nœuds enfants, les transformer récursivement
      if (node.data && Array.isArray(node.data.nodes)) {
        flatList = flatList.concat(flattenNodes(node.data.nodes));
      }
    });

    return flatList;
  };

  // Mise à jour des nœuds pour inclure NodeContainer avec les données transformées
  const updatedNodes = nodes.map((node) => {
    const transformedData = flattenNodes([node]); // Transformer les nœuds récursivement

    return {
      ...node,
      data: {
        ...node.data,
        label: (
          <NodeContainer
            nodes={transformedData} // Passer les données transformées
          />
        ),
      },
    };
  });

  return (
    <div className="p-4">
      <div className="relative mb-4 h-[600px] w-[1000px] rounded-md border border-gray-300">
        <ReactFlow
          nodes={updatedNodes}
          edges={edges}
          fitView
          className="h-full w-full"
        >
          <Controls showInteractive={false} />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
};

export default StaticWorkflow;
