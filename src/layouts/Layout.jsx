import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const location = useLocation();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location]);

  return (
    <div className="h-screen flex flex-col bg-slate-50 w-full overflow-hidden">
      <Header
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex flex-1 overflow-hidden relative w-full">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="absolute inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar Wrapper */}
        <div className={`absolute z-50 h-full flex flex-col transition-transform duration-300 md:relative ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}>
          <Sidebar sidebarOpen={sidebarOpen} />
        </div>

        <main className="flex-1 p-4 md:p-5 overflow-y-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
