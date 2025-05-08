import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state";
import { MenuIcon, MoonIcon, Search, Settings, SunIcon } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  return (
    <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 shadow-md dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900">
      {/* Left Section: Sidebar toggle & Searchbar */}
      <div className="flex items-center gap-6">
        {/* Sidebar Toggle */}
        {!isSidebarCollapsed ? null : (
          <button
            onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
            className="rounded p-2 transition hover:bg-purple-200 dark:hover:bg-gray-700"
          >
            <MenuIcon className="h-6 w-6 text-purple-700 dark:text-gray-100" />
          </button>
        )}

        {/* Search Bar */}
        <div className="relative w-[250px]">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full rounded-full bg-white py-2 pl-10 pr-4 text-sm text-gray-700 shadow-md placeholder-gray-500 focus:ring-2 focus:ring-purple-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-gray-600"
          />
        </div>
      </div>

      {/* Right Section: Dark Mode Toggle & Settings */}
      <div className="flex items-center gap-6">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
          className="rounded-full p-2 transition hover:bg-purple-200 dark:hover:bg-gray-700"
        >
          {isDarkMode ? (
            <MoonIcon className="h-6 w-6 text-purple-700 dark:text-gray-100" />
          ) : (
            <SunIcon className="h-6 w-6 text-purple-700 dark:text-gray-100" />
          )}
        </button>

        {/* Settings Link */}
        <Link
          href="/account"
          className="rounded-full p-2 transition hover:bg-purple-200 dark:hover:bg-gray-700"
        >
          <Settings className="h-6 w-6 text-purple-700 dark:text-gray-100" />
        </Link>

        {/* Divider (for larger screens) */}
        <div className="hidden h-6 w-[1px] bg-gray-300 dark:bg-gray-600 md:block"></div>
      </div>
    </div>
  );
};

export default Navbar;
