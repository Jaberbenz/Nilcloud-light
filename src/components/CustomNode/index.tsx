"use client";

import React from "react";
import { Handle, Position } from "reactflow";

type CustomNodeProps = {
  id: string;
  data: any;
  sourcePosition?: Position;
  targetPosition?: Position;
};

const CustomNode: React.FC<CustomNodeProps> = ({
  data,
  sourcePosition,
  targetPosition,
}) => {
  return (
    <div className="custom-node">
      {targetPosition && (
        <Handle
          type="target"
          position={targetPosition}
          style={{ background: "#555" }}
        />
      )}
      {data.label}
      {sourcePosition && (
        <Handle
          type="source"
          position={sourcePosition}
          style={{ background: "#555" }}
        />
      )}
    </div>
  );
};

export default CustomNode;
