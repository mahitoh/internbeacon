"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ListingsContent from "@/components/ListingsContent";

export default function ListingsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />
      <main className="flex-grow pt-32 pb-20">
        <ListingsContent />
      </main>
      <Footer />
    </div>
  );
}
