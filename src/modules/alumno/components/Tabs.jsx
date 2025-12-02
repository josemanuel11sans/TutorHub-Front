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

export function TabsList({
  children,
  activeTab,
  setActiveTab,
  className = "",
}) {
  return (
    <div className={className || "border-b border-gray-200"}>
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
      className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
        isActive
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
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
