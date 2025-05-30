import { useState, useEffect } from 'react';

// Breakpoints personnalisés pour Racha Business CRM
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  // Breakpoints personnalisés
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
} as const;

export type Breakpoint = keyof typeof breakpoints;

// Hook pour détecter la taille d'écran actuelle
export const useBreakpoint = () => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('lg');
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setWindowSize({ width, height });

      // Déterminer le breakpoint actuel
      let newBreakpoint: Breakpoint = 'xs';
      
      Object.entries(breakpoints)
        .sort(([, a], [, b]) => b - a) // Trier par ordre décroissant
        .forEach(([name, value]) => {
          if (width >= value) {
            newBreakpoint = name as Breakpoint;
            return;
          }
        });

      setCurrentBreakpoint(newBreakpoint);
    };

    handleResize(); // Appel initial
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isBreakpoint = (breakpoint: Breakpoint) => {
    return windowSize.width >= breakpoints[breakpoint];
  };

  const isBetween = (min: Breakpoint, max: Breakpoint) => {
    return windowSize.width >= breakpoints[min] && windowSize.width < breakpoints[max];
  };

  return {
    currentBreakpoint,
    windowSize,
    isBreakpoint,
    isBetween,
    // Helpers pour les breakpoints communs
    isMobile: windowSize.width < breakpoints.md,
    isTablet: isBetween('md', 'lg'),
    isDesktop: windowSize.width >= breakpoints.lg,
    isWide: windowSize.width >= breakpoints.wide,
    // Orientation
    isLandscape: windowSize.width > windowSize.height,
    isPortrait: windowSize.width <= windowSize.height,
  };
};

// Hook pour les media queries
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    const updateMatches = () => setMatches(media.matches);
    updateMatches();
    
    media.addEventListener('change', updateMatches);
    return () => media.removeEventListener('change', updateMatches);
  }, [query]);

  return matches;
};

// Hook pour les colonnes responsives
export const useResponsiveColumns = () => {
  const { currentBreakpoint, windowSize } = useBreakpoint();

  const getColumns = (config: Partial<Record<Breakpoint, number>>) => {
    // Configuration par défaut
    const defaultConfig = {
      xs: 1,
      sm: 2,
      md: 2,
      lg: 3,
      xl: 4,
      '2xl': 4,
    };

    const mergedConfig = { ...defaultConfig, ...config };
    
    // Trouver le nombre de colonnes pour le breakpoint actuel
    let columns = mergedConfig.xs;
    
    Object.entries(breakpoints)
      .sort(([, a], [, b]) => a - b) // Trier par ordre croissant
      .forEach(([name, value]) => {
        if (windowSize.width >= value && mergedConfig[name as Breakpoint]) {
          columns = mergedConfig[name as Breakpoint]!;
        }
      });

    return columns;
  };

  return { getColumns, currentBreakpoint };
};

// Hook pour les grilles responsives
export const useResponsiveGrid = () => {
  const { windowSize } = useBreakpoint();

  const getGridConfig = () => {
    if (windowSize.width < breakpoints.sm) {
      return {
        columns: 1,
        gap: 'gap-4',
        padding: 'p-4',
        containerClass: 'grid grid-cols-1 gap-4 p-4',
      };
    }
    
    if (windowSize.width < breakpoints.md) {
      return {
        columns: 2,
        gap: 'gap-4',
        padding: 'p-4',
        containerClass: 'grid grid-cols-2 gap-4 p-4',
      };
    }
    
    if (windowSize.width < breakpoints.lg) {
      return {
        columns: 2,
        gap: 'gap-6',
        padding: 'p-6',
        containerClass: 'grid grid-cols-2 gap-6 p-6',
      };
    }
    
    if (windowSize.width < breakpoints.xl) {
      return {
        columns: 3,
        gap: 'gap-6',
        padding: 'p-6',
        containerClass: 'grid grid-cols-3 gap-6 p-6',
      };
    }
    
    return {
      columns: 4,
      gap: 'gap-8',
      padding: 'p-8',
      containerClass: 'grid grid-cols-4 gap-8 p-8',
    };
  };

  return getGridConfig();
};

// Hook pour la navigation responsive
export const useResponsiveNavigation = () => {
  const { isMobile, isTablet } = useBreakpoint();

  return {
    showMobileMenu: isMobile,
    showSidebar: !isMobile,
    collapsedSidebar: isTablet,
    showBottomNavigation: isMobile,
    headerHeight: isMobile ? 'h-14' : 'h-16',
    sidebarWidth: isMobile ? 'w-0' : isTablet ? 'w-16' : 'w-64',
  };
};

// Hook pour les tableaux responsives
export const useResponsiveTable = () => {
  const { isMobile, isTablet } = useBreakpoint();

  const getTableConfig = () => {
    if (isMobile) {
      return {
        variant: 'cards' as const,
        showPagination: true,
        itemsPerPage: 5,
        showFilters: false,
        compactMode: true,
      };
    }
    
    if (isTablet) {
      return {
        variant: 'table' as const,
        showPagination: true,
        itemsPerPage: 10,
        showFilters: true,
        compactMode: true,
      };
    }
    
    return {
      variant: 'table' as const,
      showPagination: true,
      itemsPerPage: 20,
      showFilters: true,
      compactMode: false,
    };
  };

  return getTableConfig();
};

// Hook pour les formulaires responsives
export const useResponsiveForm = () => {
  const { isMobile, isTablet } = useBreakpoint();

  const getFormConfig = () => {
    if (isMobile) {
      return {
        layout: 'single-column' as const,
        spacing: 'space-y-4',
        buttonSize: 'lg',
        inputSize: 'lg',
        showLabels: true,
        stackButtons: true,
      };
    }
    
    if (isTablet) {
      return {
        layout: 'two-column' as const,
        spacing: 'space-y-4',
        buttonSize: 'default',
        inputSize: 'default',
        showLabels: true,
        stackButtons: false,
      };
    }
    
    return {
      layout: 'multi-column' as const,
      spacing: 'space-y-6',
      buttonSize: 'default',
      inputSize: 'default',
      showLabels: true,
      stackButtons: false,
    };
  };

  return getFormConfig();
};

// Hook pour les modales responsives
export const useResponsiveModal = () => {
  const { isMobile, windowSize } = useBreakpoint();

  const getModalConfig = () => {
    if (isMobile) {
      return {
        size: 'full-screen' as const,
        position: 'bottom' as const,
        animation: 'slide-up' as const,
        padding: 'p-4',
        maxWidth: 'w-full',
        maxHeight: 'h-full',
      };
    }
    
    return {
      size: 'auto' as const,
      position: 'center' as const,
      animation: 'fade-in' as const,
      padding: 'p-6',
      maxWidth: 'max-w-2xl',
      maxHeight: 'max-h-[90vh]',
    };
  };

  return getModalConfig();
};

// Utilitaires pour les classes CSS responsives
export const responsiveUtils = {
  // Générer des classes de grille responsive
  gridCols: (config: Partial<Record<Breakpoint, number>>) => {
    const classes: string[] = [];
    
    Object.entries(config).forEach(([breakpoint, cols]) => {
      if (breakpoint === 'xs') {
        classes.push(`grid-cols-${cols}`);
      } else {
        classes.push(`${breakpoint}:grid-cols-${cols}`);
      }
    });
    
    return classes.join(' ');
  },

  // Générer des classes de padding responsive
  padding: (config: Partial<Record<Breakpoint, string>>) => {
    const classes: string[] = [];
    
    Object.entries(config).forEach(([breakpoint, padding]) => {
      if (breakpoint === 'xs') {
        classes.push(padding);
      } else {
        classes.push(`${breakpoint}:${padding}`);
      }
    });
    
    return classes.join(' ');
  },

  // Générer des classes de gap responsive
  gap: (config: Partial<Record<Breakpoint, string>>) => {
    const classes: string[] = [];
    
    Object.entries(config).forEach(([breakpoint, gap]) => {
      if (breakpoint === 'xs') {
        classes.push(gap);
      } else {
        classes.push(`${breakpoint}:${gap}`);
      }
    });
    
    return classes.join(' ');
  },
};
