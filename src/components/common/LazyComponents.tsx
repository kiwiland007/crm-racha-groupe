import { lazy, Suspense } from 'react';
import { LoadingSkeleton } from './OptimizedComponents';

// Lazy loading des pages principales
export const LazyIndex = lazy(() => import('@/pages/Index'));
export const LazyContacts = lazy(() => import('@/pages/Contacts'));
export const LazyInventory = lazy(() => import('@/pages/Inventory'));
export const LazyEvents = lazy(() => import('@/pages/Events'));
export const LazyQuotes = lazy(() => import('@/pages/Quotes'));
export const LazyInvoices = lazy(() => import('@/pages/Invoices'));
export const LazyBonLivraison = lazy(() => import('@/pages/BonLivraison'));
export const LazyTechnicalSheets = lazy(() => import('@/pages/TechnicalSheets'));
export const LazySettings = lazy(() => import('@/pages/Settings'));
export const LazyAnalytics = lazy(() => import('@/pages/Analytics'));
export const LazyProducts = lazy(() => import('@/pages/Products'));
export const LazyServices = lazy(() => import('@/pages/Services'));
export const LazyInvoiceForm = lazy(() => import('@/pages/InvoiceForm'));

// Lazy loading des composants lourds
export const LazyContactForm = lazy(() => import('@/components/contacts/ContactForm'));
export const LazyProductForm = lazy(() => import('@/components/products/ProductForm'));
export const LazyQuoteForm = lazy(() => import('@/components/invoices/QuoteForm'));
export const LazyAdvancedQuoteForm = lazy(() => import('@/components/invoices/AdvancedQuoteForm'));
export const LazyEventForm = lazy(() => import('@/components/events/EventForm'));
export const LazyTechnicalSheetForm = lazy(() => import('@/components/equipment/TechnicalSheetForm'));

// Lazy loading des graphiques et analytics
export const LazyCharts = lazy(() => import('@/components/dashboard/Charts'));
export const LazyAnalyticsCharts = lazy(() => import('@/components/analytics/AnalyticsCharts'));

// Composants wrapper avec Suspense
interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  variant?: 'page' | 'form' | 'chart' | 'component';
}

export const LazyWrapper: React.FC<LazyWrapperProps> = ({
  children,
  fallback,
  variant = 'component'
}) => {
  const getDefaultFallback = () => {
    switch (variant) {
      case 'page':
        return (
          <div className="container mx-auto p-6 space-y-6">
            <LoadingSkeleton variant="card" lines={8} />
          </div>
        );
      case 'form':
        return (
          <div className="max-w-2xl mx-auto p-6">
            <LoadingSkeleton variant="card" lines={6} />
          </div>
        );
      case 'chart':
        return (
          <div className="w-full h-64">
            <LoadingSkeleton variant="card" lines={4} />
          </div>
        );
      default:
        return <LoadingSkeleton lines={3} />;
    }
  };

  return (
    <Suspense fallback={fallback || getDefaultFallback()}>
      {children}
    </Suspense>
  );
};

interface NavigatorNetworkInformation extends Navigator {
  connection?: NetworkInformation;
}

interface NetworkInformation extends EventTarget {
  readonly effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  // Add other properties if needed: downlink, downlinkMax, rtt, saveData, type
}

// HOC pour lazy loading avec error boundary
export const withLazyLoading = <P extends Record<string, unknown>>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) => {
  const LazyComponent = lazy(() => Promise.resolve({ default: Component }));
  
  return (props: P) => (
    <LazyWrapper fallback={fallback}>
      <LazyComponent {...props} />
    </LazyWrapper>
  );
};

// Hook pour le preloading conditionnel
export const usePreload = () => {
  const preloadComponent = (importFn: () => Promise<{ default: React.ComponentType<unknown> }>) => {
    // Preload seulement si la connexion est rapide
    if ('connection' in navigator) {
      const connection = (navigator as NavigatorNetworkInformation).connection;
      if (connection && (connection.effectiveType === '4g' || connection.effectiveType === '3g')) {
        importFn();
      }
    } else {
      // Fallback: preload après un délai
      setTimeout(() => {
        importFn();
      }, 2000);
    }
  };

  return { preloadComponent };
};

// Composants de page avec lazy loading
export const PageComponents = {
  Index: () => (
    <LazyWrapper variant="page">
      <LazyIndex />
    </LazyWrapper>
  ),
  Contacts: () => (
    <LazyWrapper variant="page">
      <LazyContacts />
    </LazyWrapper>
  ),
  Inventory: () => (
    <LazyWrapper variant="page">
      <LazyInventory />
    </LazyWrapper>
  ),
  Events: () => (
    <LazyWrapper variant="page">
      <LazyEvents />
    </LazyWrapper>
  ),
  Quotes: () => (
    <LazyWrapper variant="page">
      <LazyQuotes />
    </LazyWrapper>
  ),
  Invoices: () => (
    <LazyWrapper variant="page">
      <LazyInvoices />
    </LazyWrapper>
  ),
  BonLivraison: () => (
    <LazyWrapper variant="page">
      <LazyBonLivraison />
    </LazyWrapper>
  ),
  TechnicalSheets: () => (
    <LazyWrapper variant="page">
      <LazyTechnicalSheets />
    </LazyWrapper>
  ),
  Settings: () => (
    <LazyWrapper variant="page">
      <LazySettings />
    </LazyWrapper>
  ),
  Analytics: () => (
    <LazyWrapper variant="page">
      <LazyAnalytics />
    </LazyWrapper>
  ),
  Products: () => (
    <LazyWrapper variant="page">
      <LazyProducts />
    </LazyWrapper>
  ),
  Services: () => (
    <LazyWrapper variant="page">
      <LazyServices />
    </LazyWrapper>
  ),
  InvoiceForm: () => (
    <LazyWrapper variant="form">
      <LazyInvoiceForm />
    </LazyWrapper>
  ),
};

// Composants de formulaire avec lazy loading
export const FormComponents = {
  ContactForm: <P extends Record<string, unknown>>(props: P) => (
    <LazyWrapper variant="form">
      <LazyContactForm {...props} />
    </LazyWrapper>
  ),
  ProductForm: <P extends Record<string, unknown>>(props: P) => (
    <LazyWrapper variant="form">
      <LazyProductForm {...props} />
    </LazyWrapper>
  ),
  QuoteForm: <P extends Record<string, unknown>>(props: P) => (
    <LazyWrapper variant="form">
      <LazyQuoteForm {...props} />
    </LazyWrapper>
  ),
  AdvancedQuoteForm: <P extends Record<string, unknown>>(props: P) => (
    <LazyWrapper variant="form">
      <LazyAdvancedQuoteForm {...props} />
    </LazyWrapper>
  ),
  EventForm: <P extends Record<string, unknown>>(props: P) => (
    <LazyWrapper variant="form">
      <LazyEventForm {...props} />
    </LazyWrapper>
  ),
  TechnicalSheetForm: <P extends Record<string, unknown>>(props: P) => (
    <LazyWrapper variant="form">
      <LazyTechnicalSheetForm {...props} />
    </LazyWrapper>
  ),
};
