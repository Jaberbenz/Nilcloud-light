"use client";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CiLogsPage() {
  const ciLogs = [
    "2025-02-18T10:23:45Z: [CI] Starting build...",
    "2025-02-18T10:24:01Z: [CI] Running tests...",
    "2025-02-18T10:24:10Z: [CI] Tests passed.",
  ];

  return (
    <div className="mx-auto w-full max-w-3xl p-6">
      <SyntaxHighlighter language="bash" style={oneDark}>
        {ciLogs.join("\n")}
      </SyntaxHighlighter>
    </div>
  );
}
