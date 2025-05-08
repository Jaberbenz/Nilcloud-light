"use client";

import { useState } from "react";

const AccountPage = () => {
  return (
    <div className="flex min-h-screen flex-col p-10 text-gray-900 dark:text-gray-100">
      <div className="mx-auto flex w-full max-w-4xl flex-col space-y-4">
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <h2 className="mb-2 text-xl font-semibold">Account</h2>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <h2 className="mb-2 text-xl font-semibold">SSH Keys</h2>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <h2 className="mb-2 text-xl font-semibold">Billing</h2>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <h2 className="mb-2 text-xl font-semibold">Environment</h2>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <h2 className="mb-2 text-xl font-semibold">Automatisation</h2>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
