"use client";

import type React from "react";

import { useSessionStore } from "@/store/sessionStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const AddProjectLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const { theme } = useTheme();
  const { initSession, getSessionId, saveStepData, getStepData } =
    useSessionStore();

  useEffect(() => {
    initSession();
  }, [initSession]);

  const steps = [
    {
      name: "Add Code",
      path: "/dashboard/projects/addProject/addCode",
      id: 1,
    },
    {
      name: "Verify Application",
      path: "/dashboard/projects/addProject/verifyApplication",
      id: 2,
    },
    {
      name: "Setup Stack",
      path: "/dashboard/projects/addProject/setupStack",
      id: 3,
    },
    {
      name: "Configure Pipeline",
      path: "/dashboard/projects/addProject/configurePipeline",
      id: 4,
    },
    {
      name: "Final Results",
      path: "/dashboard/projects/addProject/finalResult",
      id: 5,
    },
  ];

  const currentStep = steps.findIndex((step) => step.path === pathname);

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setIsNavigating(true);

      try {
        console.log("🔄 Sauvegarde de l'étape en cours avant navigation...");

        if (currentStep === 2) {
          console.log(
            "⏭️ Étape 3 (Setup Stack) : sauvegarde automatique désactivée"
          );
          router.push(steps[currentStep + 1].path);
          setIsNavigating(false);
          return;
        }

        const saved = await saveCurrentStep();

        if (saved) {
          console.log("✅ Étape sauvegardée avec succès");
          router.push(steps[currentStep + 1].path);
          setIsNavigating(false);
        } else {
          console.warn("⚠️ L'étape n'a pas pu être sauvegardée");
          setIsNavigating(false);
        }
      } catch (error) {
        console.error("❌ Erreur lors de la sauvegarde:", error);
        alert(
          "Une erreur est survenue lors de la sauvegarde. Veuillez réessayer."
        );
        setIsNavigating(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      router.push(steps[currentStep - 1].path);
    }
  };

  const saveCurrentStep = async () => {
    try {
      const sessionId = getSessionId();
      const stepId = currentStep + 1;
      let stepData = {};

      switch (currentStep) {
        case 0:
          stepData = {
            stepId: "1",
            verificationResults: {
              status: "success",
              message: "Good Analysis !",
            },
          };
          saveStepData("1", stepData);
          break;

        case 1:
          const verificationData =
            useSessionStore.getState().getVerificationData() || {};
          stepData = {
            stepId: "2",
            app: [
              {
                appName: verificationData.projectName || "",
                label: verificationData.projectName || "",
                icon: `${
                  verificationData.language?.toLowerCase() || "python"
                }.svg`,
                type: "language",
                isFromAnalysis: true,
                APP_DIR: verificationData.appDir || "",
                APP_MAIN: verificationData.mainFilePath || "",
                APP_MAIN_DIR: verificationData.appMainDir || "",
                APP_CONFIG: verificationData.configPath || "",
                APP_CONFIG_DIR: verificationData.appConfigDir || "",
                APP_NAME: verificationData.projectName || "",
                ENTRYPOINT: verificationData.entrypoint || "",
                PACKAGE_MANAGER: verificationData.packageManager || "",
                FRAMEWORK_DETECTED: verificationData.framework || "",
                DOMINANT_LANGUAGE: verificationData.language || "",
                CONF: verificationData.conf || "package",
                PBK_TO_BUILD: verificationData.pbkToBuild || "",
              },
            ],
          };
          saveStepData("2", stepData);
          break;

        case 2:
          const verificationData2 =
            useSessionStore.getState().getVerificationData() || {};
          const step2Data = getStepData("2") || {};
          const language =
            verificationData2?.language?.toLowerCase() ||
            step2Data.app?.[0]?.label?.toLowerCase() ||
            "python";
          const workflowData = getStepData("3") || {};
          const allNodes = workflowData.nodes || [];

          type NodeType = {
            label?: string;
            name?: string;
            icon?: string;
            type?: string;
            template?: string;
            selectedTemplate?: string;
            packageManager?: string;
            [key: string]: unknown;
          };

          const languageNode: NodeType = {
            label: language,
            icon: `${language}.svg`,
            type: "language",
            template: "package",
          };

          const serviceNodes = allNodes
            .filter((node: NodeType) => node.type === "service")
            .map((node: NodeType) => ({
              name: node.label || "",
              template: node.selectedTemplate || node.template || "",
            }));

          const databaseNodes = allNodes
            .filter((node: NodeType) => node.type === "database")
            .map((node: NodeType) => ({
              name: node.label || "",
              template: node.selectedTemplate || node.template || "",
            }));

          const allNodesForAppsConfig = [
            languageNode,
            ...allNodes.filter(
              (node: NodeType) =>
                node.type === "service" || node.type === "database"
            ),
          ];

          stepData = {
            stepId: "3",
            stack: {
              services: serviceNodes,
              databases: databaseNodes,
              appsConfig: [{ nodes: allNodesForAppsConfig }],
            },
          };
          break;

        case 3:
          const pipelineData = getStepData("4") || {};
          const steps = pipelineData.code?.steps || [];
          const processedSteps = steps.map((step: any) => {
            if (step.id === "deploy") {
              console.log("Deploy step in layout.tsx:", step);
            }
            const isEnabled = Boolean(step.enabled);
            if (step.id === "deploy") {
              console.log(
                `Deploy step enabled: ${step.enabled}, converted to: ${isEnabled}`
              );
            }
            return { ...step, enabled: isEnabled };
          });

          stepData = {
            stepId: "4",
            code: {
              files: [],
              language: pipelineData.code?.language || "python",
              steps: processedSteps,
            },
          };
          break;

        default:
          stepData = {};
      }

      if (Object.keys(stepData).length === 0) {
        console.warn(`Aucune donnée disponible pour l'étape ${stepId}`);
        return false;
      }

      const requestData = {
        session_id: sessionId,
        step_id: String(stepId),
        step_data: stepData,
      };

      const response = await fetch("http://localhost:5000/api/pipeline/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `❌ Erreur lors de la sauvegarde de l'étape ${stepId}:`,
          errorText
        );
        return false;
      }

      const data = await response.json();
      console.log(`✅ Étape ${stepId} sauvegardée avec succès:`, data);
      return true;
    } catch (error) {
      console.error("❌ Erreur lors de la sauvegarde de l'étape:", error);
      return false;
    }
  };

  const handleFinish = async () => {
    try {
      const sessionId = useSessionStore.getState().getSessionId();

      if (!sessionId) {
        console.error("Aucun sessionId trouvé dans le store");
        throw new Error("Session non trouvée");
      }

      const requestData = { session_id: sessionId };
      const response = await fetch(
        "http://localhost:5000/api/pipeline/finalize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Erreur lors de la finalisation: ${response.status} ${errorText}`
        );
      }

      const data = await response.json();
      console.log("✅ Finalisation réussie - Données reçues:", data);
      router.push("/dashboard/projects");
    } catch (error) {
      console.error("❌ Erreur lors de la finalisation:", error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-8 px-4">
      {/* Stepper Navigation - Outside the main container */}
      <div className="mb-8">
        <div className="inline-flex rounded-2xl bg-slate-200 dark:bg-slate-800/50 p-2 backdrop-blur-sm border border-slate-300 dark:border-slate-700/50">
          <div className="flex items-center">
            {steps.map((step, index) => {
              // Déterminer l'état de l'étape
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              const isFuture = index > currentStep;

              // Déterminer les classes pour chaque étape
              let stepClasses =
                "px-4 py-2 text-sm font-medium transition-all duration-200 ";

              // Appliquer le style "plus" pour les étapes actives et complétées
              if (isActive || isCompleted) {
                stepClasses += "bg-indigo-600 text-white ";

                // Arrondir uniquement le coin gauche de la première étape
                if (index === 0) {
                  stepClasses += "rounded-l-xl ";
                }

                // Arrondir uniquement le coin droit de la dernière étape active/complétée
                if (index === currentStep && index < steps.length - 1) {
                  stepClasses += "rounded-r-xl ";
                }
              } else {
                // Style "moins" pour les étapes futures
                stepClasses +=
                  "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800/50 rounded-xl ml-2 ";
              }

              return (
                <div key={index} className={stepClasses}>
                  {step.name}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="w-full max-w-5xl bg-white dark:bg-gradient-to-b dark:from-slate-800/90 dark:to-slate-900/90 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-xl backdrop-blur-sm p-6">
        {/* Content Area */}
        <div className="flex-grow mb-8">{children}</div>

        {/* Navigation Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
              currentStep === 0
                ? "bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                : "bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700/50 backdrop-blur-sm border border-slate-300 dark:border-slate-700/50"
            }`}
          >
            Previous
          </button>
          {currentStep === steps.length - 1 ? (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-500 transition-all duration-200"
            >
              Finish
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={currentStep === steps.length - 1 || isNavigating}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                currentStep === steps.length - 1 || isNavigating
                  ? "bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-500"
              }`}
            >
              {isNavigating ? (
                <span className="flex items-center">
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
                  Sauvegarde...
                </span>
              ) : (
                "Next"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProjectLayout;
