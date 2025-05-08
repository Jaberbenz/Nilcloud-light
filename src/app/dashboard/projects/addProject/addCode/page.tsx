"use client";

import type React from "react";

import { apiService } from "@/services/apiService";
import { useAnalysisStore } from "@/store/analysisStore";
import { useMatriceStore } from "@/store/matriceStore";
import { useSessionStore } from "@/store/sessionStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FileUp,
  Upload,
  CheckCircle,
  AlertCircle,
  FileCode,
  Database,
  Server,
} from "lucide-react";

interface UploadError extends Error {
  message: string;
}

interface ProcessedContent {
  type: string;
  metadata: {
    env: {
      APP_NAME: string;
      DOMINANT_LANGUAGE: string;
      PACKAGE_MANAGER: string;
      FRAMEWORK_DETECTED: string;
      APP_MAIN: string;
      APP_CONFIG: string;
      ENTRYPOINT: string;
      CONF: string;
      PBK_TO_BUILD: string;
    };
    dependencies?: string[];
  };
}

interface FileGroup {
  file: string;
  processed_content: ProcessedContent;
}

interface ApiResponse {
  data: FileGroup[][];
}

interface EnvMetadata {
  APP_NAME?: string;
  DOMINANT_LANGUAGE?: string;
  PACKAGE_MANAGER?: string;
  FRAMEWORK_DETECTED?: string;
  APP_MAIN?: string;
  APP_CONFIG?: string;
  ENTRYPOINT?: string;
  CONF?: string;
  PBK_TO_BUILD?: string;
}

const AddCode = () => {
  console.log("🔄 Composant AddCode initialisé");
  const [uploadedFiles, setUploadedFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisSuccess, setAnalysisSuccess] = useState(false);
  const [analysisMessage, setAnalysisMessage] = useState("");
  const setAnalysisResults = useAnalysisStore(
    (state) => state.setAnalysisResults
  );
  const router = useRouter();
  const { setServices, setLanguages, setDatabases } = useMatriceStore();
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const { getSessionId, saveStepData } = useSessionStore();

  useEffect(() => {
    console.log("🔍 Vérification du sessionId");
    const sessionId = getSessionId();
    console.log("📋 SessionId trouvé:", sessionId);
    if (!sessionId) {
      console.log("⚠️ Pas de sessionId, redirection vers /dashboard/projects");
      router.push("/dashboard/projects");
    }

    // Charger les données des endpoints
    const fetchData = async () => {
      try {
        console.log("🔄 Chargement des données initiales...");
        const [servicesData, languagesData, databasesData] = await Promise.all([
          apiService.fetchServices(),
          apiService.fetchLanguages(),
          apiService.fetchDatabases(),
        ]);

        console.log("📦 Services reçus:", servicesData);
        console.log("🈸 Langages reçus:", languagesData);
        console.log("🗄️ Bases de données reçues:", databasesData);

        // Sauvegarder dans le store des matrices
        setServices(servicesData);
        setLanguages(languagesData);
        setDatabases(databasesData);

        // Garder aussi dans le state local pour la requête API
        setServices(servicesData);
        setLanguages(languagesData);
        setDatabases(databasesData);
      } catch (error) {
        console.error("❌ Erreur lors du chargement des données:", error);
        setError("Erreur lors du chargement des données initiales");
        setError("Erreur lors du chargement des services");
      }
    };

    fetchData();
  }, [router, setServices, setLanguages, setDatabases]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("📁 Début du handleFileUpload");
    if (e.target.files && e.target.files.length > 0) {
      console.log("📄 Fichier sélectionné:", e.target.files[0].name);
      setUploadedFiles(e.target.files);
      setError("");
      setAnalysisComplete(false);
    }
  };

  const handleAnalyze = async () => {
    console.log("🚀 Début de handleAnalyze");

    if (!uploadedFiles || uploadedFiles.length === 0) {
      console.log("❌ Aucun fichier sélectionné");
      setError("Aucun fichier sélectionné.");
      return;
    }

    const sessionId = getSessionId();
    if (!sessionId) {
      console.log("❌ Session invalide");
      setError("Session invalide");
      return;
    }

    console.log("📦 Préparation du fichier:", uploadedFiles[0].name);
    const formData = new FormData();
    formData.append("file", uploadedFiles[0]);
    formData.append("session_id", sessionId);

    // Récupérer les données du store directement
    const currentState = useMatriceStore.getState();

    // Formater les données correctement
    formData.append(
      "available_services",
      JSON.stringify({
        data: currentState.services,
        message: "Services disponibles",
      })
    );

    formData.append(
      "available_languages",
      JSON.stringify({
        data: currentState.languages,
        message: "Langages disponibles",
      })
    );

    formData.append(
      "available_databases",
      JSON.stringify({
        data: currentState.databases,
        message: "Bases de données disponibles",
      })
    );

    console.log("📊 Matrices ajoutées à la requête:", {
      services: currentState.services,
      languages: currentState.languages,
      databases: currentState.databases,
    });

    setLoading(true);
    setError("");
    setAnalysisComplete(false);

    try {
      console.log("📤 Envoi de la requête à l'API...");
      const result = await apiService.uploadFile(formData);
      console.log("📥 Réponse reçue de l'API:", result);

      setApiResponse(result);

      // Fonction pour trouver l'objet avec le type "final"
      const findFinalMetadata = (data: ApiResponse["data"]): EnvMetadata => {
        for (const group of data) {
          const item = group[0];
          if (item?.processed_content?.type === "final") {
            return item.processed_content.metadata.env;
          }
        }
        return {};
      };

      // Fonction pour trouver les dépendances
      const findDependencies = (data: ApiResponse["data"]) => {
        for (const group of data) {
          const item = group[0];
          if (item?.processed_content?.metadata?.dependencies) {
            return item.processed_content.metadata.dependencies;
          }
        }
        return [];
      };

      // Trouver les métadonnées finales
      const finalMetadata = findFinalMetadata(result.data);

      // Trouver les dépendances
      const dependencies = findDependencies(result.data);

      // Transformation des données pour le store
      const analysisData = {
        env: {
          APP_NAME: finalMetadata.APP_NAME || "",
          DOMINANT_LANGUAGE: finalMetadata.DOMINANT_LANGUAGE || "",
          PACKAGE_MANAGER: finalMetadata.PACKAGE_MANAGER || "",
          FRAMEWORK_DETECTED: finalMetadata.FRAMEWORK_DETECTED || "",
          APP_MAIN: finalMetadata.APP_MAIN || "",
          APP_CONFIG: finalMetadata.APP_CONFIG || "",
          ENTRYPOINT: finalMetadata.ENTRYPOINT || "",
          CONF: finalMetadata.CONF || "package",
          PBK_TO_BUILD:
            finalMetadata.PBK_TO_BUILD ||
            finalMetadata.DOMINANT_LANGUAGE?.toLowerCase() ||
            "",
        },
        metadata: finalMetadata,
        files:
          result.data?.map((group) => group[0]?.file).filter(Boolean) || [],
        dependencies: dependencies,
      };

      console.log("🔄 Données transformées pour le store:", analysisData);
      setAnalysisResults(analysisData);

      // Vérification immédiate
      const storedData = useAnalysisStore.getState().analysisResults;
      console.log("✅ Données dans le store après mise à jour:", storedData);

      setAnalysisComplete(true);
      setAnalysisSuccess(true);
      setAnalysisMessage(
        "Analyse terminée avec succès. Cliquez sur 'Next' pour continuer."
      );

      // À la fin de l'analyse réussie, sauvegardez les données localement
      const codeData = {
        fileName: uploadedFiles[0].name,
        fileSize: uploadedFiles[0].size,
        timestamp: new Date().toISOString(),
        analysisComplete: true,
      };

      localStorage.setItem(`codeData_${sessionId}`, JSON.stringify(codeData));

      console.log("✅ Données du code sauvegardées localement");

      // Sauvegarder les données dans le store
      saveStepData("1", codeData);
    } catch (error) {
      setApiResponse(null);
      const uploadError = error as UploadError;
      console.error("❌ Erreur pendant l'analyse:", uploadError);
      setError(uploadError.message || "Erreur lors de l'analyse.");
      setAnalysisComplete(true);
      setAnalysisSuccess(false);
      setAnalysisMessage("Erreur lors de l'analyse. Veuillez réessayer.");
    } finally {
      console.log("⏹️ Fin du processus d'analyse");
      setLoading(false);
    }
  };

  // Fonction pour obtenir le nom du fichier
  const getFileName = () => {
    if (uploadedFiles && uploadedFiles.length > 0) {
      return uploadedFiles[0].name;
    }
    return "Aucun fichier sélectionné";
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="flex items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-500">
            Ajouter du Code
          </h1>
          <span className="ml-3 px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 dark:bg-indigo-900/50 dark:border-indigo-700/50 dark:text-indigo-300">
            Étape 1
          </span>
        </div>

        {/* Zone de téléchargement */}
        <div className="mb-8 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 shadow-lg overflow-hidden">
          <div className="border-b border-slate-200 dark:border-slate-700/50 px-6 py-4">
            <div className="flex items-center">
              <FileCode className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Téléchargement de code
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Téléchargez votre code source pour analyse automatique
            </p>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Fichier ZIP de votre projet
              </label>

              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-slate-300 dark:border-slate-600 px-6 py-10 hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-colors duration-200">
                <div className="text-center">
                  <FileUp className="mx-auto h-12 w-12 text-slate-400" />
                  <div className="mt-4 flex text-sm leading-6 text-slate-600 dark:text-slate-400">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-indigo-50 px-4 py-2 font-semibold text-indigo-600 focus-within:outline-none hover:bg-indigo-100 transition-colors duration-200 dark:bg-slate-700/50 dark:text-indigo-300 dark:hover:bg-slate-700"
                    >
                      <span>Sélectionner un fichier</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept=".zip"
                        className="sr-only"
                        onChange={handleFileUpload}
                      />
                    </label>
                    <p className="pl-3 pt-2">ou glisser-déposer</p>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    ZIP jusqu'à 50MB
                  </p>

                  {uploadedFiles && uploadedFiles.length > 0 && (
                    <div className="mt-4 flex items-center justify-center">
                      <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 border border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800/50">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        {getFileName()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleAnalyze}
                disabled={loading || !uploadedFiles}
                className={`flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  loading || !uploadedFiles
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed dark:bg-slate-700 dark:text-slate-400"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-indigo-500/20"
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Analyser le code
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 dark:bg-red-900/30 dark:border-red-800/50 dark:text-red-300">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2" />
                  <p>{error}</p>
                </div>
              </div>
            )}

            {analysisComplete && (
              <div
                className={`mt-4 rounded-lg p-4 ${
                  analysisSuccess
                    ? "bg-green-50 border border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-800/50 dark:text-green-300"
                    : "bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-800/50 dark:text-red-300"
                }`}
              >
                <div className="flex">
                  {analysisSuccess ? (
                    <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2" />
                  )}
                  <p>{analysisMessage}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Résultats de l'analyse */}
        {apiResponse && (
          <div className="rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 shadow-lg overflow-hidden">
            <div className="border-b border-slate-200 dark:border-slate-700/50 px-6 py-4">
              <div className="flex items-center">
                <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Résultats de l'analyse
                </h2>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Détails techniques détectés dans votre code
              </p>
            </div>

            <div className="p-6">
              <div className="rounded-lg bg-slate-50 border border-slate-200 dark:bg-slate-900/70 dark:border-slate-700/50 overflow-hidden">
                <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 dark:bg-slate-800/70 dark:border-b dark:border-slate-700/50 flex items-center">
                  <Server className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mr-2" />
                  <span className="font-mono text-sm text-slate-700 dark:text-slate-300">
                    Réponse API
                  </span>
                </div>
                <pre className="p-4 overflow-auto text-xs font-mono text-slate-700 dark:text-slate-300 max-h-96">
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddCode;
