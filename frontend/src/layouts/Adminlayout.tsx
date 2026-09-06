import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserName, getUserEmail, clearSession } from "../api/auth/AuthService";
import logo from '../assets/images/logo/lmoch.png'

import {
  LayoutDashboard,
  Package,
  Building2,
  PawPrint,
  ClipboardList,
  Search,
  PartyPopper,
  Bell,
  LogOut,
  ChevronRight,
  icons,
} from "lucide-react";
import { label } from "framer-motion/client";

interface UserData {
  name: string;
  email: string;
  avatar?: string;
}

const SIDEBAR_BG = "#1E3A6E";

const menuItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Produits", icon: Package },
  { to: "/admin/orders", label: "Commandes", icon: ClipboardList },
  // { to: "/admin/clients", label: "Clients", icon: Building2 },
  { to: "/admin/events", label: "Célébrations", icon: PartyPopper },
  {to:"/admin/cats",label:"chats",icon:PawPrint}
  
];



export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const name = getUserName();
    const email = getUserEmail();
    if (name || email) {
      setUser({ name: name || "", email: email || "", avatar: undefined });
    }
  }, []);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  const handleLogout = () => {
    clearSession();
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
      isActive
        ? "bg-white/10 text-white"
        : "text-slate-300 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <div className="flex h-screen bg-[var(--color-primary)]/5 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside
        style={{ backgroundColor: SIDEBAR_BG }}
        className={`
          relative flex flex-col shadow-sm
          transition-all duration-300 ease-in-out z-20 rounded-tr-2xl rounded-br-2xl
          ${sidebarOpen ? "w-60" : "w-18"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-start gap-3 px-4 py-5 border-b border-white/10">
          <div className={`flex-shrink-0 w-20 h-20 rounded-lg flex items-center justify-start ${!sidebarOpen ? "ml-[-25px]" : ""}`}>
            <img className="w-full" src={logo} alt="lmoch.com" />
            {sidebarOpen && (
              <div className="logo-text text-[#FF7A45]">
                        <span className='text-white'>Lm</span>
                        och<span className='text-white'>.com</span>
                    </div>
            )}
            
          </div>
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-5 -right-3 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors z-30"
        >
          <ChevronRight
            className={`w-3 h-3 transition-transform ${sidebarOpen ? "rotate-180" : ""}`}
            style={{ color: SIDEBAR_BG }}
          />
        </button>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          {sidebarOpen && (
            <p className="px-3 mb-2 text-[11px] font-semibold text-white/40 uppercase tracking-wider">
              Menu
            </p>
          )}
          <div className="space-y-1">
            {menuItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={navLinkClass}>
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-5 h-5 flex-shrink-0 ${
                        isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                      }`}
                    />
                    {sidebarOpen && <span className="truncate">{label}</span>}
                    {isActive && sidebarOpen && (
                      <span className="ml-auto w-1.5 h-1.5 bg-orange-500 rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {sidebarOpen && (
            <p className="px-3 mt-6 mb-2 text-[11px] font-semibold text-white/40 uppercase tracking-wider">
              
            </p>
          )}
          {!sidebarOpen && <div className="my-4 border-t border-white/10" />}
          
        </nav>

        {/* Logout */}
        <div className="px-2 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 pt-6">
          <header className="bg-white border border-blue-600/10 rounded-2xl px-8 py-6 flex items-center justify-between shadow-sm gap-4">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search task"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-11 pr-14 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                  ⌘F
                </kbd>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 hover:bg-[var(--color-primary)]/5 text-gray-500 transition-colors">
                <Bell className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 pl-2">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-[var(--color-primary)]/10"
                  />
                ) : (
                  <div
                     style={{ backgroundColor: SIDEBAR_BG }}
                    className="w-10 h-10  rounded-full flex items-center justify-center">
                    <span className="text-orange-600  font-semibold text-sm">{initials}</span>
                  </div>
                )}
                <div className="hidden sm:block leading-tight">
                  <p className="text-sm font-semibold text-gray-800">{user?.name || "Admin"}</p>
                  <p className="text-xs text-gray-400">{user?.email || ""}</p>
                </div>
              </div>
            </div>
          </header>
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
        
      </div>
    </div>
  );
}