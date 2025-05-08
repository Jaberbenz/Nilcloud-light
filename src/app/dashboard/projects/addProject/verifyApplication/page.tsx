"use client";

import { useAnalysisStore } from "@/store/analysisStore";
import { useSessionStore } from "@/store/sessionStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CheckCircle,
  FileCode,
  Package,
  Play,
  Settings,
  Code,
  FileText,
} from "lucide-react";

// Page de vérification des informations de l'application analysée
const VerifyApplication = () => {
  // Récupération des résultats d'analyse depuis le store global
  const analysisResults = useAnalysisStore((state) => {
    console.log("Lecture du store dans VerifyApplication:", state);
    return state.analysisResults;
  });

  // Utiliser le store de session pour sauvegarder les données
  const { saveVerificationData, getSessionId, saveStepData } =
    useSessionStore();

  const router = useRouter();

  console.log("🔍 Vérification du sessionId");
  const sessionId = getSessionId(); // Utiliser la fonction du store au lieu de localStorage
  console.log("📋 SessionId trouvé:", sessionId);
  if (!sessionId) {
    console.log("⚠️ Pas de sessionId, redirection vers /dashboard/projects");
    router.push("/dashboard/projects");
  }

  // États locaux pour les informations du projet
  const [projectName, setProjectName] = useState("");
  const [appDir, setAppDir] = useState("");
  const [appMainDir, setAppMainDir] = useState("");
  const [appConfigDir, setAppConfigDir] = useState("");
  const [language, setLanguage] = useState("");
  const [packageManager, setPackageManager] = useState("");
  const [framework, setFramework] = useState("");
  const [mainFilePath, setMainFilePath] = useState("");
  const [configPath, setConfigPath] = useState("");
  const [entrypoint, setEntrypoint] = useState("");
  const [conf, setConf] = useState("");
  const [pbkToBuild, setPbkToBuild] = useState("");

  // Mise à jour des états locaux quand les résultats d'analyse changent
  useEffect(() => {
    if (analysisResults?.env) {
      setProjectName(analysisResults.env.APP_NAME || "");
      setAppDir(analysisResults.metadata?.APP_DIR || "");
      setAppMainDir(analysisResults.metadata?.APP_MAIN_DIR || "");
      setAppConfigDir(analysisResults.metadata?.APP_CONFIG_DIR || "");
      setLanguage(analysisResults.env.DOMINANT_LANGUAGE || "");
      setPackageManager(analysisResults.env.PACKAGE_MANAGER || "");
      setFramework(analysisResults.env.FRAMEWORK_DETECTED || "");
      setMainFilePath(analysisResults.env.APP_MAIN || "");
      setConfigPath(analysisResults.env.APP_CONFIG || "");
      setEntrypoint(analysisResults.env.ENTRYPOINT || "");
      setConf(analysisResults.env.CONF || "package");
      setPbkToBuild(analysisResults.env.PBK_TO_BUILD || "");
    }
  }, [analysisResults]);

  // Sauvegarder les données dans le store quand elles changent
  useEffect(() => {
    // Créer l'objet de données de vérification
    const verificationData = {
      projectName,
      appDir,
      appMainDir,
      appConfigDir,
      language,
      packageManager,
      framework,
      mainFilePath,
      configPath,
      entrypoint,
      conf,
      pbkToBuild,
    };

    // Sauvegarder dans le store
    saveVerificationData(verificationData);
  }, [
    projectName,
    appDir,
    appMainDir,
    appConfigDir,
    language,
    packageManager,
    framework,
    mainFilePath,
    configPath,
    entrypoint,
    conf,
    pbkToBuild,
    saveVerificationData,
  ]);

  // Ajouter un useEffect pour sauvegarder les données
  useEffect(() => {
    if (projectName && language) {
      const appData = {
        stepId: "2",
        app: [
          {
            appName: projectName,
            label: projectName,
            icon: `${language.toLowerCase()}.svg`,
            type: "language",
            isFromAnalysis: true,
            APP_DIR: appDir,
            APP_MAIN: mainFilePath,
            APP_MAIN_DIR: appMainDir,
            APP_CONFIG: configPath,
            APP_CONFIG_DIR: appConfigDir,
            APP_NAME: projectName,
            ENTRYPOINT: entrypoint,
            PACKAGE_MANAGER: packageManager,
            FRAMEWORK_DETECTED: framework,
            DOMINANT_LANGUAGE: language,
            CONF: conf,
            PBK_TO_BUILD: pbkToBuild,
          },
        ],
      };

      // Sauvegarder dans le store
      saveStepData("2", appData);
    }
  }, [
    projectName,
    language,
    appDir,
    mainFilePath,
    appMainDir,
    configPath,
    appConfigDir,
    entrypoint,
    packageManager,
    framework,
    conf,
    pbkToBuild,
    saveStepData,
  ]);

  // Fonction pour obtenir l'icône correspondant au langage
  const getLanguageIcon = () => {
    const lang = language.toLowerCase();
    if (lang === "ruby") return "💎";
    if (lang === "python") return "🐍";
    if (lang === "java") return "☕";
    if (lang === "javascript" || lang === "typescript") return "🟨";
    if (lang === "php") return "🐘";
    if (lang === "go") return "🔵";
    return "🔧";
  };

  // Redirection si pas de résultats d'analyse
  if (!analysisResults) {
    router.push("/dashboard/projects/addProject/addCode");
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="flex items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-500">
            Vérifier les informations du projet
          </h1>
          <span className="ml-3 px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 dark:bg-indigo-900/50 dark:border-indigo-700/50 dark:text-indigo-300">
            Étape 2
          </span>
        </div>

        {/* Informations du projet */}
        <div className="rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 shadow-lg overflow-hidden">
          <div className="border-b border-slate-200 dark:border-slate-700/50 px-6 py-4">
            <div className="flex items-center">
              <FileCode className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Informations détectées
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Vérifiez et modifiez les informations détectées automatiquement
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Informations principales */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nom du projet
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 dark:text-slate-400">
                    <FileText className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-700/50 pl-10 pr-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors duration-200"
                    placeholder="Nom de votre projet"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Langage utilisé
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 dark:text-slate-400">
                      <Code className="w-5 h-5" />
                    </span>
                    <div className="flex items-center w-full rounded-lg border border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800 pl-10 pr-4 py-3 text-slate-900 dark:text-white">
                      <span className="mr-2">{getLanguageIcon()}</span>
                      <span>{language}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Package Manager
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 dark:text-slate-400">
                      <Package className="w-5 h-5" />
                    </span>
                    <div className="w-full rounded-lg border border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800 pl-10 pr-4 py-3 text-slate-900 dark:text-white">
                      {packageManager}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Framework
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 dark:text-slate-400">
                      <Settings className="w-5 h-5" />
                    </span>
                    <div className="w-full rounded-lg border border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800 pl-10 pr-4 py-3 text-slate-900 dark:text-white">
                      {framework}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Séparateur */}
            <div className="border-t border-slate-200 dark:border-slate-700/50 my-6"></div>

            {/* Chemins et configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-indigo-700 dark:text-indigo-300 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Configuration technique
              </h3>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Chemin du fichier principal
                </label>
                <input
                  type="text"
                  value={mainFilePath}
                  onChange={(e) => setMainFilePath(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-700/50 px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors duration-200 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Chemin du fichier de configuration
                </label>
                <input
                  type="text"
                  value={configPath}
                  onChange={(e) => setConfigPath(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-700/50 px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors duration-200 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Commande de lancement
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 dark:text-slate-400">
                    <Play className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    value={entrypoint}
                    onChange={(e) => setEntrypoint(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-700/50 pl-10 pr-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors duration-200 font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyApplication;
