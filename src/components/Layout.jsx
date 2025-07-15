import React from "react";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-pink-800 to-red-700 text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 pt-24 pb-8">
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-4">
          {children}
        </div>
      </main>
    </div>
  );
}
