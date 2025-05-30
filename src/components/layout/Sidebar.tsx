
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import {
  Users,
  Package,
  Calendar,
  Settings,
  BarChart3,
  MessageSquare,
  Menu,
  X,
  FileText,
  Wrench,
  Receipt,
  ShoppingBag,
  Cog,
  Truck
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

const NavItem = ({ to, icon, label, isActive, onClick }: NavItemProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
      isActive
        ? "bg-racha-teal text-white"
        : "hover:bg-muted"
    )}
    onClick={onClick}
  >
    {icon}
    {label}
  </Link>
);

export default function Sidebar() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const navItems = [
    {
      to: "/",
      icon: <BarChart3 size={18} />,
      label: "Tableau de bord"
    },
    {
      to: "/contacts",
      icon: <Users size={18} />,
      label: "Contacts"
    },
    {
      to: "/inventory",
      icon: <Package size={18} />,
      label: "Inventaire"
    },
    {
      to: "/products",
      icon: <ShoppingBag size={18} />,
      label: "Produits"
    },
    {
      to: "/services",
      icon: <Cog size={18} />,
      label: "Services"
    },
    {
      to: "/quotes",
      icon: <FileText size={18} />,
      label: "Devis"
    },
    {
      to: "/invoices",
      icon: <Receipt size={18} />,
      label: "Factures"
    },
    {
      to: "/bon-livraison",
      icon: <Truck size={18} />,
      label: "Bons de Livraison"
    },
    {
      to: "/events",
      icon: <Calendar size={18} />,
      label: "Évènements"
    },
    {
      to: "/technical-sheets",
      icon: <Wrench size={18} />,
      label: "Fiches Techniques"
    },
    {
      to: "/chat",
      icon: <MessageSquare size={18} />,
      label: "Messages"
    },
    {
      to: "/settings",
      icon: <Settings size={18} />,
      label: "Paramètres"
    }
  ];

  const renderLinks = () => (
    <div className="flex flex-col gap-1">
      {navItems.map((item) => (
        <NavItem
          key={item.to}
          to={item.to}
          icon={item.icon}
          label={item.label}
          isActive={location.pathname === item.to}
          onClick={isMobile ? toggleSidebar : undefined}
        />
      ))}
    </div>
  );

  if (isMobile) {
    return (
      <>
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-3 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          aria-label="Ouvrir le menu"
        >
          <Menu size={20} className="text-racha-teal" />
        </button>

        {isOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={toggleSidebar}>
            <div
              className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-50 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <img
                      src="/lovable-uploads/77a566ed-4d6b-4239-b742-d056f1b7ba66.png"
                      alt="Racha Digital"
                      className="h-10 w-auto"
                    />
                    <div>
                      <span className="font-bold text-xl text-racha-teal">CRM</span>
                      <p className="text-xs text-gray-500">Racha Business</p>
                    </div>
                  </div>
                  <button
                    onClick={toggleSidebar}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Fermer le menu"
                  >
                    <X size={20} className="text-gray-600" />
                  </button>
                </div>
                <div className="space-y-1">
                  {renderLinks()}
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="hidden md:flex flex-col w-64 border-r bg-white p-4 h-screen">
      <div className="flex items-center gap-2 mb-6">
        <img
          src="/lovable-uploads/77a566ed-4d6b-4239-b742-d056f1b7ba66.png"
          alt="Racha Digital"
          className="h-10"
        />
        <span className="font-semibold text-xl text-racha-teal">CRM</span>
      </div>
      {renderLinks()}
    </div>
  );
}
