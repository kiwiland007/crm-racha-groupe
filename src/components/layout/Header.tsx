
import React from "react";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { UserProfile } from "./UserProfile";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Header({ title }: { title: string }) {
  const navigate = useNavigate();



  const handleNotificationClick = (type: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log("Notification clicked:", type);

    switch (type) {
      case 'prospect':
        navigate('/contacts');
        toast.success("Redirection vers les contacts");
        break;
      case 'event':
        navigate('/events');
        toast.success("Redirection vers les événements");
        break;
      case 'stock':
        navigate('/inventory');
        toast.success("Redirection vers l'inventaire");
        break;
      default:
        break;
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4">
      <div className="flex items-center gap-2 md:gap-4">
        {/* Logo Racha Digital */}
        <div className="flex items-center">
          <Logo variant="compact" size="md" />
        </div>
        <div className="h-6 w-px bg-gray-300 md:h-8" />
        <h1 className="text-lg font-semibold text-gray-800 md:text-xl">{title}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-auto">
              <DropdownMenuItem className="cursor-pointer" onClick={(e) => handleNotificationClick('prospect', e)}>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">Nouveau prospect</p>
                  <p className="text-xs text-gray-500">John Doe a été ajouté via Facebook Ads</p>
                  <p className="text-xs text-gray-400">Il y a 10 minutes</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={(e) => handleNotificationClick('event', e)}>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">Évènement demain</p>
                  <p className="text-xs text-gray-500">Salon Digital Tech à Casablanca</p>
                  <p className="text-xs text-gray-400">Il y a 1 heure</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={(e) => handleNotificationClick('stock', e)}>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">Stock faible</p>
                  <p className="text-xs text-gray-500">Écran tactile 32" - 2 articles restants</p>
                  <p className="text-xs text-gray-400">Il y a 3 heures</p>
                </div>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-center text-sm text-racha-blue"
              onClick={() => {
                navigate('/notifications');
                toast.success("Redirection vers les notifications");
              }}
            >
              Voir toutes les notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile */}
        <UserProfile />
      </div>
    </header>
  );
}
