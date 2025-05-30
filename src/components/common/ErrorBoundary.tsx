import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Générer un ID unique pour l'erreur
    const errorId = `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log l'erreur pour le monitoring
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Appeler le callback d'erreur si fourni
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Sauvegarder les détails de l'erreur
    this.setState({
      error,
      errorInfo
    });

    // Envoyer l'erreur au service de monitoring (si configuré)
    this.reportError(error, errorInfo);

    // Afficher une notification toast
    toast.error('Une erreur inattendue s\'est produite', {
      description: 'L\'équipe technique a été notifiée.',
      action: {
        label: 'Recharger',
        onClick: () => window.location.reload()
      }
    });
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // Ici, vous pouvez envoyer l'erreur à un service de monitoring
    // comme Sentry, LogRocket, ou votre propre service
    const errorReport = {
      id: this.state.errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Exemple d'envoi à un service de monitoring
    if (process.env.NODE_ENV === 'production') {
      // fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorReport)
      // }).catch(console.error);
    }

    // Log en développement
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Report');
      console.error('Error ID:', errorReport.id);
      console.error('Message:', errorReport.message);
      console.error('Stack:', errorReport.stack);
      console.error('Component Stack:', errorReport.componentStack);
      console.groupEnd();
    }
  };

  private handleRetry = () => {
    // Réinitialiser l'état d'erreur
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    });

    // Forcer un re-render complet
    setTimeout(() => {
      this.forceUpdate();
    }, 100);
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    try {
      // Réinitialiser l'état d'erreur d'abord
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: ''
      });

      // Essayer plusieurs méthodes de navigation
      if (window.history && window.history.pushState) {
        window.history.pushState({}, '', '/');
        window.location.reload();
      } else {
        window.location.replace('/');
      }
    } catch (navError) {
      console.error('Navigation error:', navError);
      // Fallback: recharger complètement la page
      window.location.href = '/';
    }
  };

  private copyErrorDetails = () => {
    const errorDetails = {
      id: this.state.errorId,
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: new Date().toISOString()
    };

    navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2))
      .then(() => {
        toast.success('Détails de l\'erreur copiés dans le presse-papiers');
      })
      .catch(() => {
        toast.error('Impossible de copier les détails de l\'erreur');
      });
  };

  render() {
    if (this.state.hasError) {
      // Utiliser le fallback personnalisé si fourni
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Interface d'erreur par défaut
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">
                Oups ! Une erreur s'est produite
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Nous nous excusons pour ce désagrément. L'erreur a été automatiquement signalée à notre équipe technique.
              </p>
              <Badge variant="outline" className="mt-2 mx-auto">
                ID: {this.state.errorId}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Actions principales */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={this.handleRetry} className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Réessayer
                </Button>
                <Button variant="outline" onClick={this.handleReload} className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Recharger la page
                </Button>
                <Button variant="outline" onClick={this.handleGoHome} className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Retour à l'accueil
                </Button>
              </div>

              {/* Détails de l'erreur (en développement ou si showDetails est true) */}
              {(process.env.NODE_ENV === 'development' || this.props.showDetails) && this.state.error && (
                <details className="mt-6">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-2">
                    <Bug className="w-4 h-4" />
                    Détails techniques
                  </summary>
                  <div className="mt-3 p-4 bg-gray-100 rounded-lg">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm text-gray-700">Message d'erreur :</h4>
                        <p className="text-sm text-red-600 font-mono mt-1">
                          {this.state.error.message}
                        </p>
                      </div>
                      
                      {this.state.error.stack && (
                        <div>
                          <h4 className="font-medium text-sm text-gray-700">Stack trace :</h4>
                          <pre className="text-xs text-gray-600 bg-white p-2 rounded border overflow-auto max-h-32 mt-1">
                            {this.state.error.stack}
                          </pre>
                        </div>
                      )}

                      {this.state.errorInfo?.componentStack && (
                        <div>
                          <h4 className="font-medium text-sm text-gray-700">Component stack :</h4>
                          <pre className="text-xs text-gray-600 bg-white p-2 rounded border overflow-auto max-h-32 mt-1">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={this.copyErrorDetails}
                        className="mt-3"
                      >
                        Copier les détails
                      </Button>
                    </div>
                  </div>
                </details>
              )}

              {/* Informations de contact support */}
              <div className="text-center text-sm text-gray-500 mt-6 pt-4 border-t">
                <p>
                  Si le problème persiste, contactez le support technique :
                </p>
                <p className="mt-1">
                  <a 
                    href="mailto:support@rachabusiness.com" 
                    className="text-blue-600 hover:text-blue-800"
                  >
                    support@rachabusiness.com
                  </a>
                  {' | '}
                  <a 
                    href="tel:+212669382828" 
                    className="text-blue-600 hover:text-blue-800"
                  >
                    +212 6 69 38 28 28
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook pour utiliser l'ErrorBoundary de manière fonctionnelle
export const useErrorHandler = () => {
  const handleError = React.useCallback((error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by useErrorHandler:', error);
    
    // Afficher une notification
    toast.error('Une erreur s\'est produite', {
      description: error.message,
      action: {
        label: 'Recharger',
        onClick: () => window.location.reload()
      }
    });

    // Reporter l'erreur
    if (process.env.NODE_ENV === 'production') {
      // Envoyer à un service de monitoring
    }
  }, []);

  return { handleError };
};

// Composant wrapper pour les pages
export const PageErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Page Error:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundary;
