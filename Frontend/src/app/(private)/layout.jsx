"use client";

import { useEffect } from "react";
import PatientService from "@/services/PatientService";
import Sidebar from "@/components/Sidebar";

export default function PrivateLayout({ children }) {
  useEffect(() => {
    PatientService.init();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
