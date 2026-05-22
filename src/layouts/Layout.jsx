import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Outlet, useLocation } from "react-router-dom";

const getInitialSidebarState = () =>
  typeof window !== "undefined" ? window.innerWidth >= 1024 : true;

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(getInitialSidebarState);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location]);

  return (
    <div className="h-screen flex flex-col bg-[#f6f8fb] w-full overflow-hidden">
      <Header
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex flex-1 overflow-hidden relative w-full">
        {sidebarOpen && (
          <div 
            className="absolute inset-0 bg-slate-950/40 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <div className={`absolute z-50 h-full flex flex-col transition-transform duration-300 md:relative ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}>
          <Sidebar sidebarOpen={sidebarOpen} />
        </div>

        <main className="flex-1 overflow-y-auto w-full px-3 py-4 sm:px-5 lg:px-6 lg:py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
