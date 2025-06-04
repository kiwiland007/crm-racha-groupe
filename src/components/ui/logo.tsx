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

  // Logo SVG intégré pour éviter les problèmes de chargement
  const renderLogo = () => {
    if (variant === 'icon') {
      return (
        <svg width={height} height={height} viewBox="0 0 32 32" className={cn('flex-shrink-0', className)}>
          {/* Cercle principal */}
          <circle cx="16" cy="16" r="12" fill="#40E0D0" opacity="0.8"/>

          {/* Nœuds connectés */}
          <circle cx="10" cy="10" r="2" fill="#40E0D0"/>
          <circle cx="22" cy="10" r="2" fill="#40E0D0"/>
          <circle cx="10" cy="22" r="2" fill="#40E0D0"/>
          <circle cx="22" cy="22" r="2" fill="#40E0D0"/>
          <circle cx="16" cy="16" r="2" fill="#FFFFFF"/>

          {/* Lignes de connexion */}
          <line x1="10" y1="10" x2="16" y2="16" stroke="#40E0D0" strokeWidth="1.5"/>
          <line x1="22" y1="10" x2="16" y2="16" stroke="#40E0D0" strokeWidth="1.5"/>
          <line x1="10" y1="22" x2="16" y2="16" stroke="#40E0D0" strokeWidth="1.5"/>
          <line x1="22" y1="22" x2="16" y2="16" stroke="#40E0D0" strokeWidth="1.5"/>
        </svg>
      );
    }

    if (variant === 'full') {
      return (
        <svg width={width} height={height} viewBox="0 0 240 60" className={cn('flex-shrink-0', className)}>
          {/* Cercle principal */}
          <circle cx="30" cy="30" r="20" fill="#40E0D0" opacity="0.8"/>

          {/* Nœuds connectés */}
          <circle cx="20" cy="20" r="3" fill="#40E0D0"/>
          <circle cx="40" cy="20" r="3" fill="#40E0D0"/>
          <circle cx="20" cy="40" r="3" fill="#40E0D0"/>
          <circle cx="40" cy="40" r="3" fill="#40E0D0"/>
          <circle cx="30" cy="30" r="3" fill="#FFFFFF"/>

          {/* Lignes de connexion */}
          <line x1="20" y1="20" x2="30" y2="30" stroke="#40E0D0" strokeWidth="2"/>
          <line x1="40" y1="20" x2="30" y2="30" stroke="#40E0D0" strokeWidth="2"/>
          <line x1="20" y1="40" x2="30" y2="30" stroke="#40E0D0" strokeWidth="2"/>
          <line x1="40" y1="40" x2="30" y2="30" stroke="#40E0D0" strokeWidth="2"/>

          {/* Texte RACHA DIGITAL */}
          <text x="70" y="25" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="bold" fill="#40E0D0">
            RACHA
          </text>
          <text x="70" y="42" fontFamily="Arial, sans-serif" fontSize="14" fill="#666666">
            DIGITAL
          </text>
        </svg>
      );
    }

    // Variant compact
    return (
      <svg width={width} height={height} viewBox="0 0 160 40" className={cn('flex-shrink-0', className)}>
        {/* Cercle principal */}
        <circle cx="20" cy="20" r="15" fill="#40E0D0" opacity="0.8"/>

        {/* Nœuds connectés */}
        <circle cx="12" cy="12" r="2" fill="#40E0D0"/>
        <circle cx="28" cy="12" r="2" fill="#40E0D0"/>
        <circle cx="12" cy="28" r="2" fill="#40E0D0"/>
        <circle cx="28" cy="28" r="2" fill="#40E0D0"/>
        <circle cx="20" cy="20" r="2" fill="#FFFFFF"/>

        {/* Lignes de connexion */}
        <line x1="12" y1="12" x2="20" y2="20" stroke="#40E0D0" strokeWidth="1.5"/>
        <line x1="28" y1="12" x2="20" y2="20" stroke="#40E0D0" strokeWidth="1.5"/>
        <line x1="12" y1="28" x2="20" y2="20" stroke="#40E0D0" strokeWidth="1.5"/>
        <line x1="28" y1="28" x2="20" y2="20" stroke="#40E0D0" strokeWidth="1.5"/>

        {/* Texte RACHA */}
        <text x="45" y="18" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="#40E0D0">
          RACHA
        </text>
        {/* Texte DIGITAL */}
        <text x="45" y="30" fontFamily="Arial, sans-serif" fontSize="10" fill="#666666">
          DIGITAL
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
