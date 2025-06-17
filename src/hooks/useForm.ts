import { useState, useCallback, useMemo } from 'react';
import { ValidationRule } from '@/types/api';

// Types pour le hook de formulaire
export interface FormField<T = unknown> {
  value: T;
  error?: string;
  touched: boolean;
  dirty: boolean;
}

export interface FormConfig<T extends Record<string, unknown>> {
  initialValues: T;
  validationRules?: Partial<Record<keyof T, ValidationRule>>;
  onSubmit?: (values: T) => void | Promise<void>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export interface UseFormReturn<T extends Record<string, unknown>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  dirty: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
  
  // Actions
  setValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setValues: (values: Partial<T>) => void;
  setError: <K extends keyof T>(field: K, error: string) => void;
  setErrors: (errors: Partial<Record<keyof T, string>>) => void;
  setTouched: <K extends keyof T>(field: K, touched?: boolean) => void;
  clearErrors: () => void;
  reset: (values?: Partial<T>) => void;
  
  // Validation
  validate: () => boolean;
  validateField: <K extends keyof T>(field: K) => boolean;
  
  // Handlers
  handleChange: <K extends keyof T>(field: K) => (value: T[K]) => void;
  handleBlur: <K extends keyof T>(field: K) => () => void;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  
  // Utilitaires
  getFieldProps: <K extends keyof T>(field: K) => {
    value: T[K];
    error?: string;
    touched: boolean;
    dirty: boolean;
    onChange: (value: T[K]) => void;
    onBlur: () => void;
  };
}

// Fonction de validation
const validateValue = (value: unknown, rule: ValidationRule): string | null => {
  if (rule.required && (value === undefined || value === null || value === '')) {
    return 'Ce champ est requis';
  }
  
  if (value && rule.minLength && String(value).length < rule.minLength) {
    return `Minimum ${rule.minLength} caractères requis`;
  }
  
  if (value && rule.maxLength && String(value).length > rule.maxLength) {
    return `Maximum ${rule.maxLength} caractères autorisés`;
  }
  
  if (value && rule.pattern && !rule.pattern.test(String(value))) {
    return 'Format invalide';
  }
  
  if (rule.custom) {
    return rule.custom(value);
  }
  
  return null;
};

// Hook principal
export function useForm<T extends Record<string, unknown>>({
  initialValues,
  validationRules = {},
  onSubmit,
  validateOnChange = false,
  validateOnBlur = true,
}: FormConfig<T>): UseFormReturn<T> {
  
  // État du formulaire
  const [values, setValuesState] = useState<T>(initialValues);
  const [errors, setErrorsState] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouchedState] = useState<Partial<Record<keyof T, boolean>>>({});
  const [dirty, setDirtyState] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calculer si le formulaire est valide
  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);
  
  // Calculer si le formulaire a été modifié
  const isDirty = useMemo(() => {
    return Object.values(dirty).some(Boolean);
  }, [dirty]);
  
  // Valider un champ spécifique
  const validateField = useCallback(<K extends keyof T>(field: K): boolean => {
    const rule = validationRules[field];
    if (!rule) return true;
    
    const error = validateValue(values[field], rule);
    
    if (error) {
      setErrorsState(prev => ({ ...prev, [field]: error }));
      return false;
    } else {
      setErrorsState(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      return true;
    }
  }, [values, validationRules]);
  
  // Valider tout le formulaire
  const validate = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isFormValid = true;
    
    Object.keys(validationRules).forEach(fieldKey => {
      const field = fieldKey as keyof T;
      const rule = validationRules[field];
      if (!rule) return;
      
      const error = validateValue(values[field], rule);
      if (error) {
        newErrors[field] = error;
        isFormValid = false;
      }
    });
    
    setErrorsState(newErrors);
    return isFormValid;
  }, [values, validationRules]);
  
  // Actions
  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValuesState(prev => ({ ...prev, [field]: value }));
    setDirtyState(prev => ({ ...prev, [field]: true }));
    
    if (validateOnChange) {
      setTimeout(() => validateField(field), 0);
    }
  }, [validateOnChange, validateField]);
  
  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState(prev => ({ ...prev, ...newValues }));
    
    Object.keys(newValues).forEach(key => {
      setDirtyState(prev => ({ ...prev, [key]: true }));
    });
  }, []);
  
  const setError = useCallback(<K extends keyof T>(field: K, error: string) => {
    setErrorsState(prev => ({ ...prev, [field]: error }));
  }, []);
  
  const setErrors = useCallback((newErrors: Partial<Record<keyof T, string>>) => {
    setErrorsState(newErrors);
  }, []);
  
  const setTouched = useCallback(<K extends keyof T>(field: K, isTouched = true) => {
    setTouchedState(prev => ({ ...prev, [field]: isTouched }));
  }, []);
  
  const clearErrors = useCallback(() => {
    setErrorsState({});
  }, []);
  
  const reset = useCallback((newValues?: Partial<T>) => {
    const resetValues = newValues ? { ...initialValues, ...newValues } : initialValues;
    setValuesState(resetValues);
    setErrorsState({});
    setTouchedState({});
    setDirtyState({});
    setIsSubmitting(false);
  }, [initialValues]);
  
  // Handlers
  const handleChange = useCallback(<K extends keyof T>(field: K) => (value: T[K]) => {
    setValue(field, value);
  }, [setValue]);
  
  const handleBlur = useCallback(<K extends keyof T>(field: K) => () => {
    setTouched(field, true);
    
    if (validateOnBlur) {
      validateField(field);
    }
  }, [setTouched, validateOnBlur, validateField]);
  
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    // Marquer tous les champs comme touchés
    const allTouched = Object.keys(initialValues).reduce((acc, key) => {
      acc[key as keyof T] = true;
      return acc;
    }, {} as Partial<Record<keyof T, boolean>>);
    setTouchedState(allTouched);
    
    // Valider le formulaire
    const isFormValid = validate();
    
    if (isFormValid && onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Erreur lors de la soumission:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [validate, onSubmit, values, initialValues]);
  
  // Utilitaire pour obtenir les props d'un champ
  const getFieldProps = useCallback(<K extends keyof T>(field: K) => ({
    value: values[field],
    error: errors[field],
    touched: touched[field] || false,
    dirty: dirty[field] || false,
    onChange: handleChange(field),
    onBlur: handleBlur(field),
  }), [values, errors, touched, dirty, handleChange, handleBlur]);
  
  return {
    values,
    errors,
    touched,
    dirty,
    isValid,
    isSubmitting,
    isDirty,
    
    setValue,
    setValues,
    setError,
    setErrors,
    setTouched,
    clearErrors,
    reset,
    
    validate,
    validateField,
    
    handleChange,
    handleBlur,
    handleSubmit,
    
    getFieldProps,
  };
}
