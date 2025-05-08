"use client";
import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function generateFakeCdLog(index: number) {
  // Simule un timestamp
  const time = new Date(Date.now() - index * 60000).toISOString();
  const messages = [
    "Starting deployment...",
    "Building Docker image...",
    "Pushing image to registry...",
    "Updating Kubernetes deployment...",
    "Applying configmaps...",
    "Scaling pods...",
    "Deployment successful!",
  ];
  const step = index % messages.length;
  return `${time} [CD] ${messages[step]}`;
}

export default function CdLogsPage() {
  // On génère d'avance la liste complète
  const totalLogs = 12;
  const allLogs: string[] = [];
  for (let i = 0; i < totalLogs; i++) {
    allLogs.push(generateFakeCdLog(i));
  }

  // State qui contient les logs “affichés”
  const [displayedLogs, setDisplayedLogs] = useState<string[]>([]);

  useEffect(() => {
    let index = 0;

    // Interval: toutes les 2 secondes, on ajoute 1 ou 2 logs
    const intervalId = setInterval(() => {
      // Si on a encore des logs à afficher
      if (index < allLogs.length) {
        // Par exemple, on en ajoute 2 à la fois
        const chunkSize = 2;
        const nextLogs = allLogs.slice(index, index + chunkSize);
        setDisplayedLogs((prev) => [...prev, ...nextLogs]);
        index += chunkSize;
      } else {
        // Si on a tout affiché, on arrête
        clearInterval(intervalId);
      }
    }, 2000);

    // Nettoyer l’interval si on démonte le composant
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="mx-auto w-full max-w-3xl p-6">
      <h2 className="mb-2 text-xl font-bold text-light-primary dark:text-dark-highlight">
        CD Logs (Simulated Increments)
      </h2>
      <p className="mb-4 text-sm text-light-secondary dark:text-dark-secondary">
        Every 2 seconds, a couple lines appear to simulate real-time logs.
      </p>

      <SyntaxHighlighter language="bash" style={oneDark}>
        {displayedLogs.join("\n")}
      </SyntaxHighlighter>
    </div>
  );
}
