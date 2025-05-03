
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
  X 
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
      to: "/events", 
      icon: <Calendar size={18} />, 
      label: "Évènements" 
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
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
        >
          <Menu size={20} />
        </button>

        {isOpen && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40">
            <div className="fixed inset-y-0 left-0 w-64 bg-white p-4 shadow-lg z-50">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <img 
                    src="/lovable-uploads/77a566ed-4d6b-4239-b742-d056f1b7ba66.png" 
                    alt="Racha Digital" 
                    className="h-8" 
                  />
                  <span className="font-semibold text-lg text-racha-teal">CRM</span>
                </div>
                <button onClick={toggleSidebar}>
                  <X size={20} />
                </button>
              </div>
              {renderLinks()}
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
