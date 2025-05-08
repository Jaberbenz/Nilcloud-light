"use client";

import type React from "react";

import { CheckCircle, Code, Database, Server, Shield } from "lucide-react";
import { useEffect, useState } from "react";

// Define the job types
interface Job {
  id: string;
  title: string;
  description: string;
  technicalName: string;
  icon: React.ElementType;
  status: "pending" | "running" | "completed" | "failed";
  progress: number;
}

export default function FinalResult() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentJobIndex, setCurrentJobIndex] = useState(-1);
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: "build_image",
      title: "Build Docker Image",
      description: "Construit l'image Docker de l'application",
      technicalName: "build:docker",
      icon: Server,
      status: "pending",
      progress: 0,
    },
    {
      id: "lint",
      title: "Lint with Rubocop",
      description: "Vérifie le style du code avec Rubocop",
      technicalName: "lint:rubocop",
      icon: Code,
      status: "pending",
      progress: 0,
    },
    {
      id: "test",
      title: "Test with RSpec",
      description: "Exécute les tests avec RSpec",
      technicalName: "test:rspec",
      icon: CheckCircle,
      status: "pending",
      progress: 0,
    },
    {
      id: "security",
      title: "Security Check with Brakeman",
      description: "Analyse de sécurité avec Brakeman",
      technicalName: "security:brakeman",
      icon: Shield,
      status: "pending",
      progress: 0,
    },
    {
      id: "deploy",
      title: "Deploy Application",
      description: "Déploie l'application",
      technicalName: "deploy:kubernetes",
      icon: Database,
      status: "pending",
      progress: 0,
    },
  ]);

  // Function to start the job processing
  const startProcessing = () => {
    setIsProcessing(true);
    setCurrentJobIndex(0);
  };

  // Simulate job progress
  useEffect(() => {
    if (
      !isProcessing ||
      currentJobIndex === -1 ||
      currentJobIndex >= jobs.length
    ) {
      return;
    }

    const currentJob = jobs[currentJobIndex];

    if (currentJob.progress >= 100) {
      // Current job is complete, move to the next job
      if (currentJobIndex < jobs.length - 1) {
        setCurrentJobIndex(currentJobIndex + 1);
      } else {
        // All jobs are complete
        setIsProcessing(false);

        // Ajouter une redirection vers localhost:8080/dashboard/projects après 2 secondes
        setTimeout(() => {
          window.location.href = "http://localhost:8080/dashboard/projects";
        }, 2000);
      }
      return;
    }

    // Update progress of the current job
    const timer = setTimeout(() => {
      setJobs((prevJobs) => {
        const updatedJobs = [...prevJobs];
        const job = { ...updatedJobs[currentJobIndex] };

        // Increment progress
        const increment = Math.floor(Math.random() * 10) + 5; // Random increment between 5-15
        job.progress = Math.min(job.progress + increment, 100);

        // Update status
        if (job.progress === 0) {
          job.status = "pending";
        } else if (job.progress < 100) {
          job.status = "running";
        } else {
          job.status = "completed";
        }

        updatedJobs[currentJobIndex] = job;
        return updatedJobs;
      });
    }, 300); // Update every 300ms

    return () => clearTimeout(timer);
  }, [isProcessing, currentJobIndex, jobs]);

  // Get overall progress
  const overallProgress =
    jobs.reduce((acc, job) => acc + job.progress, 0) / jobs.length;

  return (
    <div className="bg-gradient-to-b from-white to-slate-100 dark:from-slate-800 dark:to-slate-900 min-h-screen text-slate-900 dark:text-white p-6">
      <div className="container mx-auto max-w-4xl">
        <div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-500 mb-6">
            Final Result
          </h2>

          {!isProcessing ? (
            <div className="space-y-6">
              <p className="text-slate-700 dark:text-slate-300">
                Your pipeline configuration is ready to be processed. Click the
                "Finish" button to start the deployment process.
              </p>

              <div className="flex justify-center mt-8">
                <button
                  onClick={startProcessing}
                  className="px-6 py-3 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-500 transition-all duration-200 shadow-lg hover:shadow-indigo-500/20"
                >
                  Start Deployment
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Overall progress */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Overall Progress
                  </span>
                  <span className="text-sm font-medium text-indigo-600 dark:text-indigo-300">
                    {Math.round(overallProgress)}%
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${overallProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Job list */}
              <div className="space-y-4">
                {jobs.map((job, index) => {
                  const JobIcon = job.icon;

                  return (
                    <div
                      key={job.id}
                      className={`rounded-lg border ${
                        currentJobIndex === index
                          ? "border-indigo-300 bg-indigo-50/80 dark:border-indigo-500/50 dark:bg-indigo-900/20"
                          : index < currentJobIndex
                          ? "border-green-300 bg-green-50/80 dark:border-green-500/30 dark:bg-green-900/10"
                          : "border-slate-200 bg-white dark:border-slate-700/50 dark:bg-slate-800/50"
                      } p-4 transition-all duration-300`}
                    >
                      <div className="flex items-center mb-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            job.status === "completed"
                              ? "bg-green-100 text-green-600 border border-green-200 dark:bg-green-900/50 dark:text-green-400 dark:border-green-700/50"
                              : job.status === "running"
                              ? "bg-indigo-100 text-indigo-600 border border-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-400 dark:border-indigo-700/50"
                              : "bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-900/50 dark:text-slate-400 dark:border-slate-700/50"
                          }`}
                        >
                          <JobIcon className="h-5 w-5" />
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium text-slate-900 dark:text-white">
                              {job.title}
                            </h3>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                job.status === "completed"
                                  ? "bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/30"
                                  : job.status === "running"
                                  ? "bg-indigo-100 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800/30"
                                  : "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-800/30"
                              }`}
                            >
                              {job.status === "completed"
                                ? "Completed"
                                : job.status === "running"
                                ? "Running"
                                : "Pending"}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {job.description}
                          </p>
                          <span className="mt-1 inline-block px-2 py-0.5 text-xs font-mono rounded bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-900/70 dark:text-slate-400 dark:border-slate-700/50">
                            {job.technicalName}
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ease-out ${
                            job.status === "completed"
                              ? "bg-green-500"
                              : "bg-indigo-500"
                          }`}
                          style={{ width: `${job.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
