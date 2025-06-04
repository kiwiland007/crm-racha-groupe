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
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8 md:h-10',
    lg: 'h-12 md:h-16',
    xl: 'h-16 md:h-20'
  };

  const logoSrc = {
    full: '/racha-digital-logo.svg',
    compact: '/racha-digital-logo-compact.svg',
    icon: '/favicon-racha.svg'
  };

  if (variant === 'icon') {
    return (
      <img
        src={logoSrc.icon}
        alt="Racha Digital"
        className={cn(sizeClasses[size], 'w-auto', className)}
      />
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <img
        src={logoSrc[variant]}
        alt="Racha Digital"
        className={cn(sizeClasses[size], 'w-auto')}
      />
      {showText && variant === 'icon' && (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-[#40E0D0]">RACHA</span>
          <span className="text-xs text-gray-600">DIGITAL</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
