"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import {
  Boxes,
  ChevronDown,
  ChevronUp,
  Folder,
  HelpCircle,
  Home,
  LockIcon,
  LucideIcon,
  Search,
  Settings,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "@/assets/Nilcloud.png";

type Props = {};

const Sidebar = () => {
  const [showProjects, setShowProjects] = useState(true);

  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  const sidebarClassNames = `fixed flex flex-col h-full justify-between shadow-2xl transition-all duration-300 z-40 bg-light-sidebar dark:bg-dark-sidebar text-light-text dark:text-dark-text ${
    isSidebarCollapsed ? "w-0 hidden" : "w-64"
  }`;

  return (
    <div className={sidebarClassNames}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-light-border dark:border-dark-border">
        <div className="text-2xl font-bold tracking-wide text-light-text dark:text-dark-text">
          Nilcloud
        </div>
        {!isSidebarCollapsed && (
          <button
            className="text-light-text hover:text-light-highlight dark:text-dark-text dark:hover:text-dark-highlight"
            onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Dashboard Info */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-light-border dark:border-dark-border">
        <Image src={Logo} alt="Logo" width={40} height={40} />
        <div>
          <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
            Dashboard
          </h3>
          <div className="flex items-center gap-1 text-sm text-light-secondary-text dark:text-dark-secondary-text">
            <LockIcon className="h-4 w-4" />
            <span>Private</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <SidebarLink icon={Home} href="/dashboard" label="Home" />
        <SidebarLink
          icon={Folder}
          href="/dashboard/projects"
          label="Projects"
          subLinks={[
            { href: "/dashboard/projects/deployement", label: "Deployment" },
            { href: "/dashboard/projects/development", label: "Development" },
            { href: "/dashboard/projects/design", label: "Design" },
            { href: "/dashboard/projects/supervision", label: "Supervision" },
          ]}
        />
        <SidebarLink icon={Search} href="/dashboard/search" label="Search" />
        <SidebarLink icon={User} href="/dashboard/profile" label="Profile" />
        <SidebarLink
          icon={Boxes}
          href="/dashboard/production"
          label="Collection"
          parentPaths={[
            "/dashboard/production",
            "/dashboard/recette",
            "/dashboard/preproduction",
          ]}
        />
        <SidebarLink
          icon={HelpCircle}
          href="/dashboard/support"
          label="Support"
        />
        <SidebarLink
          icon={Settings}
          href="/dashboard/account"
          label="Settings"
          parentPaths={[
            "/dashboard/account",
            "/dashboard/sshKeys",
            "/dashboard/billing",
            "/dashboard/environment",
            "/dashboard/automation",
          ]}
        />
      </nav>

      {/* Toggle Projects */}
      <button
        onClick={() => setShowProjects((prev) => !prev)}
        className="flex items-center justify-between w-full px-6 py-3 text-light-secondary-text hover:text-light-highlight dark:text-dark-secondary-text dark:hover:text-dark-highlight bg-light-bg dark:bg-dark-bg border-t border-light-border dark:border-dark-border"
      >
        <span>Projects</span>
        {showProjects ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </button>
    </div>
  );
};

interface SidebarLinkProps {
  icon: LucideIcon;
  href: string;
  label: string;
  parentPaths?: string[]; // Ajoutez cette propriété pour gérer les chemins associés
}

const SidebarLink = ({
  icon: Icon,
  href,
  label,
  parentPaths,
}: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href ||
    (parentPaths && parentPaths.some((path) => pathname.includes(path)));

  return (
    <Link href={href}>
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
          isActive
            ? "bg-light-highlight text-light-text dark:bg-dark-highlight dark:text-dark-text"
            : "text-light-secondary-text hover:bg-light-card hover:text-light-text dark:text-dark-secondary-text dark:hover:bg-dark-card dark:hover:text-dark-text"
        }`}
      >
        <Icon className="h-5 w-5" />
        <span className="font-medium">{label}</span>
      </div>
    </Link>
  );
};

export default Sidebar;
