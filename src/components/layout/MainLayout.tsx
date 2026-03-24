import { AlignJustify, AlignLeft, Bell, Building, Menu, Search } from "lucide-react";
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { Sidebar } from "./Sidebar";
import { CustomDropdown } from "../ui/CustomDropdown";
import { usePusherBeams } from "../../hooks/usePusherBeams";

interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { user, selectedBusinessUnitId, setSelectedBusinessUnitId } = useAuthStore();
  const location = useLocation();

  // Initialize Pusher Beams
  usePusherBeams({
    userId: user?.id ?? null,
    enabled: !!user
  });

  const businessUnitOptions = user?.business_units?.map(bu => ({
    label: bu.legal_name,
    value: bu.id
  })) || [];


  const getPageTitle = (pathname: string) => {
    if (pathname.startsWith("/suppliers")) return "Suppliers";
    if (pathname.startsWith("/requests")) return "Requests";
    if (pathname.startsWith("/admins")) return "Admins";
    if (pathname.startsWith("/categories")) return "Categories";
    if (pathname.startsWith("/products")) return "Products";
    return "Dashboard";
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
      />

      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">

        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:flex p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isSidebarCollapsed ? <AlignJustify className="w-5 h-5" /> : <AlignLeft className="w-5 h-5" />}
            </button>
            <h1 className="text-xl font-black text-gray-900 hidden sm:block tracking-tight">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-4">

            <div className="hidden md:flex items-center bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 w-64 focus-within:border-primary-500 transition-colors">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm text-gray-700 w-full placeholder-gray-400"
                aria-label="Search"
              />
            </div>


            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative group">
              <Bell className="w-5 h-5 transition-all" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full border-2 border-white"></span>
            </button>


            {businessUnitOptions.length > 0 && (
              <div className="hidden sm:block w-48">
                <CustomDropdown
                  options={businessUnitOptions}
                  value={selectedBusinessUnitId || ""}
                  onChange={(id) => {
                    setSelectedBusinessUnitId(id);
                    window.location.reload();
                  }}
                  icon={Building}
                  labelPrefix=""
                  className="w-full"
                />
              </div>
            )}
 

            {/* <Button
              size="sm"
              className="bg-sky-500 hover:bg-sky-600 text-white font-semibold hidden sm:flex items-center gap-2"
            >
              <Crown className="w-4 h-4 fill-current" />
              Upgrade
            </Button> */}


            <div className="relative group">
              <button className="flex items-center gap-3 h-10 px-1.5 lg:px-3 rounded-xl bg-primary-500 text-black border border-primary-400 shadow-sm cursor-pointer hover:bg-primary-600 transition-all hover:scale-105">
                <div className="w-8 h-8 rounded-lg bg-black/10 flex items-center justify-center font-black text-sm">
                    {user?.name?.substring(0, 2).toUpperCase() || "AZ"}
                </div>
                <div className="hidden lg:flex flex-col items-start leading-none mr-2">
                    <span className="text-xs font-black tracking-tight">{user?.name}</span>
                    {user?.business_units?.[0] && (
                        <span className="text-[10px] font-bold text-black/60 truncate max-w-[100px]">
                            {user.business_units[0].legal_name}
                        </span>
                    )}
                </div>
              </button>

              <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl py-1 z-50 hidden group-hover:block border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-5 py-4 border-b border-gray-100">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-primary-800 font-bold truncate mt-1">
                    {user?.email}
                  </p>
                  {user?.business_units?.[0] && (
                    <div className="mt-2 pt-2 border-t border-gray-50">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                            Business Unit
                        </p>
                        <p className="text-xs font-bold text-gray-700 truncate">
                            {user.business_units[0].legal_name}
                        </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};
