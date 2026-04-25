"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BrowseContent from "@/components/BrowseContent";

export default function BrowsePage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />
      <main className="flex-grow pt-32 pb-20 px-6 sm:px-10">
        <BrowseContent />
      </main>
      <Footer />
    </div>
  );
}
