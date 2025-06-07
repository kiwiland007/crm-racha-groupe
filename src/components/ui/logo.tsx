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

  // Logo utilisant les fichiers SVG créés
  const renderLogo = () => {
    if (variant === 'icon') {
      return (
        <img
          src="/racha-digital-icon.svg"
          alt="Racha Digital"
          width={height}
          height={height}
          className={cn('flex-shrink-0', className)}
        />
      );
    }

    if (variant === 'full') {
      return (
        <img
          src="/racha-digital-logo.svg"
          alt="Racha Digital"
          width={width}
          height={height}
          className={cn('flex-shrink-0', className)}
        />
      );
    }

    // Variant compact pour header
    return (
      <img
        src="/racha-digital-logo-compact.svg"
        alt="Racha Digital"
        width={width}
        height={height}
        className={cn('flex-shrink-0', className)}
      />
    );
  };

  return (
    <div className={cn('flex items-center', className)}>
      {renderLogo()}
    </div>
  );
};

export default Logo;
