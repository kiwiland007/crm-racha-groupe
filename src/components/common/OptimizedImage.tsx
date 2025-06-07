import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  lazy?: boolean;
  placeholder?: string;
  fallback?: string;
  quality?: number;
  format?: 'webp' | 'avif' | 'auto';
  sizes?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  className?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  lazy = true,
  placeholder,
  fallback = '/images/placeholder.svg',
  quality = 80,
  format = 'auto',
  sizes,
  priority = false,
  onLoad,
  onError,
  className,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy || priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Générer l'URL optimisée
  const getOptimizedSrc = (originalSrc: string) => {
    if (!originalSrc || originalSrc.startsWith('data:') || originalSrc.startsWith('blob:')) {
      return originalSrc;
    }

    // Si c'est une URL externe, retourner telle quelle
    if (originalSrc.startsWith('http')) {
      return originalSrc;
    }

    // Construire l'URL avec les paramètres d'optimisation
    const params = new URLSearchParams();
    
    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    if (quality !== 80) params.set('q', quality.toString());
    if (format !== 'auto') params.set('f', format);

    const queryString = params.toString();
    return queryString ? `${originalSrc}?${queryString}` : originalSrc;
  };

  // Générer le srcSet pour les images responsives
  const generateSrcSet = (originalSrc: string) => {
    if (!width || originalSrc.startsWith('data:') || originalSrc.startsWith('blob:')) {
      return undefined;
    }

    const breakpoints = [0.5, 1, 1.5, 2];
    return breakpoints
      .map(multiplier => {
        const scaledWidth = Math.round(width * multiplier);
        const optimizedSrc = getOptimizedSrc(originalSrc);
        const url = new URL(optimizedSrc, window.location.origin);
        url.searchParams.set('w', scaledWidth.toString());
        return `${url.toString()} ${scaledWidth}w`;
      })
      .join(', ');
  };

  // Observer pour le lazy loading
  useEffect(() => {
    if (!lazy || priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [lazy, priority, isInView]);

  // Gérer le chargement de l'image
  const handleLoad = () => {
    setIsLoaded(true);
    setIsError(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsError(true);
    setIsLoaded(false);
    onError?.();
  };

  // Preload pour les images prioritaires
  useEffect(() => {
    if (priority && src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = getOptimizedSrc(src);
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }
  }, [priority, src]);

  const optimizedSrc = getOptimizedSrc(src);
  const srcSet = generateSrcSet(src);
  const shouldShowPlaceholder = !isLoaded && !isError && placeholder;
  const shouldShowFallback = isError && fallback;

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Placeholder */}
      {shouldShowPlaceholder && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
          style={{
            backgroundImage: placeholder ? `url(${placeholder})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {!placeholder && (
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          )}
        </div>
      )}

      {/* Image principale */}
      {isInView && (
        <img
          ref={imgRef}
          src={shouldShowFallback ? fallback : optimizedSrc}
          srcSet={!shouldShowFallback ? srcSet : undefined}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          loading={lazy && !priority ? 'lazy' : 'eager'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            'w-full h-full object-cover'
          )}
          {...props}
        />
      )}

      {/* Overlay de chargement */}
      {!isLoaded && !shouldShowPlaceholder && isInView && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
    </div>
  );
};

// Hook pour détecter le support WebP/AVIF
export const useImageFormatSupport = () => {
  const [supports, setSupports] = useState({
    webp: false,
    avif: false,
  });

  useEffect(() => {
    const checkWebP = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    };

    const checkAVIF = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      try {
        return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
      } catch {
        return false;
      }
    };

    setSupports({
      webp: checkWebP(),
      avif: checkAVIF(),
    });
  }, []);

  return supports;
};

// Composant pour les images de profil
export const ProfileImage: React.FC<{
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ src, name, size = 'md', className }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (src) {
    return (
      <OptimizedImage
        src={src}
        alt={`Photo de profil de ${name}`}
        className={cn('rounded-full', sizes[size], className)}
        width={size === 'sm' ? 32 : size === 'md' ? 40 : size === 'lg' ? 48 : 64}
        height={size === 'sm' ? 32 : size === 'md' ? 40 : size === 'lg' ? 48 : 64}
        fallback="/images/default-avatar.svg"
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium',
        sizes[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
};

// Composant pour les images de produits
export const ProductImage: React.FC<{
  src?: string;
  name: string;
  category?: string;
  className?: string;
}> = ({ src, name, category, className }) => {
  const getCategoryIcon = (category?: string) => {
    const icons: Record<string, string> = {
      'electronics': '📱',
      'furniture': '🪑',
      'clothing': '👕',
      'books': '📚',
      'tools': '🔧',
      'default': '📦',
    };
    return icons[category?.toLowerCase() || 'default'];
  };

  if (src) {
    return (
      <OptimizedImage
        src={src}
        alt={`Image du produit ${name}`}
        className={cn('rounded-lg', className)}
        fallback="/images/product-placeholder.svg"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    );
  }

  return (
    <div className={cn('rounded-lg bg-gray-100 flex items-center justify-center', className)}>
      <div className="text-center">
        <div className="text-4xl mb-2">{getCategoryIcon(category)}</div>
        <div className="text-xs text-gray-500 font-medium">{category || 'Produit'}</div>
      </div>
    </div>
  );
};

export default OptimizedImage;
