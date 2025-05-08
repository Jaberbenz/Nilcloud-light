"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import {
  Clock,
  GitBranch,
  ExternalLink,
  Trash2,
  X,
  AlertTriangle,
} from "lucide-react";

const projects = [
  {
    id: "1",
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
  },
  {
    id: "2",
    title: "Project Two",
    language: "Python",
    envNumber: "env_002",
    environment: "Production",
    lastUpdated: "1 day ago",
    branch: "main",
    technologies: ["Python", "Django", "PostgreSQL"],
    deploymentStatus: "Online",
    serverHealth: 98,
    deploymentUrl: "https://project-two.example.com",
  },
  {
    id: "3",
    title: "Project Three",
    language: "React",
    envNumber: "env_003",
    environment: "Staging",
    lastUpdated: "5 hours ago",
    branch: "develop",
    technologies: ["React", "Redux", "Firebase"],
    deploymentStatus: "Online",
    serverHealth: 87,
    deploymentUrl: "https://staging.project-three.example.com",
  },
  {
    id: "4",
    title: "Project Four",
    language: "React",
    envNumber: "env_004",
    environment: "Testing",
    lastUpdated: "3 days ago",
    branch: "feature/new-ui",
    technologies: ["React", "GraphQL", "MongoDB"],
    deploymentStatus: "Offline",
    serverHealth: 0,
    deploymentUrl: "https://test.project-four.example.com",
  },
  {
    id: "5",
    title: "Project Five",
    language: "TypeScript",
    envNumber: "env_005",
    environment: "QA",
    lastUpdated: "12 hours ago",
    branch: "release/v2.0",
    technologies: ["TypeScript", "Next.js", "Prisma"],
    deploymentStatus: "Maintenance",
    serverHealth: 45,
    deploymentUrl: "https://qa.project-five.example.com",
  },
];

const ProjectsPage = () => {
  const router = useRouter();
  // Fixed bug: Initialize showDeleteModal to false to prevent it from showing automatically
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const handleCreateProject = async () => {
    try {
      // Generate a unique session ID
      const sessionId = uuidv4();

      // Send initialization request
      const response = await fetch("http://localhost:5000/api/pipeline/init", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session_id: sessionId }),
      });

      if (!response.ok) {
        throw new Error("Failed to initialize pipeline");
      }

      // Store sessionId in localStorage for later use
      localStorage.setItem("pipelineSessionId", sessionId);

      // Redirect to code addition page
      router.push("/dashboard/projects/addProject/addCode");
    } catch (error) {
      console.error("Error initializing pipeline:", error);
      // You can add more elaborate error handling here (toast, alert, etc.)
    }
  };

  // Helper function to get status color
  // Updated to match the colors in the screenshot
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

  // Helper function to get technology color
  // Updated to match the colors in the screenshot
  const getTechColor = (tech: string) => {
    switch (tech.toLowerCase()) {
      case "react":
        return "bg-blue-100/20 text-blue-400 border-blue-800/30 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/30";
      case "node.js":
        return "bg-green-100/20 text-green-400 border-green-800/30 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/30";
      case "express":
        return "bg-gray-100/20 text-gray-400 border-gray-800/30 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800/30";
      case "python":
        return "bg-yellow-100/20 text-yellow-400 border-yellow-800/30 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800/30";
      case "django":
        return "bg-emerald-100/20 text-emerald-400 border-emerald-800/30 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/30";
      case "postgresql":
        return "bg-indigo-100/20 text-indigo-400 border-indigo-800/30 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800/30";
      case "redux":
        return "bg-purple-100/20 text-purple-400 border-purple-800/30 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/30";
      case "firebase":
        return "bg-amber-100/20 text-amber-400 border-amber-800/30 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/30";
      case "graphql":
        return "bg-pink-100/20 text-pink-400 border-pink-800/30 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-800/30";
      case "mongodb":
        return "bg-green-100/20 text-green-400 border-green-800/30 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/30";
      case "typescript":
        return "bg-blue-100/20 text-blue-400 border-blue-800/30 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/30";
      case "next.js":
        return "bg-slate-100/20 text-slate-400 border-slate-800/30 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-800/30";
      case "prisma":
        return "bg-indigo-100/20 text-indigo-400 border-indigo-800/30 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800/30";
      default:
        return "bg-slate-100/20 text-slate-400 border-slate-800/30 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-800/30";
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation(); // Prevent navigation to project page
    setProjectToDelete(projectId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    // Your collaborator will implement deletion logic here
    console.log(`Project ${projectToDelete} would be deleted`);
    setShowDeleteModal(false);
    setProjectToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setProjectToDelete(null);
  };

  // Find project to delete (to display its name in the modal)
  const projectToDeleteData = projects.find((p) => p.id === projectToDelete);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#0B1120] dark:text-slate-100">
      <div className="container mx-auto p-6">
        {/* Main title */}
        <h1 className="text-3xl font-bold mb-6 text-blue-600 dark:text-[#8B9FFF]">
          My Awesome Projects
        </h1>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add Project Card */}
          <div
            onClick={handleCreateProject}
            className="flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white text-blue-600 transition-all duration-200 hover:border-blue-500/50 hover:bg-gray-50 hover:shadow-lg hover:shadow-blue-500/10 h-[240px] dark:border-slate-700/50 dark:bg-[#151B2B] dark:text-[#8B9FFF] dark:hover:border-[#6366F1]/50 dark:hover:bg-[#151B2B]/70 dark:hover:shadow-[#6366F1]/10"
          >
            <div className="flex flex-col items-center">
              <span className="text-6xl font-bold">+</span>
              <p className="mt-2 text-lg font-semibold">Create New Project</p>
            </div>
          </div>

          {/* Existing Project Cards */}
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => router.push(`/dashboard/projects/${project.id}`)}
              className="flex flex-col rounded-xl bg-white border border-gray-200 shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/10 hover:border-gray-300 h-[240px] cursor-pointer relative dark:bg-[#151B2B] dark:border-slate-800 dark:hover:shadow-[#6366F1]/10 dark:hover:border-slate-700"
            >
              {/* Delete Button */}
              <button
                onClick={(e) => handleDeleteClick(e, project.id)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-red-100/20 text-red-400 hover:bg-red-200/30 transition-colors dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                aria-label="Delete project"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              {/* Header */}
              <div className="p-4">
                <h2 className="text-xl font-bold text-blue-600 pr-8 dark:text-[#8B9FFF]">
                  {project.title}
                </h2>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-slate-400">
                    <Clock className="h-4 w-4 mr-1" />
                    {project.lastUpdated}
                  </div>

                  <div className="flex items-center text-sm text-gray-600 dark:text-slate-400">
                    <GitBranch className="h-4 w-4 mr-1" />
                    <span className="font-mono bg-gray-100 px-2 py-0.5 rounded dark:bg-[#0B1120]">
                      {project.branch}
                    </span>
                  </div>
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {project.technologies.slice(0, 3).map((tech, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 text-xs font-medium rounded-full border ${getTechColor(
                        tech
                      )}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Body */}
              <div className="px-4 py-2 flex-1">
                <a
                  href={project.deploymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-[#60A5FA] hover:text-[#818CF8] transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-4 w-4 mr-1.5" />
                  {project.deploymentUrl.replace(/(^\w+:|^)\/\//, "")}
                </a>
              </div>

              {/* Deployment Status */}
              <div className="px-4 pb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-600 dark:text-slate-400">
                    Deployment Status
                  </span>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full border font-medium ${getStatusColor(
                      project.deploymentStatus
                    )}`}
                  >
                    {project.deploymentStatus}
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-[#0B1120]">
                  <div
                    className={`h-2 rounded-full ${
                      project.deploymentStatus.toLowerCase() === "online"
                        ? "bg-green-500"
                        : project.deploymentStatus.toLowerCase() ===
                          "maintenance"
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${project.serverHealth}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal - Only shown when showDeleteModal is true */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 dark:bg-black/60"
          // Added onClick handler to close modal when clicking outside
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="bg-white border border-gray-200 rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200 dark:bg-[#151B2B] dark:border-slate-700"
            // Prevent clicks from propagating to parent (which would close the modal)
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">
                  Confirm Deletion
                </h3>
              </div>
              <button
                onClick={handleCancelDelete}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-slate-400" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-2 dark:text-slate-300">
                Are you sure you want to delete this project?
              </p>
              <p className="text-gray-600 text-sm dark:text-slate-400">
                <span className="font-semibold text-blue-600 dark:text-[#8B9FFF]">
                  {projectToDeleteData?.title}
                </span>{" "}
                will be permanently removed. This action cannot be undone.
              </p>
            </div>

            <div className="flex space-x-3 justify-end">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors flex items-center dark:bg-red-600/80 dark:hover:bg-red-600"
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
};

export default ProjectsPage;
