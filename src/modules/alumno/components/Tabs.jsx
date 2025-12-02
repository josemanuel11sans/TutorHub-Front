"use client";

import { useState, cloneElement, Children } from "react";

export function Tabs({ children, defaultValue, className = "" }) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div className={className}>
      {Children.map(children, (child) => {
        if (!child) return null;

        if (child.type === TabsList || child.type === TabsContent) {
          return cloneElement(child, { activeTab, setActiveTab });
        }
        return child;
      })}
    </div>
  );
}

export function TabsList({ children, activeTab, setActiveTab }) {
  return (
    <div className="inline-flex bg-gray-100 rounded-lg p-1 space-x-1">
      {Children.map(children, (child) => {
        if (!child) return null;
        return cloneElement(child, { activeTab, setActiveTab });
      })}
    </div>
  );
}

export function TabsTrigger({ children, value, activeTab, setActiveTab }) {
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        isActive
          ? "bg-white text-gray-900 shadow-sm"
          : "text-gray-600 hover:text-gray-900"
      }`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ children, value, activeTab, className = "" }) {
  if (value !== activeTab) return null;

  return <div className={className}>{children}</div>;
}
