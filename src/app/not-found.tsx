"use client";

import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text">
      {/* Conteneur principal */}
      <div className="flex flex-col items-center justify-center p-6 text-center">
        {/* Code 404 */}
        <h1 className="text-9xl font-extrabold text-light-primary dark:text-dark-primary">
          404
        </h1>
        {/* Titre */}
        <h2 className="mt-4 text-4xl font-bold text-light-text dark:text-dark-text">
          Oops! Page Not Found
        </h2>
        {/* Sous-titre */}
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        {/* Bouton de retour */}
        <Link href="/dashboard">
          <button className="mt-6 rounded-lg bg-light-primary px-6 py-3 text-white shadow-lg transition-all hover:bg-light-highlight dark:bg-dark-primary dark:hover:bg-dark-highlight">
            Go Home
          </button>
        </Link>
      </div>

      {/* Illustration */}
      <div className="mt-10">
        <svg
          className="w-64 h-64 fill-light-secondary dark:fill-dark-secondary"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3 11h3v2H3v4H1V9h6v8H5v-4H3v-2zm8-2H9V9h6v2h-2v8h-2v-8zm8 0h-2V9h6v2h-2v8h-2v-8zm-8 0h-2V9h6v2h-2v8h-2v-8zm8 0h-2V9h6v2h-2v8h-2v-8z" />
        </svg>
      </div>
    </div>
  );
};

export default NotFoundPage;
