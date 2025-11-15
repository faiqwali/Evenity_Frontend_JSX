// src/components/Topbar.jsx
import React from "react";
import { Bell, Menu } from "lucide-react";

export default function Topbar({ onToggleSidebar }) {
  return (
    <header className="flex justify-between items-center px-6 py-3 bg-white border-b shadow-sm">
      <div className="flex items-center gap-3">
        {/* mobile toggle */}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-100"
          onClick={onToggleSidebar}
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>

        <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
      </div>
{/* 
      <div className="hidden md:flex flex-1 justify-center">
        <input
          type="text"
          placeholder="Search anything"
          className="border border-gray-300 rounded-lg px-4 py-2 w-1/2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-600"
        />
      </div> */}

      <div className="flex items-center gap-5">
        <button className="relative text-gray-600 hover:text-sky-700">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* user */}
        <div className="flex items-center gap-2">
          <div className="bg-sky-700 text-white rounded-full w-9 h-9 flex items-center justify-center font-medium">MW</div>
          <div className="hidden md:flex items-center gap-1 text-gray-800">
            <span className="text-sm font-semibold">Alanaoud</span>
            <span className="text-xs text-gray-500">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
