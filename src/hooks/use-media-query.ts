import { useState, useEffect } from 'react';

/**
 * Hook pour détecter les media queries
 * @param query - La media query à surveiller (ex: "(min-width: 768px)")
 * @returns boolean - true si la media query correspond
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Vérifier si window est disponible (côté client)
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    
    // Définir l'état initial
    setMatches(mediaQuery.matches);

    // Fonction de callback pour les changements
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Ajouter l'écouteur d'événements
    mediaQuery.addEventListener('change', handleChange);

    // Nettoyage
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}

/**
 * Hook pour détecter si l'écran est de taille desktop
 * @returns boolean - true si l'écran est >= 768px
 */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 768px)');
}

/**
 * Hook pour détecter si l'écran est de taille tablet
 * @returns boolean - true si l'écran est entre 768px et 1024px
 */
export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
}

/**
 * Hook pour détecter si l'écran est de taille mobile
 * @returns boolean - true si l'écran est < 768px
 */
export function useIsMobileQuery(): boolean {
  return useMediaQuery('(max-width: 767px)');
}

/**
 * Hook pour détecter la taille d'écran actuelle
 * @returns string - 'mobile' | 'tablet' | 'desktop'
 */
export function useScreenSize(): 'mobile' | 'tablet' | 'desktop' {
  const isMobile = useIsMobileQuery();
  const isTablet = useIsTablet();
  
  if (isMobile) return 'mobile';
  if (isTablet) return 'tablet';
  return 'desktop';
}

/**
 * Hook pour détecter les breakpoints personnalisés
 * @param breakpoints - Objet avec les breakpoints personnalisés
 * @returns Objet avec les états des breakpoints
 */
export function useBreakpoints<T extends Record<string, string>>(
  breakpoints: T
): Record<keyof T, boolean> {
  const [matches, setMatches] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQueries: Record<keyof T, MediaQueryList> = {} as Record<keyof T, MediaQueryList>;
    const handlers: Record<keyof T, (event: MediaQueryListEvent) => void> = {} as Record<keyof T, (event: MediaQueryListEvent) => void>;

    // Initialiser les media queries
    Object.entries(breakpoints).forEach(([key, query]) => {
      const mediaQuery = window.matchMedia(query as string);
      mediaQueries[key as keyof T] = mediaQuery;
      
      // Handler pour ce breakpoint
      handlers[key as keyof T] = (event: MediaQueryListEvent) => {
        setMatches(prev => ({
          ...prev,
          [key]: event.matches
        }));
      };

      // Ajouter l'écouteur
      mediaQuery.addEventListener('change', handlers[key as keyof T]);
      
      // Définir l'état initial
      setMatches(prev => ({
        ...prev,
        [key]: mediaQuery.matches
      }));
    });

    // Nettoyage
    return () => {
      Object.entries(mediaQueries).forEach(([key, mediaQuery]) => {
        mediaQuery.removeEventListener('change', handlers[key as keyof T]);
      });
    };
  }, [breakpoints]);

  return matches;
}

export default useMediaQuery;
