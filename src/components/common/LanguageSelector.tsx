import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

const languages: Language[] = [
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    dir: 'ltr',
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇲🇦',
    dir: 'rtl',
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    dir: 'ltr',
  },
];

interface LanguageSelectorProps {
  variant?: 'button' | 'dropdown';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'dropdown',
  size = 'md',
  showLabel = false,
  className
}) => {
  const { i18n } = useTranslation();
  
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (languageCode: string) => {
    const language = languages.find(lang => lang.code === languageCode);
    if (language) {
      i18n.changeLanguage(languageCode);
      
      // Mettre à jour la direction du document
      document.documentElement.dir = language.dir;
      document.documentElement.lang = languageCode;
      
      // Mettre à jour les classes CSS pour RTL
      if (language.dir === 'rtl') {
        document.documentElement.classList.add('rtl');
      } else {
        document.documentElement.classList.remove('rtl');
      }
    }
  };

  const buttonSizes = {
    sm: 'h-8 px-2',
    md: 'h-9 px-3',
    lg: 'h-10 px-4'
  };

  if (variant === 'button') {
    const nextLanguage = languages[(languages.indexOf(currentLanguage) + 1) % languages.length];
    
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => changeLanguage(nextLanguage.code)}
        className={cn(buttonSizes[size], className)}
        aria-label={`Changer la langue vers ${nextLanguage.nativeName}`}
      >
        <Globe className="h-4 w-4 mr-1" />
        {currentLanguage.flag}
        {showLabel && <span className="ml-2">{currentLanguage.nativeName}</span>}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(buttonSizes[size], className)}
          aria-label="Sélectionner la langue"
        >
          <Globe className="h-4 w-4 mr-1" />
          {currentLanguage.flag}
          {showLabel && <span className="ml-2">{currentLanguage.nativeName}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[200px]">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={cn(
              'flex items-center gap-3 cursor-pointer',
              i18n.language === language.code && 'bg-accent'
            )}
          >
            <span className="text-lg">{language.flag}</span>
            <div className="flex-1">
              <div className="font-medium">{language.nativeName}</div>
              <div className="text-xs text-muted-foreground">{language.name}</div>
            </div>
            {i18n.language === language.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Hook pour obtenir les informations de la langue actuelle
export const useCurrentLanguage = () => {
  const { i18n } = useTranslation();
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];
  
  return {
    language: currentLanguage,
    isRTL: currentLanguage.dir === 'rtl',
    changeLanguage: (code: string) => {
      const language = languages.find(lang => lang.code === code);
      if (language) {
        i18n.changeLanguage(code);
        document.documentElement.dir = language.dir;
        document.documentElement.lang = code;
        
        if (language.dir === 'rtl') {
          document.documentElement.classList.add('rtl');
        } else {
          document.documentElement.classList.remove('rtl');
        }
      }
    },
  };
};

// Composant simple pour basculer entre les langues
export const SimpleLanguageToggle: React.FC<{ className?: string }> = ({ className }) => {
  const { i18n } = useTranslation();
  const currentIndex = languages.findIndex(lang => lang.code === i18n.language);
  const nextLanguage = languages[(currentIndex + 1) % languages.length];

  const toggleLanguage = () => {
    i18n.changeLanguage(nextLanguage.code);
    document.documentElement.dir = nextLanguage.dir;
    document.documentElement.lang = nextLanguage.code;
    
    if (nextLanguage.dir === 'rtl') {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      className={cn('h-9 w-9', className)}
      aria-label={`Basculer vers ${nextLanguage.nativeName}`}
    >
      <Globe className="h-4 w-4" />
    </Button>
  );
};

export default LanguageSelector;
