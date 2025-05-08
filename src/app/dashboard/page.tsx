"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  Code,
  CpuIcon,
  GitBranch,
  Globe,
  HardDrive,
  Server,
  Zap,
  Database,
  BarChart3,
  LineChart,
} from "lucide-react";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#0B1120] dark:text-slate-100">
      <div className="container mx-auto p-6">
        {/* Updated title color to match the projects page */}
        <h1 className="text-3xl font-bold mb-6 text-blue-600 dark:text-[#8B9FFF]">
          Dashboard Overview
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Latest Project */}
          <div className="rounded-2xl bg-white border border-gray-200 shadow-lg overflow-hidden dark:bg-[#151B2B] dark:border-slate-800">
            {/* Updated gradient colors to match the theme */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 dark:from-[#6366F1] dark:to-[#8B5CF6]">
              <div className="flex items-center">
                <Code className="h-5 w-5 mr-2" />
                <h2 className="text-xl font-bold">Latest Project</h2>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Updated color to match the E-Commerce Platform text in the screenshot */}
              <h3 className="text-xl font-semibold text-blue-600 dark:text-[#8B9FFF]">
                E-Commerce Platform
              </h3>

              <div className="flex items-center text-sm text-gray-600 dark:text-slate-400">
                <Clock className="h-4 w-4 mr-1" />
                Last updated: 2 hours ago
              </div>

              <div className="flex items-center text-sm text-gray-600 dark:text-slate-400">
                <GitBranch className="h-4 w-4 mr-1" />
                Branch:{" "}
                <span className="ml-1 font-mono bg-gray-100 dark:bg-[#0B1120] px-2 py-0.5 rounded">
                  main
                </span>
              </div>

              {/* Updated technology tag colors to match the screenshot */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100/20 text-blue-400 border border-blue-800/30 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/30">
                  React
                </span>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100/20 text-green-400 border border-green-800/30 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/30">
                  Node.js
                </span>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-100/20 text-purple-400 border border-purple-800/30 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/30">
                  GraphQL
                </span>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-slate-400">
                    Deployment Status
                  </span>
                  {/* Updated status pill to match the screenshot */}
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100/20 text-green-400 border border-green-800/30 font-medium dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/30">
                    Online
                  </span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-[#0B1120] rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "92%" }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 dark:text-slate-500 mt-1">
                  Server health: 92%
                </p>
              </div>

              <button className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors dark:bg-[#6366F1] dark:hover:bg-[#4F46E5]">
                View Project Details
              </button>
            </div>
          </div>

          {/* CPU Usage */}
          <div className="rounded-2xl bg-white border border-gray-200 shadow-lg overflow-hidden dark:bg-[#151B2B] dark:border-slate-800 p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <CpuIcon className="h-5 w-5 text-blue-500 mr-2 dark:text-[#8B9FFF]" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                  CPU Usage
                </h3>
              </div>
              <span className="text-xs text-gray-600 dark:text-slate-400">
                Live
              </span>
            </div>

            <div className="h-40 flex items-end space-x-1">
              {[35, 45, 30, 60, 75, 50, 40, 55, 65, 70, 60, 50].map(
                (value, index) => (
                  <div
                    key={index}
                    className="w-full bg-blue-500 rounded-t dark:bg-[#6366F1]"
                    style={{ height: `${value}%`, opacity: 0.7 + index * 0.02 }}
                  ></div>
                )
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <p className="text-lg text-gray-600 dark:text-slate-400">Avg</p>
                <p className="font-semibold text-gray-900 dark:text-slate-100">
                  42%
                </p>
              </div>
              <div className="text-center">
                <p className="text-lg text-gray-600 dark:text-slate-400">Max</p>
                <p className="font-semibold text-gray-900 dark:text-slate-100">
                  75%
                </p>
              </div>
              <div className="text-center">
                <p className="text-lg text-gray-600 dark:text-slate-400">
                  Cores
                </p>
                <p className="font-semibold text-gray-900 dark:text-slate-100">
                  8
                </p>
              </div>
            </div>
          </div>

          {/* Memory Usage */}
          <div className="rounded-2xl bg-white border border-gray-200 shadow-lg overflow-hidden dark:bg-[#151B2B] dark:border-slate-800 p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <HardDrive className="h-5 w-5 text-blue-400 mr-2 dark:text-[#60A5FA]" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                  Memory Usage
                </h3>
              </div>
              <span className="text-xs text-gray-600 dark:text-slate-400">
                Live
              </span>
            </div>

            <div className="flex justify-center items-center h-40">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="3"
                    className="dark:stroke-[#1E293B]"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#60A5FA"
                    strokeWidth="3"
                    strokeDasharray="68, 100"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                    68%
                  </span>
                  <span className="text-xs text-gray-600 dark:text-slate-400">
                    Used
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <p className="text-lg text-gray-600 dark:text-slate-400">Avg</p>
                <p className="font-semibold text-gray-900 dark:text-slate-100">
                  42%
                </p>
              </div>
              <div className="text-center">
                <p className="text-lg text-gray-600 dark:text-slate-400">Max</p>
                <p className="font-semibold text-gray-900 dark:text-slate-100">
                  75%
                </p>
              </div>
              <div className="text-center">
                <p className="text-lg text-gray-600 dark:text-slate-400">
                  Cores
                </p>
                <p className="font-semibold text-gray-900 dark:text-slate-100">
                  8
                </p>
              </div>
            </div>
          </div>

          {/* Database Metrics */}
          <div className="rounded-2xl bg-white border border-gray-200 shadow-lg overflow-hidden dark:bg-[#151B2B] dark:border-slate-800 p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Database className="h-5 w-5 text-purple-500 mr-2 dark:text-[#C084FC]" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                  Database Metrics
                </h3>
              </div>
              <span className="text-xs text-gray-600 dark:text-slate-400">
                Last 24h
              </span>
            </div>

            <div className="grid grid-cols-2 gap-8 h-40">
              <div className="flex flex-col justify-between">
                <div className="text-center">
                  <h4 className="text-sm text-gray-600 dark:text-slate-400">
                    Queries/sec
                  </h4>
                  <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                    1,243
                  </p>
                </div>
                <div className="h-16">
                  <BarChart3 className="h-full w-full text-purple-500 opacity-80 dark:text-[#C084FC]" />
                </div>
              </div>
              <div className="flex flex-col justify-between">
                <div className="text-center">
                  <h4 className="text-sm text-gray-600 dark:text-slate-400">
                    Avg Response
                  </h4>
                  <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                    42 ms
                  </p>
                </div>
                <div className="h-16">
                  <LineChart className="h-full w-full text-indigo-500 opacity-80 dark:text-[#818CF8]" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <p className="text-xs text-gray-600 dark:text-slate-400">
                  Connections
                </p>
                <p className="font-semibold text-gray-900 dark:text-slate-100">
                  128
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 dark:text-slate-400">
                  Cache Hit
                </p>
                <p className="font-semibold text-gray-900 dark:text-slate-100">
                  94%
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 dark:text-slate-400">
                  Size
                </p>
                <p className="font-semibold text-gray-900 dark:text-slate-100">
                  4.2 GB
                </p>
              </div>
            </div>
          </div>

          {/* Server Status */}
          <div className="rounded-2xl bg-white border border-gray-200 shadow-lg overflow-hidden dark:bg-[#151B2B] dark:border-slate-800 p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Server className="h-5 w-5 text-blue-500 mr-2 dark:text-[#8B9FFF]" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                  Server Status
                </h3>
              </div>
              <div className="flex items-center">
                {/* Updated to match the green dot in the screenshot */}
                <span className="flex h-2 w-2 relative mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs text-gray-600 dark:text-slate-400">
                  All systems operational
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Updated to match the server status indicators in the screenshot */}
              {[
                { name: "Web Server", status: "Online", load: "42%" },
                { name: "Database", status: "Online", load: "38%" },
              ].map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-blue-500 dark:text-[#8B9FFF]" />
                    {service.name}
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100/20 text-green-400 border border-green-800/30 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/30">
                      {service.status}
                    </span>
                    <div className="w-24">
                      <div className="w-full bg-gray-200 dark:bg-[#0B1120] rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full dark:bg-[#8B9FFF]"
                          style={{ width: service.load }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Network Traffic */}
          <div className="rounded-2xl bg-white border border-gray-200 shadow-lg overflow-hidden dark:bg-[#151B2B] dark:border-slate-800 p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Globe className="h-5 w-5 text-green-500 mr-2 dark:text-[#34D399]" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                  Network Traffic
                </h3>
              </div>
              <span className="text-xs text-gray-600 dark:text-slate-400">
                Last 24h
              </span>
            </div>

            <div className="relative h-40">
              <svg
                className="w-full h-full"
                viewBox="0 0 300 100"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,90 C20,80 40,70 60,65 C80,60 100,55 120,60 C140,65 160,75 180,70 C200,65 220,50 240,45 C260,40 280,35 300,30"
                  fill="none"
                  stroke="#34D399"
                  strokeWidth="2"
                />
                <path
                  d="M0,70 C20,65 40,60 60,55 C80,50 100,45 120,50 C140,55 160,60 180,55 C200,50 220,40 240,35 C260,30 280,25 300,20"
                  fill="none"
                  stroke="#60A5FA"
                  strokeWidth="2"
                />
              </svg>

              <div className="absolute top-0 right-0 flex items-center space-x-4 text-xs">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-[#34D399] rounded-full mr-1"></span>
                  <span>In</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-[#60A5FA] rounded-full mr-1"></span>
                  <span>Out</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <p className="text-xs text-gray-600 dark:text-slate-400">
                  Incoming
                </p>
                <p className="font-semibold text-gray-900 dark:text-slate-100">
                  2.4 GB
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 dark:text-slate-400">
                  Outgoing
                </p>
                <p className="font-semibold text-gray-900 dark:text-slate-100">
                  1.8 GB
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 dark:text-slate-400">
                  Latency
                </p>
                <p className="font-semibold text-gray-900 dark:text-slate-100">
                  24 ms
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
