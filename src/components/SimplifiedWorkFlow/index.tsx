// SimplifiedWorkflow.jsx

"use client";

import React, { useState, useCallback } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  addEdge,
  Position,
  Connection,
  applyNodeChanges,
  NodeChange,
} from "reactflow";
import "reactflow/dist/style.css";

const initialNodes = [
  {
    id: "start",
    type: "input",
    data: { label: "Start" },
    position: { x: 50, y: 100 },
    sourcePosition: Position.Right,
  },
  {
    id: "end",
    type: "output",
    data: { label: "End" },
    position: { x: 600, y: 100 },
    targetPosition: Position.Left,
  },
];

const SimplifiedWorkflow = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      if (!type) {
        return;
      }

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode: Node = {
        id: `node_${nodes.length}`,
        type: "default",
        position,
        data: { label: `${type} Node` },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, setNodes],
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );

  return (
    <div className="p-4">
      <div className="relative mb-4 h-[600px] w-[1000px] rounded-md border border-gray-300">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
          className="h-full w-full"
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
      <div className="mb-4 grid grid-cols-4 gap-4">
        <div
          className="node-library-item cursor-move rounded-md border border-gray-400 p-4"
          onDragStart={(event) =>
            event.dataTransfer.setData("application/reactflow", "Set Version")
          }
          draggable
        >
          Set Version
        </div>
        <div
          className="node-library-item cursor-move rounded-md border border-gray-400 p-4"
          onDragStart={(event) =>
            event.dataTransfer.setData("application/reactflow", "Build")
          }
          draggable
        >
          Build
        </div>
        <div
          className="node-library-item cursor-move rounded-md border border-gray-400 p-4"
          onDragStart={(event) =>
            event.dataTransfer.setData("application/reactflow", "Deploy")
          }
          draggable
        >
          Deploy
        </div>
      </div>
    </div>
  );
};

export default SimplifiedWorkflow;
