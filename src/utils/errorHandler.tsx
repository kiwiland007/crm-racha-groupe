// Gestionnaire d'erreurs centralisé - Amélioration Senior Review
import React from 'react';
import { toast } from 'sonner';
import { ApiError } from '@/types/api';

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly timestamp: Date;
  public readonly context?: Record<string, any>;

  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    statusCode: number = 500,
    isOperational: boolean = true,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date();
    this.context = context;

    // Maintenir la stack trace
    Error.captureStackTrace(this, AppError);
  }
}

// Types d'erreurs spécifiques
export class ValidationError extends AppError {
  constructor(message: string, field?: string) {
    super(message, 'VALIDATION_ERROR', 400, true, { field });
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Non autorisé') {
    super(message, 'AUTHENTICATION_ERROR', 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Accès refusé') {
    super(message, 'AUTHORIZATION_ERROR', 403);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} non trouvé`, 'NOT_FOUND', 404, true, { resource });
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Erreur de réseau') {
    super(message, 'NETWORK_ERROR', 0);
  }
}

// Gestionnaire d'erreurs centralisé
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorReports: AppError[] = [];

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Gérer les erreurs avec notification appropriée
  handle(error: Error | AppError, context?: Record<string, any>): void {
    const appError = this.normalizeError(error, context);
    
    // Logger l'erreur
    this.logError(appError);
    
    // Stocker pour le reporting
    this.storeError(appError);
    
    // Afficher la notification appropriée
    this.showNotification(appError);
    
    // Reporter en production
    if (process.env.NODE_ENV === 'production') {
      this.reportToService(appError);
    }
  }

  private normalizeError(error: Error | AppError, context?: Record<string, any>): AppError {
    if (error instanceof AppError) {
      return error;
    }

    // Convertir les erreurs natives en AppError
    if (error.name === 'TypeError') {
      return new AppError(
        'Erreur de type de données',
        'TYPE_ERROR',
        500,
        false,
        { originalMessage: error.message, ...context }
      );
    }

    if (error.name === 'ReferenceError') {
      return new AppError(
        'Erreur de référence',
        'REFERENCE_ERROR',
        500,
        false,
        { originalMessage: error.message, ...context }
      );
    }

    // Erreur générique
    return new AppError(
      error.message || 'Une erreur inattendue s\'est produite',
      'UNKNOWN_ERROR',
      500,
      false,
      { originalMessage: error.message, ...context }
    );
  }

  private logError(error: AppError): void {
    const logData = {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      timestamp: error.timestamp,
      stack: error.stack,
      context: error.context,
      isOperational: error.isOperational
    };

    if (error.isOperational) {
      console.warn('Operational Error:', logData);
    } else {
      console.error('Programming Error:', logData);
    }
  }

  private storeError(error: AppError): void {
    this.errorReports.push(error);
    
    // Garder seulement les 100 dernières erreurs
    if (this.errorReports.length > 100) {
      this.errorReports = this.errorReports.slice(-100);
    }

    // Sauvegarder dans localStorage pour persistance
    try {
      localStorage.setItem('crm_error_reports', JSON.stringify(
        this.errorReports.map(err => ({
          message: err.message,
          code: err.code,
          timestamp: err.timestamp,
          context: err.context
        }))
      ));
    } catch (e) {
      console.warn('Could not save error reports to localStorage:', e);
    }
  }

  private showNotification(error: AppError): void {
    const isUserError = error.statusCode >= 400 && error.statusCode < 500;
    
    if (isUserError) {
      // Erreurs utilisateur (validation, etc.)
      toast.warning(error.message, {
        description: this.getErrorDescription(error),
        duration: 5000
      });
    } else {
      // Erreurs système
      toast.error('Une erreur inattendue s\'est produite', {
        description: 'L\'équipe technique a été notifiée.',
        action: {
          label: 'Réessayer',
          onClick: () => window.location.reload()
        },
        duration: 8000
      });
    }
  }

  private getErrorDescription(error: AppError): string {
    switch (error.code) {
      case 'VALIDATION_ERROR':
        return 'Veuillez vérifier les données saisies.';
      case 'AUTHENTICATION_ERROR':
        return 'Veuillez vous reconnecter.';
      case 'AUTHORIZATION_ERROR':
        return 'Vous n\'avez pas les permissions nécessaires.';
      case 'NOT_FOUND':
        return 'La ressource demandée n\'existe pas.';
      case 'NETWORK_ERROR':
        return 'Vérifiez votre connexion internet.';
      default:
        return 'Contactez le support si le problème persiste.';
    }
  }

  private reportToService(error: AppError): void {
    // Ici on pourrait envoyer à Sentry, LogRocket, etc.
    // Pour l'instant, on simule juste l'envoi
    console.log('Reporting error to monitoring service:', {
      message: error.message,
      code: error.code,
      timestamp: error.timestamp,
      context: error.context
    });
  }

  // Méthodes utilitaires
  getErrorReports(): AppError[] {
    return [...this.errorReports];
  }

  clearErrorReports(): void {
    this.errorReports = [];
    localStorage.removeItem('crm_error_reports');
  }

  getErrorStats(): { total: number; byCode: Record<string, number> } {
    const byCode: Record<string, number> = {};
    
    this.errorReports.forEach(error => {
      byCode[error.code] = (byCode[error.code] || 0) + 1;
    });

    return {
      total: this.errorReports.length,
      byCode
    };
  }
}

// Instance globale
export const errorHandler = ErrorHandler.getInstance();

// Hook React pour la gestion d'erreurs
export const useErrorHandler = () => {
  const handleError = (error: Error | AppError, context?: Record<string, any>) => {
    errorHandler.handle(error, context);
  };

  const createErrorHandler = (context?: Record<string, any>) => {
    return (error: Error | AppError) => handleError(error, context);
  };

  return {
    handleError,
    createErrorHandler,
    getErrorReports: () => errorHandler.getErrorReports(),
    clearErrorReports: () => errorHandler.clearErrorReports(),
    getErrorStats: () => errorHandler.getErrorStats()
  };
};

// Utilitaires pour les erreurs async
export const withErrorHandling = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: Record<string, any>
): T => {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      errorHandler.handle(error as Error, context);
      throw error; // Re-throw pour permettre la gestion locale si nécessaire
    }
  }) as T;
};

// Wrapper pour les composants React
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error: AppError; retry: () => void }>
) => {
  return (props: P) => {
    const { handleError } = useErrorHandler();
    
    return (
      <ErrorBoundary onError={handleError} fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
};

// Composant ErrorBoundary amélioré
interface ErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  fallback?: React.ComponentType<{ error: AppError; retry: () => void }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: AppError;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error: error instanceof AppError ? error : new AppError(error.message)
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const Fallback = this.props.fallback;
      
      if (Fallback) {
        return (
          <Fallback 
            error={this.state.error} 
            retry={() => this.setState({ hasError: false, error: undefined })}
          />
        );
      }

      // Fallback par défaut
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Une erreur s'est produite
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            {this.state.error.message}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: undefined })}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
