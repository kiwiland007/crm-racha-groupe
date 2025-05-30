import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useThemePreference } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  variant?: 'button' | 'dropdown';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'dropdown',
  size = 'md',
  showLabel = false,
  className
}) => {
  const {
    theme,
    actualTheme,
    setLightTheme,
    setDarkTheme,
    setSystemTheme,
    toggleTheme
  } = useThemePreference();

  const getIcon = () => {
    if (theme === 'system') {
      return <Monitor className="h-4 w-4" />;
    }
    return actualTheme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />;
  };

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Clair';
      case 'dark':
        return 'Sombre';
      case 'system':
        return 'Système';
      default:
        return 'Thème';
    }
  };

  const buttonSizes = {
    sm: 'h-8 w-8',
    md: 'h-9 w-9',
    lg: 'h-10 w-10'
  };

  if (variant === 'button') {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className={cn(buttonSizes[size], className)}
        aria-label={`Changer le thème (actuellement ${getLabel().toLowerCase()})`}
      >
        {getIcon()}
        {showLabel && <span className="ml-2">{getLabel()}</span>}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(buttonSizes[size], className)}
          aria-label="Sélectionner le thème"
        >
          {getIcon()}
          {showLabel && <span className="ml-2">{getLabel()}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={setLightTheme}
          className={cn(
            'flex items-center gap-2 cursor-pointer',
            theme === 'light' && 'bg-accent'
          )}
        >
          <Sun className="h-4 w-4" />
          <span>Clair</span>
          {theme === 'light' && (
            <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={setDarkTheme}
          className={cn(
            'flex items-center gap-2 cursor-pointer',
            theme === 'dark' && 'bg-accent'
          )}
        >
          <Moon className="h-4 w-4" />
          <span>Sombre</span>
          {theme === 'dark' && (
            <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={setSystemTheme}
          className={cn(
            'flex items-center gap-2 cursor-pointer',
            theme === 'system' && 'bg-accent'
          )}
        >
          <Monitor className="h-4 w-4" />
          <span>Système</span>
          {theme === 'system' && (
            <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Composant simple pour basculer entre clair/sombre
export const SimpleThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
  const { actualTheme, setLightTheme, setDarkTheme } = useThemePreference();

  const toggleTheme = () => {
    if (actualTheme === 'light') {
      setDarkTheme();
    } else {
      setLightTheme();
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn('h-9 w-9', className)}
      aria-label={`Basculer vers le thème ${actualTheme === 'light' ? 'sombre' : 'clair'}`}
    >
      {actualTheme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
};

// Hook pour les animations de transition de thème
export const useThemeTransition = () => {
  const { actualTheme } = useThemePreference();

  React.useEffect(() => {
    const root = document.documentElement;
    
    // Ajouter une classe de transition temporaire
    root.classList.add('theme-transition');
    
    // Supprimer la classe après l'animation
    const timer = setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 300);

    return () => clearTimeout(timer);
  }, [actualTheme]);
};

export default ThemeToggle;
