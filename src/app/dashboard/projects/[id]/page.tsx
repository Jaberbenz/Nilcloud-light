"use client";

import {
  AlertTriangle,
  Clock,
  Code,
  Database,
  ExternalLink,
  GitBranch,
  Globe,
  Server,
  Terminal,
  Trash2,
  X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

// Simulation de données de projet - dans une application réelle,
// ces données viendraient d'une API ou d'une base de données
const projectsData = {
  "1": {
    title: "Project One",
    language: "JavaScript",
    envNumber: "env_001",
    environment: "Development",
    lastUpdated: "2 hours ago",
    branch: "main",
    technologies: ["React", "Node.js", "Express"],
    deploymentStatus: "Online",
    serverHealth: 92,
    deploymentUrl: "https://project-one-dev.example.com",
    description:
      "E-commerce platform with modern UI and seamless payment integration.",
    repositoryUrl: "https://github.com/myorg/project-one",
    services: [
      { name: "Web Server", status: "Online", load: "42%" },
      { name: "Database", status: "Online", load: "38%" },
      { name: "Cache", status: "Online", load: "21%" },
    ],
    resources: {
      cpu: { usage: "42%", cores: 8 },
      memory: { total: "16 GB", used: "10.9 GB", free: "5.1 GB" },
      storage: { total: "100 GB", used: "45 GB", free: "55 GB" },
    },
  },
  // Autres projets...
};

export default function ProjectGeneralPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Récupérer les données du projet en fonction de l'ID
  const project = projectsData[id as keyof typeof projectsData] || {
    title: `Project ${id}`,
    description: "Project details not found",
    deploymentStatus: "Unknown",
    serverHealth: 0,
    environment: "Unknown",
    branch: "unknown",
    lastUpdated: "unknown",
    technologies: [],
    deploymentUrl: "#",
    services: [],
    resources: {
      cpu: { usage: "0%", cores: 0 },
      memory: { total: "0 GB", used: "0 GB", free: "0 GB" },
      storage: { total: "0 GB", used: "0 GB", free: "0 GB" },
    },
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    // Ici, vous implémenteriez la logique de suppression
    console.log(`Project ${id} would be deleted`);
    setShowDeleteModal(false);
    // Rediriger vers la liste des projets après suppression
    router.push("/dashboard/projects");
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "online":
        return "bg-green-100/20 text-green-400 border-green-800/30 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/30";
      case "offline":
        return "bg-red-100/20 text-red-400 border-red-800/30 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/30";
      case "maintenance":
        return "bg-amber-100/20 text-amber-400 border-amber-800/30 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/30";
      default:
        return "bg-slate-100/20 text-slate-400 border-slate-800/30 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-800/30";
    }
  };

  // Helper function to get technology tag style
  const getTechTagStyle = (tech: string) => {
    switch (tech.toLowerCase()) {
      case "react":
        return "bg-blue-100/20 text-blue-400 border-blue-800/30 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/30";
      case "node.js":
        return "bg-green-100/20 text-green-400 border-green-800/30 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/30";
      case "express":
        return "bg-gray-100/20 text-gray-400 border-gray-800/30 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800/30";
      default:
        return "bg-purple-100/20 text-purple-400 border-purple-800/30 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête du projet */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-slate-700/50">
        <div>
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-[#8B9FFF]">
            {project.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {project.description}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span
            className={`px-3 py-1 text-sm rounded-full border font-medium ${getStatusColor(
              project.deploymentStatus
            )}`}
          >
            {project.deploymentStatus}
          </span>

          {/* Bouton de suppression */}
          <button
            onClick={handleDeleteClick}
            className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors"
            aria-label="Delete project"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main content - grid with cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Basic Info */}
        <div className="space-y-6">
          {/* Project Info Card */}
          <div className="rounded-xl bg-white dark:bg-[#151B2B] border border-gray-200 dark:border-slate-800 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-[#6366F1] dark:to-[#8B5CF6] p-4 text-white">
              <div className="flex items-center">
                <Code className="h-5 w-5 mr-2" />
                <h3 className="text-lg font-bold">Project Info</h3>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                <Clock className="h-4 w-4 mr-2" />
                Last updated: {project.lastUpdated}
              </div>
              <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                <GitBranch className="h-4 w-4 mr-2" />
                Branch:{" "}
                <span className="ml-2 font-mono bg-gray-100 dark:bg-[#0B1120] px-2 py-0.5 rounded">
                  {project.branch}
                </span>
              </div>
              <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                <Server className="h-4 w-4 mr-2" />
                Environment: {project.environment}
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-slate-700/50">
                <a
                  href={project.deploymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-[#60A5FA] dark:hover:text-[#818CF8] transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {project.deploymentUrl.replace(/(^\w+:|^)\/\//, "")}
                </a>
              </div>
              {project.repositoryUrl && (
                <div>
                  <a
                    href={project.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-[#60A5FA] dark:hover:text-[#818CF8] transition-colors"
                  >
                    <GitBranch className="h-4 w-4 mr-2" />
                    Repository
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Technologies Card */}
          <div className="rounded-xl bg-white dark:bg-[#151B2B] border border-gray-200 dark:border-slate-800 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-[#6366F1] dark:to-[#8B5CF6] p-4 text-white">
              <div className="flex items-center">
                <Terminal className="h-5 w-5 mr-2" />
                <h3 className="text-lg font-bold">Technologies</h3>
              </div>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-2 mt-2">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 text-xs font-medium rounded-full border ${getTechTagStyle(
                      tech
                    )}`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column - Services Status */}
        <div className="space-y-6">
          {/* Services Status */}
          <div className="rounded-xl bg-white dark:bg-[#151B2B] border border-gray-200 dark:border-slate-800 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-[#6366F1] dark:to-[#8B5CF6] p-4 text-white">
              <div className="flex items-center">
                <Server className="h-5 w-5 mr-2" />
                <h3 className="text-lg font-bold">Services</h3>
              </div>
            </div>
            <div className="p-4 space-y-4">
              {project.services.map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {service.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(
                        service.status
                      )}`}
                    >
                      {service.status}
                    </span>
                    <div className="w-24">
                      <div className="w-full bg-gray-200 dark:bg-[#0B1120] rounded-full h-1.5">
                        <div
                          className="bg-indigo-500 dark:bg-[#8B9FFF] h-1.5 rounded-full"
                          style={{ width: service.load }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deployment Status Card */}
          <div className="rounded-xl bg-white dark:bg-[#151B2B] border border-gray-200 dark:border-slate-800 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-[#6366F1] dark:to-[#8B5CF6] p-4 text-white">
              <div className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                <h3 className="text-lg font-bold">Deployment Status</h3>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Server Health
                </span>
                <span
                  className={`px-2 py-0.5 text-xs rounded-full border font-medium ${getStatusColor(
                    project.deploymentStatus
                  )}`}
                >
                  {project.deploymentStatus}
                </span>
              </div>

              <div className="w-full bg-gray-200 dark:bg-[#0B1120] rounded-full h-2 mb-4">
                <div
                  className={`h-2 rounded-full ${
                    project.deploymentStatus.toLowerCase() === "online"
                      ? "bg-green-500"
                      : project.deploymentStatus.toLowerCase() === "maintenance"
                      ? "bg-amber-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${project.serverHealth}%` }}
                ></div>
              </div>
              <div className="text-xs text-right text-slate-500">
                {project.serverHealth}% health
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Resources */}
        <div>
          <div className="rounded-xl bg-white dark:bg-[#151B2B] border border-gray-200 dark:border-slate-800 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-[#6366F1] dark:to-[#8B5CF6] p-4 text-white">
              <div className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                <h3 className="text-lg font-bold">Resources</h3>
              </div>
            </div>
            <div className="p-4 space-y-6">
              {/* CPU Usage */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    CPU Usage
                  </span>
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {project.resources.cpu.usage}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-[#0B1120] rounded-full h-1.5 mb-2">
                  <div
                    className="bg-indigo-500 dark:bg-[#6366F1] h-1.5 rounded-full"
                    style={{ width: project.resources.cpu.usage }}
                  ></div>
                </div>
                <div className="text-xs text-slate-500">
                  {project.resources.cpu.cores} cores
                </div>
              </div>

              {/* Memory Usage */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Memory
                  </span>
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {project.resources.memory.used} /{" "}
                    {project.resources.memory.total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-[#0B1120] rounded-full h-1.5 mb-2">
                  <div
                    className="bg-indigo-400 dark:bg-[#818CF8] h-1.5 rounded-full"
                    style={{
                      width: `${
                        (Number.parseInt(project.resources.memory.used) /
                          Number.parseInt(project.resources.memory.total)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
                <div className="text-xs text-slate-500">
                  {project.resources.memory.free} available
                </div>
              </div>

              {/* Storage Usage */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Storage
                  </span>
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {project.resources.storage.used} /{" "}
                    {project.resources.storage.total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-[#0B1120] rounded-full h-1.5 mb-2">
                  <div
                    className="bg-indigo-300 dark:bg-[#A5B4FC] h-1.5 rounded-full"
                    style={{
                      width: `${
                        (Number.parseInt(project.resources.storage.used) /
                          Number.parseInt(project.resources.storage.total)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
                <div className="text-xs text-slate-500">
                  {project.resources.storage.free} available
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white dark:bg-[#151B2B] border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2" />
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  Confirm Deletion
                </h3>
              </div>
              <button
                onClick={handleCancelDelete}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors"
              >
                <X className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-slate-700 dark:text-slate-300 mb-2">
                Are you sure you want to delete this project?
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                <span className="font-semibold text-indigo-600 dark:text-[#8B9FFF]">
                  {project.title}
                </span>{" "}
                will be permanently removed. This action cannot be undone.
              </p>
            </div>

            <div className="flex space-x-3 justify-end">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600/80 hover:bg-red-600 text-white transition-colors flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-1.5" />
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
