"use client";

import { useAuth } from "../hooks/useAuth";
import { UserMenu } from "./UserMenu";

export function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="bg-transparent border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-full">
        <div className="flex items-center space-x-4 min-w-0 flex-shrink">
          <div className="bg-blue-600 text-white rounded-lg p-2 font-bold text-sm flex-shrink-0">
            TH
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-semibold text-gray-900 truncate">
              TutorHub
            </h1>
            <p className="text-xs text-gray-500">Estudiante</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 flex-shrink-0">
          <UserMenu user={user} />
        </div>
      </div>
    </nav>
  );
}
