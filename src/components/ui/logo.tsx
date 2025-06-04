import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'full' | 'compact' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  variant = 'compact',
  size = 'md',
  className,
  showText = true
}) => {
  const getSizeValues = () => {
    switch (size) {
      case 'sm':
        return { width: 120, height: 30 };
      case 'md':
        return { width: 160, height: 40 };
      case 'lg':
        return { width: 200, height: 50 };
      case 'xl':
        return { width: 240, height: 60 };
      default:
        return { width: 160, height: 40 };
    }
  };

  const { width, height } = getSizeValues();

  // Logo SVG basé sur votre design RACHA DIGITAL
  const renderLogo = () => {
    if (variant === 'icon') {
      return (
        <svg width={height} height={height} viewBox="0 0 40 40" className={cn('flex-shrink-0', className)}>
          {/* Forme principale - cercle avec nœuds */}
          <circle cx="20" cy="20" r="18" fill="#40E0D0" fillOpacity="0.1" stroke="#40E0D0" strokeWidth="1"/>

          {/* Nœuds connectés - design réseau */}
          <circle cx="20" cy="8" r="3" fill="#40E0D0"/>
          <circle cx="32" cy="20" r="3" fill="#40E0D0"/>
          <circle cx="20" cy="32" r="3" fill="#40E0D0"/>
          <circle cx="8" cy="20" r="3" fill="#40E0D0"/>
          <circle cx="20" cy="20" r="4" fill="#40E0D0"/>

          {/* Lignes de connexion */}
          <line x1="20" y1="8" x2="20" y2="16" stroke="#40E0D0" strokeWidth="2"/>
          <line x1="32" y1="20" x2="24" y2="20" stroke="#40E0D0" strokeWidth="2"/>
          <line x1="20" y1="32" x2="20" y2="24" stroke="#40E0D0" strokeWidth="2"/>
          <line x1="8" y1="20" x2="16" y2="20" stroke="#40E0D0" strokeWidth="2"/>
        </svg>
      );
    }

    if (variant === 'full') {
      return (
        <svg width={width} height={height} viewBox="0 0 300 60" className={cn('flex-shrink-0', className)}>
          {/* Icône réseau */}
          <circle cx="30" cy="30" r="25" fill="#40E0D0" fillOpacity="0.1" stroke="#40E0D0" strokeWidth="1"/>
          <circle cx="30" cy="12" r="4" fill="#40E0D0"/>
          <circle cx="48" cy="30" r="4" fill="#40E0D0"/>
          <circle cx="30" cy="48" r="4" fill="#40E0D0"/>
          <circle cx="12" cy="30" r="4" fill="#40E0D0"/>
          <circle cx="30" cy="30" r="5" fill="#40E0D0"/>

          {/* Connexions */}
          <line x1="30" y1="12" x2="30" y2="25" stroke="#40E0D0" strokeWidth="2"/>
          <line x1="48" y1="30" x2="35" y2="30" stroke="#40E0D0" strokeWidth="2"/>
          <line x1="30" y1="48" x2="30" y2="35" stroke="#40E0D0" strokeWidth="2"/>
          <line x1="12" y1="30" x2="25" y2="30" stroke="#40E0D0" strokeWidth="2"/>

          {/* Séparateur */}
          <line x1="70" y1="15" x2="70" y2="45" stroke="#E5E7EB" strokeWidth="1"/>

          {/* Texte RACHA DIGITAL */}
          <text x="85" y="35" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="#40E0D0" letterSpacing="2px">
            RACHA DIGITAL
          </text>
        </svg>
      );
    }

    // Variant compact pour header
    return (
      <svg width={width} height={height} viewBox="0 0 200 40" className={cn('flex-shrink-0', className)}>
        {/* Icône réseau compacte */}
        <circle cx="20" cy="20" r="16" fill="#40E0D0" fillOpacity="0.1" stroke="#40E0D0" strokeWidth="1"/>
        <circle cx="20" cy="8" r="2.5" fill="#40E0D0"/>
        <circle cx="32" cy="20" r="2.5" fill="#40E0D0"/>
        <circle cx="20" cy="32" r="2.5" fill="#40E0D0"/>
        <circle cx="8" cy="20" r="2.5" fill="#40E0D0"/>
        <circle cx="20" cy="20" r="3" fill="#40E0D0"/>

        {/* Connexions */}
        <line x1="20" y1="8" x2="20" y2="17" stroke="#40E0D0" strokeWidth="1.5"/>
        <line x1="32" y1="20" x2="23" y2="20" stroke="#40E0D0" strokeWidth="1.5"/>
        <line x1="20" y1="32" x2="20" y2="23" stroke="#40E0D0" strokeWidth="1.5"/>
        <line x1="8" y1="20" x2="17" y2="20" stroke="#40E0D0" strokeWidth="1.5"/>

        {/* Séparateur */}
        <line x1="45" y1="8" x2="45" y2="32" stroke="#E5E7EB" strokeWidth="1"/>

        {/* Texte RACHA DIGITAL */}
        <text x="55" y="25" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold" fill="#40E0D0" letterSpacing="1px">
          RACHA DIGITAL
        </text>
      </svg>
    );
  };

  return (
    <div className={cn('flex items-center', className)}>
      {renderLogo()}
    </div>
  );
};

export default Logo;
