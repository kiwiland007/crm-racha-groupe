import React, { useCallback } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';

// Hook pour la validation avec Zod
export const useValidation = <T extends z.ZodType>(schema: T) => {
  const validate = useCallback((data: unknown): data is z.infer<T> => {
    try {
      schema.parse(data);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Afficher les erreurs de validation
        const errorMessages = error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        ).join(', ');
        
        toast.error('Erreur de validation', {
          description: errorMessages
        });
      }
      return false;
    }
  }, [schema]);

  const validateAsync = useCallback(async (data: unknown): Promise<z.infer<T> | null> => {
    try {
      const result = await schema.parseAsync(data);
      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => 
          `${err.path.join('.')}: ${err.message}`
        ).join(', ');
        
        toast.error('Erreur de validation', {
          description: errorMessages
        });
      }
      return null;
    }
  }, [schema]);

  const getErrors = useCallback((data: unknown): z.ZodError | null => {
    try {
      schema.parse(data);
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error;
      }
      return null;
    }
  }, [schema]);

  return {
    validate,
    validateAsync,
    getErrors
  };
};

// Hook pour la validation de formulaires
export const useFormValidation = () => {
  const validateField = useCallback((value: unknown, schema: z.ZodType): string | null => {
    try {
      schema.parse(value);
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors[0]?.message || 'Erreur de validation';
      }
      return 'Erreur de validation';
    }
  }, []);

  const validateForm = useCallback((data: Record<string, unknown>, schema: z.ZodType): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    try {
      schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => {
          const path = err.path.join('.');
          errors[path] = err.message;
        });
      }
    }
    
    return errors;
  }, []);

  return {
    validateField,
    validateForm
  };
};

// Hook pour la validation en temps réel
export const useRealTimeValidation = <T extends z.ZodType>(
  schema: T,
  debounceMs: number = 300
) => {
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isValid, setIsValid] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const validateData = useCallback((data: unknown) => {
    // Annuler la validation précédente
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Programmer une nouvelle validation
    timeoutRef.current = setTimeout(() => {
      try {
        schema.parse(data);
        setErrors({});
        setIsValid(true);
      } catch (error) {
        if (error instanceof z.ZodError) {
          const newErrors: Record<string, string> = {};
          error.errors.forEach(err => {
            const path = err.path.join('.');
            newErrors[path] = err.message;
          });
          setErrors(newErrors);
          setIsValid(false);
        }
      }
    }, debounceMs);
  }, [schema, debounceMs]);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    errors,
    isValid,
    validateData
  };
};

// Utilitaires de validation
export const validationUtils = {
  // Validation d'email marocain
  isValidMoroccanEmail: (email: string): boolean => {
    const moroccanEmailRegex = /^[^\s@]+@[^\s@]+\.(ma|com|org|net)$/i;
    return moroccanEmailRegex.test(email);
  },

  // Validation de téléphone marocain
  isValidMoroccanPhone: (phone: string): boolean => {
    const moroccanPhoneRegex = /^(\+212|0)[5-7][0-9]{8}$/;
    return moroccanPhoneRegex.test(phone.replace(/\s/g, ''));
  },

  // Validation de numéro ICE
  isValidICE: (ice: string): boolean => {
    const iceRegex = /^[0-9]{15}$/;
    return iceRegex.test(ice);
  },

  // Validation de numéro IF
  isValidIF: (ifNumber: string): boolean => {
    const ifRegex = /^[0-9]{8}$/;
    return ifRegex.test(ifNumber);
  },

  // Validation de numéro RC
  isValidRC: (rc: string): boolean => {
    const rcRegex = /^[0-9]{1,10}$/;
    return rcRegex.test(rc);
  },

  // Validation de CNSS
  isValidCNSS: (cnss: string): boolean => {
    const cnssRegex = /^[0-9]{10}$/;
    return cnssRegex.test(cnss);
  },

  // Validation de montant en MAD
  isValidAmount: (amount: number): boolean => {
    return amount >= 0 && amount <= 10000000 && Number.isFinite(amount);
  },

  // Validation de pourcentage
  isValidPercentage: (percentage: number): boolean => {
    return percentage >= 0 && percentage <= 100 && Number.isFinite(percentage);
  },

  // Validation de SKU
  isValidSKU: (sku: string): boolean => {
    const skuRegex = /^[A-Z0-9-]{3,20}$/;
    return skuRegex.test(sku);
  },

  // Validation de date future
  isFutureDate: (date: Date): boolean => {
    return date > new Date();
  },

  // Validation de plage de dates
  isValidDateRange: (startDate: Date, endDate: Date): boolean => {
    return startDate < endDate;
  }
};

// Types pour l'export
export type ValidationResult<T> = {
  success: boolean;
  data?: T;
  errors?: z.ZodError;
};

export type FieldValidationResult = {
  isValid: boolean;
  error?: string;
};

// Hook pour la validation de fichiers
export const useFileValidation = () => {
  const validateFile = useCallback((
    file: File,
    options: {
      maxSize?: number;
      allowedTypes?: string[];
      maxFiles?: number;
    } = {}
  ): FieldValidationResult => {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB par défaut
      allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
      maxFiles = 5
    } = options;

    // Vérifier la taille
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `Le fichier est trop volumineux. Taille maximale: ${Math.round(maxSize / 1024 / 1024)}MB`
      };
    }

    // Vérifier le type
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `Type de fichier non autorisé. Types acceptés: ${allowedTypes.join(', ')}`
      };
    }

    return { isValid: true };
  }, []);

  const validateFiles = useCallback((
    files: FileList | File[],
    options: {
      maxSize?: number;
      allowedTypes?: string[];
      maxFiles?: number;
    } = {}
  ): FieldValidationResult => {
    const { maxFiles = 5 } = options;
    const fileArray = Array.from(files);

    // Vérifier le nombre de fichiers
    if (fileArray.length > maxFiles) {
      return {
        isValid: false,
        error: `Trop de fichiers sélectionnés. Maximum: ${maxFiles}`
      };
    }

    // Valider chaque fichier
    for (const file of fileArray) {
      const result = validateFile(file, options);
      if (!result.isValid) {
        return result;
      }
    }

    return { isValid: true };
  }, [validateFile]);

  return {
    validateFile,
    validateFiles
  };
};
