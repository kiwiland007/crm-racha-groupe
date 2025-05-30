import React, { forwardRef, useId } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Input, InputProps } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

// Bouton accessible avec ARIA
interface AccessibleButtonProps extends ButtonProps {
  'aria-label'?: string;
  'aria-describedby'?: string;
  loading?: boolean;
  loadingText?: string;
  tooltip?: string;
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ children, loading, loadingText, tooltip, className, disabled, ...props }, ref) => {
    const buttonId = useId();
    const tooltipId = tooltip ? `${buttonId}-tooltip` : undefined;

    return (
      <div className="relative inline-block">
        <Button
          ref={ref}
          className={cn(
            'focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
            'transition-all duration-200',
            className
          )}
          disabled={disabled || loading}
          aria-describedby={tooltipId}
          {...props}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
              {loadingText || 'Chargement...'}
            </>
          ) : (
            children
          )}
        </Button>
        
        {tooltip && (
          <div
            id={tooltipId}
            role="tooltip"
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 pointer-events-none transition-opacity duration-200 hover:opacity-100 focus:opacity-100"
          >
            {tooltip}
          </div>
        )}
      </div>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';

// Input accessible avec label et messages d'erreur
interface AccessibleInputProps extends Omit<InputProps, 'id'> {
  label: string;
  error?: string;
  description?: string;
  required?: boolean;
  hideLabel?: boolean;
}

export const AccessibleInput = forwardRef<HTMLInputElement, AccessibleInputProps>(
  ({ label, error, description, required, hideLabel, className, ...props }, ref) => {
    const inputId = useId();
    const errorId = error ? `${inputId}-error` : undefined;
    const descriptionId = description ? `${inputId}-description` : undefined;
    const ariaDescribedBy = [errorId, descriptionId].filter(Boolean).join(' ') || undefined;

    return (
      <div className="space-y-2">
        <Label
          htmlFor={inputId}
          className={cn(
            'text-sm font-medium text-gray-700',
            hideLabel && 'sr-only',
            required && "after:content-['*'] after:text-red-500 after:ml-1"
          )}
        >
          {label}
        </Label>
        
        <Input
          ref={ref}
          id={inputId}
          className={cn(
            'focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
            'transition-all duration-200',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          aria-describedby={ariaDescribedBy}
          aria-invalid={error ? 'true' : 'false'}
          aria-required={required}
          {...props}
        />
        
        {description && (
          <p id={descriptionId} className="text-sm text-gray-600">
            {description}
          </p>
        )}
        
        {error && (
          <p id={errorId} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

AccessibleInput.displayName = 'AccessibleInput';

// Select accessible
interface AccessibleSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  description?: string;
  required?: boolean;
  hideLabel?: boolean;
  options: { value: string; label: string; disabled?: boolean }[];
}

export const AccessibleSelect = forwardRef<HTMLSelectElement, AccessibleSelectProps>(
  ({ label, error, description, required, hideLabel, options, className, ...props }, ref) => {
    const selectId = useId();
    const errorId = error ? `${selectId}-error` : undefined;
    const descriptionId = description ? `${selectId}-description` : undefined;
    const ariaDescribedBy = [errorId, descriptionId].filter(Boolean).join(' ') || undefined;

    return (
      <div className="space-y-2">
        <Label
          htmlFor={selectId}
          className={cn(
            'text-sm font-medium text-gray-700',
            hideLabel && 'sr-only',
            required && "after:content-['*'] after:text-red-500 after:ml-1"
          )}
        >
          {label}
        </Label>
        
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
            'focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-all duration-200',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          aria-describedby={ariaDescribedBy}
          aria-invalid={error ? 'true' : 'false'}
          aria-required={required}
          {...props}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {description && (
          <p id={descriptionId} className="text-sm text-gray-600">
            {description}
          </p>
        )}
        
        {error && (
          <p id={errorId} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

AccessibleSelect.displayName = 'AccessibleSelect';

// Textarea accessible
interface AccessibleTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  description?: string;
  required?: boolean;
  hideLabel?: boolean;
}

export const AccessibleTextarea = forwardRef<HTMLTextAreaElement, AccessibleTextareaProps>(
  ({ label, error, description, required, hideLabel, className, ...props }, ref) => {
    const textareaId = useId();
    const errorId = error ? `${textareaId}-error` : undefined;
    const descriptionId = description ? `${textareaId}-description` : undefined;
    const ariaDescribedBy = [errorId, descriptionId].filter(Boolean).join(' ') || undefined;

    return (
      <div className="space-y-2">
        <Label
          htmlFor={textareaId}
          className={cn(
            'text-sm font-medium text-gray-700',
            hideLabel && 'sr-only',
            required && "after:content-['*'] after:text-red-500 after:ml-1"
          )}
        >
          {label}
        </Label>
        
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
            'focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-all duration-200',
            'placeholder:text-muted-foreground',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          aria-describedby={ariaDescribedBy}
          aria-invalid={error ? 'true' : 'false'}
          aria-required={required}
          {...props}
        />
        
        {description && (
          <p id={descriptionId} className="text-sm text-gray-600">
            {description}
          </p>
        )}
        
        {error && (
          <p id={errorId} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

AccessibleTextarea.displayName = 'AccessibleTextarea';

// Composant pour les messages d'état (success, error, warning, info)
interface StatusMessageProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({
  type,
  title,
  children,
  onClose
}) => {
  const messageId = useId();
  
  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const iconMap = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  return (
    <div
      id={messageId}
      role="alert"
      aria-live="polite"
      className={cn(
        'p-4 rounded-md border',
        typeStyles[type]
      )}
    >
      <div className="flex items-start">
        <span className="mr-3 text-lg" aria-hidden="true">
          {iconMap[type]}
        </span>
        <div className="flex-1">
          {title && (
            <h3 className="font-medium mb-1">
              {title}
            </h3>
          )}
          <div className="text-sm">
            {children}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-3 text-lg hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current rounded"
            aria-label="Fermer le message"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

// Hook pour la navigation au clavier
export const useKeyboardNavigation = () => {
  const handleKeyDown = React.useCallback((event: KeyboardEvent) => {
    // Échapper pour fermer les modales
    if (event.key === 'Escape') {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement && activeElement.blur) {
        activeElement.blur();
      }
    }

    // Tab pour la navigation
    if (event.key === 'Tab') {
      // Laisser le comportement par défaut
      return;
    }

    // Entrée et Espace pour activer les éléments
    if (event.key === 'Enter' || event.key === ' ') {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement && activeElement.click && activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
        event.preventDefault();
        activeElement.click();
      }
    }
  }, []);

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};

// Composant pour annoncer les changements aux lecteurs d'écran
export const ScreenReaderAnnouncer: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
};

// Hook pour gérer le focus
export const useFocusManagement = () => {
  const focusRef = React.useRef<HTMLElement | null>(null);

  const setFocus = React.useCallback((element: HTMLElement | null) => {
    if (element) {
      focusRef.current = element;
      element.focus();
    }
  }, []);

  const restoreFocus = React.useCallback(() => {
    if (focusRef.current) {
      focusRef.current.focus();
    }
  }, []);

  return { setFocus, restoreFocus };
};
