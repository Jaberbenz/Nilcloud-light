"use client";

import { useAnalysisStore } from "@/store/analysisStore";
import { useSessionStore } from "@/store/sessionStore";
import { useEffect, useState } from "react";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Code,
  Database,
  FileCode,
  Package,
  Play,
  Server,
  Settings,
  Shield,
} from "lucide-react";

interface PipelineStep {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  order: number;
}

// Fonction pour obtenir les étapes spécifiques au langage
const getLanguageSpecificSteps = (language: string): PipelineStep[] => {
  // Convertir le langage en minuscules pour faciliter les comparaisons
  const lang = language.toLowerCase();

  // Étapes communes à tous les langages
  const commonSteps: PipelineStep[] = [
    {
      id: "build_image",
      label: "Build Docker Image",
      description: "Construit l'image Docker de l'application",
      enabled: true,
      order: 1,
    },
    {
      id: "deploy",
      label: "Deploy Application",
      description: "Déploie l'application",
      enabled: false,
      order: 5,
    },
  ];

  // Étapes spécifiques à chaque langage
  const languageSpecificSteps: Record<string, PipelineStep[]> = {
    python: [
      {
        id: "lint",
        label: "Lint with Black",
        description: "Vérifie le style du code avec Black",
        enabled: true,
        order: 2,
      },
      {
        id: "test",
        label: "Test with Pytest",
        description: "Exécute les tests avec Pytest",
        enabled: true,
        order: 3,
      },
      {
        id: "security",
        label: "Security Check with Bandit",
        description: "Analyse de sécurité avec Bandit",
        enabled: true,
        order: 4,
      },
    ],
    ruby: [
      {
        id: "lint",
        label: "Lint with Rubocop",
        description: "Vérifie le style du code avec Rubocop",
        enabled: true,
        order: 2,
      },
      {
        id: "test",
        label: "Test with RSpec",
        description: "Exécute les tests avec RSpec",
        enabled: true,
        order: 3,
      },
      {
        id: "security",
        label: "Security Check with Brakeman",
        description: "Analyse de sécurité avec Brakeman",
        enabled: true,
        order: 4,
      },
    ],
    java: [
      {
        id: "lint",
        label: "Lint with Checkstyle",
        description: "Vérifie le style du code avec Checkstyle",
        enabled: true,
        order: 2,
      },
      {
        id: "test",
        label: "Test with JUnit",
        description: "Exécute les tests avec JUnit",
        enabled: true,
        order: 3,
      },
      {
        id: "security",
        label: "Security Check with SpotBugs",
        description: "Analyse de sécurité avec SpotBugs",
        enabled: true,
        order: 4,
      },
    ],
  };

  // Retourner les étapes pour le langage spécifié ou des étapes génériques
  const specificSteps = languageSpecificSteps[lang] || [
    {
      id: "lint",
      label: "Lint Code",
      description: "Vérifie le style du code",
      enabled: true,
      order: 2,
    },
    {
      id: "test",
      label: "Run Tests",
      description: "Exécute les tests",
      enabled: true,
      order: 3,
    },
    {
      id: "security",
      label: "Security Check",
      description: "Analyse de sécurité",
      enabled: true,
      order: 4,
    },
  ];

  // Combiner les étapes communes et spécifiques et s'assurer que enabled est bien un booléen
  return [...commonSteps, ...specificSteps]
    .map((step) => ({
      ...step,
      enabled: Boolean(step.enabled),
    }))
    .sort((a, b) => a.order - b.order);
};

// Fonction pour obtenir le nom technique de l'étape en fonction du langage et de l'état
const getStepTechnicalName = (
  stepId: string,
  language: string,
  enabled: boolean
): string => {
  console.log(`Getting technical name for step ${stepId}, enabled: ${enabled}`);

  // Convertir le langage en minuscules
  const lang = language.toLowerCase();

  // Définir les noms techniques pour chaque combinaison langage/étape
  const technicalNames: Record<string, Record<string, string>> = {
    python: {
      lint: "lint:black",
      test: "test:pytest",
      security: "security:bandit",
      build_image: "build:docker",
      deploy: "deploy:kubernetes",
    },
    ruby: {
      lint: "lint:rubocop",
      test: "test:rspec",
      security: "security:brakeman",
      build_image: "build:docker",
      deploy: "deploy:kubernetes",
    },
    java: {
      lint: "lint:checkstyle",
      test: "test:junit",
      security: "security:spotbugs",
      build_image: "build:docker",
      deploy: "deploy:kubernetes",
    },
  };

  // Obtenir le nom technique pour le langage et l'étape spécifiés
  const technicalName =
    technicalNames[lang]?.[stepId] ||
    technicalNames.python[stepId] ||
    `${stepId}:default`;

  // Si l'étape est désactivée, ajouter le préfixe "skip-"
  const finalName = enabled ? technicalName : `skip-${technicalName}`;

  console.log(
    `Technical name for step ${stepId}, enabled ${enabled}: ${finalName}`
  );

  return finalName;
};

// Fonction pour obtenir l'icône correspondant à l'étape
const getStepIcon = (stepId: string) => {
  const icons = {
    build_image: Server,
    lint: Code,
    test: CheckCircle,
    security: Shield,
    deploy: Database,
  };

  return icons[stepId as keyof typeof icons] || Settings;
};

export default function ConfigurePipeline() {
  const analysisResults = useAnalysisStore((state) => state.analysisResults);
  const [projectInfo, setProjectInfo] = useState({
    projectName: "",
    language: "",
    packageManager: "",
    framework: "",
    mainFilePath: "",
    configPath: "",
    entrypoint: "",
  });

  const { getSessionId, saveStepData } = useSessionStore();
  const [steps, setSteps] = useState<PipelineStep[]>([]);

  // Charger les informations du projet
  useEffect(() => {
    if (analysisResults?.env) {
      const language = analysisResults.env.DOMINANT_LANGUAGE || "";
      setProjectInfo({
        projectName: analysisResults.env.APP_NAME || "",
        language: language,
        packageManager: analysisResults.env.PACKAGE_MANAGER || "",
        framework: analysisResults.env.FRAMEWORK_DETECTED || "",
        mainFilePath: analysisResults.env.APP_MAIN || "",
        configPath: analysisResults.env.APP_CONFIG || "",
        entrypoint: analysisResults.env.ENTRYPOINT || "",
      });

      // Charger les étapes spécifiques au langage
      setSteps(getLanguageSpecificSteps(language));
    }
  }, [analysisResults]);

  // Sauvegarder les données au chargement du composant et quand le langage change
  useEffect(() => {
    if (projectInfo.language) {
      savePipelineConfig();
    }
  }, [projectInfo.language]);

  // Modifier cette fonction pour sauvegarder après chaque changement
  const toggleStep = (stepId: string) => {
    console.log(
      `Toggling step ${stepId}, current state:`,
      steps.find((s) => s.id === stepId)
    );

    const newSteps = steps.map((step) => {
      if (step.id === stepId) {
        // Inverser explicitement la valeur booléenne
        const newEnabled = step.enabled === true ? false : true;
        console.log(
          `Step ${stepId} enabled changing from ${step.enabled} to ${newEnabled}`
        );
        return { ...step, enabled: newEnabled };
      }
      return step;
    });

    // Vérifier spécifiquement l'étape deploy
    const deployStep = newSteps.find((s) => s.id === "deploy");
    if (deployStep) {
      console.log("Deploy step after toggle:", deployStep);
      // Pour l'étape deploy, l'affichage est inversé par rapport à la valeur réelle
      console.log(`Deploy step will be displayed as: ${!deployStep.enabled}`);
    }

    setSteps(newSteps);

    // Sauvegarder après chaque changement
    setTimeout(() => {
      console.log("Steps before saving:", newSteps);
      savePipelineConfig();
    }, 0);
  };

  const moveStep = (stepId: string, direction: "up" | "down") => {
    const stepIndex = steps.findIndex((step) => step.id === stepId);
    if (
      (direction === "up" && stepIndex === 0) ||
      (direction === "down" && stepIndex === steps.length - 1)
    )
      return;

    const newSteps = [...steps];
    const targetIndex = direction === "up" ? stepIndex - 1 : stepIndex + 1;
    [newSteps[stepIndex], newSteps[targetIndex]] = [
      newSteps[targetIndex],
      newSteps[stepIndex],
    ];

    // Mettre à jour l'ordre
    newSteps.forEach((step, index) => {
      step.order = index + 1;
    });

    setSteps(newSteps);

    // Sauvegarder après chaque changement
    setTimeout(() => savePipelineConfig(), 0);
  };

  // Fonction pour sauvegarder la configuration du pipeline
  const savePipelineConfig = () => {
    // Obtenir le langage de l'application
    const language = projectInfo.language || "default";

    // Vérifier spécifiquement l'étape deploy
    const deployStep = steps.find((s) => s.id === "deploy");
    if (deployStep) {
      console.log("Deploy step before creating technical steps:", deployStep);
    }

    // Créer un tableau avec les noms techniques pour chaque étape
    const technicalSteps = steps.map((step) => {
      // S'assurer que enabled est bien un booléen
      // Pour l'étape deploy, inverser la valeur pour corriger l'inversion
      const isEnabled =
        step.id === "deploy" ? !Boolean(step.enabled) : Boolean(step.enabled);

      // Log spécifique pour l'étape deploy
      if (step.id === "deploy") {
        console.log(
          `Deploy step enabled: ${step.enabled}, corrected to: ${isEnabled} (inversé pour corriger le bug)`
        );
      }

      return {
        id: step.id,
        label: step.label,
        order: step.order,
        enabled: isEnabled,
        technicalName: getStepTechnicalName(step.id, language, isEnabled),
      };
    });

    // Vérifier spécifiquement l'étape deploy dans technicalSteps
    const technicalDeployStep = technicalSteps.find((s) => s.id === "deploy");
    if (technicalDeployStep) {
      console.log("Deploy step in technical steps:", technicalDeployStep);
    }

    // Créer l'objet de données à sauvegarder
    const pipelineData = {
      stepId: "4",
      code: {
        files: [],
        language: language,
        steps: technicalSteps,
      },
    };

    // Sauvegarder dans le store
    saveStepData("4", pipelineData);
    console.log("✅ Configuration du pipeline sauvegardée:", pipelineData);
  };

  // Fonction pour obtenir l'icône correspondant au langage
  const getLanguageIcon = () => {
    const lang = projectInfo.language.toLowerCase();
    if (lang === "ruby") return "💎";
    if (lang === "python") return "🐍";
    if (lang === "java") return "☕";
    return "🔧";
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="flex items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-500">
            Configure Pipeline
          </h1>
          <span className="ml-3 px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 dark:bg-indigo-900/50 dark:border-indigo-700/50 dark:text-indigo-300">
            {projectInfo.language}
          </span>
        </div>

        {/* Informations du projet */}
        <div className="mb-8 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 shadow-lg overflow-hidden">
          <div className="border-b border-slate-200 dark:border-slate-700/50 px-6 py-4">
            <div className="flex items-center">
              <FileCode className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Informations du projet
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Détails de configuration pour {projectInfo.projectName}
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Nom du projet
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {projectInfo.projectName}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Langage
                </p>
                <p className="flex items-center font-medium text-slate-900 dark:text-white">
                  <span className="mr-2">{getLanguageIcon()}</span>
                  {projectInfo.language}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Package Manager
                </p>
                <div className="flex items-center">
                  <Package className="w-4 h-4 text-slate-500 dark:text-slate-400 mr-2" />
                  <p className="font-medium text-slate-900 dark:text-white">
                    {projectInfo.packageManager}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Framework
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {projectInfo.framework}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Fichier principal
                </p>
                <p className="font-medium text-slate-700 dark:text-slate-300">
                  {projectInfo.mainFilePath}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Fichier de configuration
                </p>
                <p
                  className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-xs"
                  title={projectInfo.configPath}
                >
                  {projectInfo.configPath}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Commande de lancement
                </p>
                <div className="flex items-center">
                  <Play className="w-4 h-4 text-slate-500 dark:text-slate-400 mr-2" />
                  <code className="px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-900/70 text-sm font-mono text-indigo-600 dark:text-indigo-300">
                    {projectInfo.entrypoint}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration du pipeline */}
        <div className="rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 shadow-lg overflow-hidden">
          <div className="border-b border-slate-200 dark:border-slate-700/50 px-6 py-4">
            <div className="flex items-center">
              <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Étapes du pipeline pour {projectInfo.language || "votre projet"}
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Configurez les étapes d'intégration et de déploiement continus
            </p>
          </div>

          <div className="p-6 space-y-4">
            {steps.map((step, index) => {
              const StepIcon = getStepIcon(step.id);
              return (
                <div
                  key={step.id}
                  className="group relative rounded-lg border border-slate-200 dark:border-slate-700/50 bg-white hover:bg-slate-50 dark:bg-slate-800/70 dark:hover:bg-slate-800 transition-all duration-200 hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:shadow-md hover:shadow-indigo-100 dark:hover:shadow-indigo-500/10"
                >
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 border border-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-400 dark:border-indigo-700/50">
                        <StepIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900 dark:text-white">
                          {step.label}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {step.description}
                        </p>
                        <span className="mt-1 inline-block px-2 py-0.5 text-xs font-mono rounded bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-900/70 dark:text-slate-400 dark:border-slate-700/50">
                          {getStepTechnicalName(
                            step.id,
                            projectInfo.language,
                            step.enabled
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => moveStep(step.id, "up")}
                          disabled={index === 0}
                          className="h-8 w-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700/70 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Déplacer vers le haut"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => moveStep(step.id, "down")}
                          disabled={index === steps.length - 1}
                          className="h-8 w-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700/70 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Déplacer vers le bas"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="h-8 w-px bg-slate-200 dark:bg-slate-700/50"></div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {step.id === "deploy"
                            ? !step.enabled
                              ? "Activé"
                              : "Désactivé"
                            : step.enabled
                            ? "Activé"
                            : "Désactivé"}
                        </span>
                        <button
                          onClick={() => toggleStep(step.id)}
                          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900"
                          role="switch"
                          aria-checked={
                            step.id === "deploy" ? !step.enabled : step.enabled
                          }
                        >
                          <span
                            className={`${
                              step.id === "deploy"
                                ? !step.enabled
                                  ? "bg-indigo-500"
                                  : "bg-slate-300 dark:bg-slate-700"
                                : step.enabled
                                ? "bg-indigo-500"
                                : "bg-slate-300 dark:bg-slate-700"
                            } absolute h-6 w-11 rounded-full transition-colors`}
                          />
                          <span
                            className={`${
                              step.id === "deploy"
                                ? !step.enabled
                                  ? "translate-x-6"
                                  : "translate-x-1"
                                : step.enabled
                                ? "translate-x-6"
                                : "translate-x-1"
                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
