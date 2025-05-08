"use client";

import type React from "react";

import WorkflowBuilder from "@/components/WorkflowBuilder";
import { useSessionStore } from "@/store/sessionStore"; // Importer le store
import { useState } from "react";
import type { Node } from "reactflow";

type NodeData = {
  // Définir le même type que dans WorkflowBuilder
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
  name?: string;
  entrypoint?: string;
};

export default function SetupStack() {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentNodes, setCurrentNodes] = useState<Node<NodeData>[]>([]);

  // Utiliser le store au lieu de localStorage
  const { getSessionId, saveStepData } = useSessionStore();

  // Fonction pour envoyer les données directement à l'API
  const saveCurrentWorkflow = async () => {
    try {
      // Récupérer les données des nœuds
      const nodes = currentNodes;
      console.log(
        "Nodes in saveCurrentWorkflow:",
        JSON.stringify(nodes, null, 2)
      );

      if (!nodes || nodes.length === 0) {
        alert("Aucun nœud à sauvegarder. Veuillez créer une structure.");
        return;
      }

      // Récupérer le sessionId du store
      const sessionId = getSessionId();
      console.log("📋 SessionId utilisé pour la sauvegarde:", sessionId);

      // Préparer les structures pour services, databases et appsConfig
      const services: { name: string; template: string }[] = [];
      const databases: { name: string; template: string }[] = [];

      // Collecter tous les nœuds pour appsConfig
      const allNodes = [];

      // Ajouter le nœud de langage
      const language =
        useSessionStore
          .getState()
          .getVerificationData()
          ?.language?.toLowerCase() || "python";
      const languageNode = {
        label: language,
        icon: `${language}.svg`,
        type: "language",
        template: "package",
      };

      // Ajouter le nœud de langage en premier
      allNodes.push(languageNode);

      // Parcourir les nœuds et extraire les données pertinentes
      nodes.forEach((node) => {
        console.log("Processing node:", node.id, node.data);

        // Vérifier si le nœud a des nœuds imbriqués
        if (node.data && node.data.nodes && Array.isArray(node.data.nodes)) {
          // Parcourir les nœuds imbriqués
          node.data.nodes.forEach((nestedNode) => {
            console.log("Processing nested node:", nestedNode);

            // Extraire le label comme chaîne
            const nodeLabel =
              typeof nestedNode.label === "string"
                ? nestedNode.label
                : String(nestedNode.label || "");

            // Ajouter à la liste des services ou databases
            if (nestedNode.type === "service") {
              services.push({
                name: nodeLabel,
                template: nestedNode.selectedTemplate || "",
              });
            } else if (nestedNode.type === "database") {
              databases.push({
                name: nodeLabel,
                template: nestedNode.selectedTemplate || "",
              });
            }

            // Ajouter aux nœuds seulement s'il ne s'agit pas d'un nœud de langage
            // pour éviter la duplication
            if (nestedNode.type !== "language") {
              allNodes.push({
                label: nodeLabel,
                icon: nestedNode.icon || `${nodeLabel.toLowerCase()}.svg`,
                type: nestedNode.type,
                selectedTemplate: nestedNode.selectedTemplate || "",
                packageManager: nestedNode.packageManager || "",
              });
            }
          });
        } else {
          console.log("Node has no nested nodes or data:", node.id);
        }
      });

      console.log("Collected services:", services);
      console.log("Collected databases:", databases);
      console.log("Collected allNodes:", allNodes);

      // Construire l'objet de données à envoyer
      const stackData = {
        stepId: "3",
        stack: {
          services: services,
          databases: databases,
          appsConfig: [
            {
              nodes: allNodes,
            },
          ],
        },
      };

      // Sauvegarder les données dans le store
      saveStepData("3", stackData);

      const requestData = {
        session_id: sessionId,
        step_id: "3",
        step_data: stackData,
      };

      console.log(
        "📤 Données à envoyer:",
        JSON.stringify(requestData, null, 2)
      );

      // Déterminer l'URL de l'API
      // Utiliser l'URL correcte du backend
      const apiUrl = "http://localhost:5000/api/pipeline/save";

      console.log("🌐 Envoi de la requête à:", apiUrl);

      // Envoyer les données à l'API
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
        credentials: "include", // Important pour les cookies/auth
      });

      console.log("📊 Statut de la réponse:", response.status);

      // Vérifier si la réponse est du JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        console.log("📥 Réponse JSON:", result);

        if (!response.ok) {
          throw new Error(
            `Erreur ${response.status}: ${result.error || "Erreur inconnue"}`
          );
        }

        setIsSaved(true);
        alert("✅ Configuration enregistrée avec succès!");
      } else {
        // Si ce n'est pas du JSON, récupérer le texte
        const text = await response.text();
        console.log("📄 Réponse texte:", text);
        throw new Error(
          `Erreur ${response.status}: La réponse n'est pas au format JSON`
        );
      }
    } catch (error) {
      console.error("❌ Erreur lors de la sauvegarde:", error);
      alert(`❌ Erreur lors de la sauvegarde: ${error.message}`);
    }
  };

  // Fonction pour recevoir les nodes du WorkflowBuilder
  const handleNodesChange = (nodes: Node<NodeData>[]) => {
    console.log(
      "Nodes received in handleNodesChange:",
      JSON.stringify(nodes, null, 2)
    );
    setCurrentNodes(nodes);
  };

  return (
    <div className="p-8 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
          Configuration de la Stack
        </h2>
        <button
          onClick={saveCurrentWorkflow}
          disabled={isLoading}
          className={`rounded-lg px-4 py-2 text-white font-medium transition-all ${
            isSaved
              ? "bg-green-500 hover:bg-green-600"
              : "bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-600 dark:hover:bg-indigo-500"
          } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {isLoading
            ? "Sauvegarde en cours..."
            : isSaved
            ? "✓ Configuration Sauvegardée"
            : "Enregistrer la Configuration"}
        </button>
      </div>
      <div className="rounded-lg bg-slate-50 p-4 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
        <WorkflowBuilder onNodesChange={handleNodesChange} />
      </div>
    </div>
  );
}
