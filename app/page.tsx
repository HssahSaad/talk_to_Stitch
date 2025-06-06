"use client";
import React from "react";
import Link from 'next/link';
import SimliAgent from "@/app/SimliAgent";
import SimliHeaderLogo from "./Components/Logo";

const Demo: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen flex flex-col">
      <header className="w-full py-4 px-6 bg-gradient-to-r from-indigo-50 to-white">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <SimliHeaderLogo />
          <Link href="/about" className="text-primary hover:text-primary/80 transition-colors">
            About
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full">
          <div className="flex flex-col items-center gap-6 bg-white p-6 pb-10 rounded-xl border border-gray-200 shadow-sm">
            <SimliAgent
              onStart={() => {}}
              onClose={() => {}}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Demo;
