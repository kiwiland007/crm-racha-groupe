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

export class RouterErrorBoundary extends Component<Props, State> {
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
    const errorId = `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('RouterErrorBoundary caught an error:', error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.setState({
      error,
      errorInfo
    });

    toast.error('Une erreur inattendue s\'est produite', {
      description: 'Cliquez sur "Retour à l\'accueil" pour continuer.',
      action: {
        label: 'Accueil',
        onClick: () => this.handleGoHome()
      }
    });
  }

  private handleRetry = () => {
    console.log('Retrying...');
    // Recharger la page pour réessayer
    window.location.reload();
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    console.log('Navigating to home...');
    // Solution la plus simple et directe
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

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
                Nous nous excusons pour ce désagrément. Cliquez sur "Retour à l'accueil" pour continuer.
              </p>
              <Badge variant="outline" className="mt-2 mx-auto">
                ID: {this.state.errorId}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    console.log('Direct navigation to home');
                    window.location.href = '/';
                  }}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Retour à l'accueil
                </button>
                <button
                  onClick={() => {
                    console.log('Retrying...');
                    window.location.reload();
                  }}
                  className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Réessayer
                </button>
                <button
                  onClick={() => {
                    console.log('Reloading...');
                    window.location.reload();
                  }}
                  className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Recharger
                </button>
              </div>

              {/* Liens directs de navigation */}
              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-600 mb-3">Ou naviguez directement vers :</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => {
                      console.log('Going to dashboard...');
                      window.location.href = '/';
                    }}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      console.log('Going to contacts...');
                      window.location.href = '/contacts';
                    }}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                  >
                    Contacts
                  </button>
                  <button
                    onClick={() => {
                      console.log('Going to products...');
                      window.location.href = '/products';
                    }}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                  >
                    Produits
                  </button>
                  <button
                    onClick={() => {
                      console.log('Going to quotes...');
                      window.location.href = '/quotes';
                    }}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                  >
                    Devis
                  </button>
                  <button
                    onClick={() => {
                      console.log('Going to invoices...');
                      window.location.href = '/invoices';
                    }}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                  >
                    Factures
                  </button>
                </div>
              </div>

              {/* Détails de l'erreur en développement */}
              {(process.env.NODE_ENV === 'development' || this.props.showDetails) && this.state.error && (
                <details className="mt-6">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-2">
                    <Bug className="w-4 h-4" />
                    Détails techniques
                  </summary>
                  <div className="mt-3 p-4 bg-gray-100 rounded-lg">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm text-gray-700">Message :</h4>
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
                    </div>
                  </div>
                </details>
              )}

              <div className="text-center text-sm text-gray-500 mt-6 pt-4 border-t">
                <p>Support technique :</p>
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

export default RouterErrorBoundary;
