import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { z } from 'zod';
import { useValidation, useFormValidation, validationUtils } from '../use-validation';

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('useValidation', () => {
  const testSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email'),
    age: z.number().min(18, 'Must be at least 18'),
  });

  it('validates correct data successfully', () => {
    const { result } = renderHook(() => useValidation(testSchema));
    
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      age: 25,
    };

    const isValid = result.current.validate(validData);
    expect(isValid).toBe(true);
  });

  it('returns false for invalid data', () => {
    const { result } = renderHook(() => useValidation(testSchema));
    
    const invalidData = {
      name: 'J', // Too short
      email: 'invalid-email',
      age: 16, // Too young
    };

    const isValid = result.current.validate(invalidData);
    expect(isValid).toBe(false);
  });

  it('validates async data successfully', async () => {
    const { result } = renderHook(() => useValidation(testSchema));
    
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      age: 25,
    };

    const validatedData = await result.current.validateAsync(validData);
    expect(validatedData).toEqual(validData);
  });

  it('returns null for invalid async data', async () => {
    const { result } = renderHook(() => useValidation(testSchema));
    
    const invalidData = {
      name: 'J',
      email: 'invalid-email',
      age: 16,
    };

    const validatedData = await result.current.validateAsync(invalidData);
    expect(validatedData).toBeNull();
  });

  it('returns errors for invalid data', () => {
    const { result } = renderHook(() => useValidation(testSchema));
    
    const invalidData = {
      name: 'J',
      email: 'invalid-email',
      age: 16,
    };

    const errors = result.current.getErrors(invalidData);
    expect(errors).toBeInstanceOf(z.ZodError);
    expect(errors?.errors).toHaveLength(3);
  });
});

describe('useFormValidation', () => {
  const fieldSchema = z.string().min(2, 'Must be at least 2 characters');
  const formSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email'),
  });

  it('validates field successfully', () => {
    const { result } = renderHook(() => useFormValidation());
    
    const error = result.current.validateField('John', fieldSchema);
    expect(error).toBeNull();
  });

  it('returns error for invalid field', () => {
    const { result } = renderHook(() => useFormValidation());
    
    const error = result.current.validateField('J', fieldSchema);
    expect(error).toBe('Must be at least 2 characters');
  });

  it('validates form successfully', () => {
    const { result } = renderHook(() => useFormValidation());
    
    const formData = {
      name: 'John Doe',
      email: 'john@example.com',
    };

    const errors = result.current.validateForm(formData, formSchema);
    expect(errors).toEqual({});
  });

  it('returns errors for invalid form', () => {
    const { result } = renderHook(() => useFormValidation());
    
    const formData = {
      name: 'J',
      email: 'invalid-email',
    };

    const errors = result.current.validateForm(formData, formSchema);
    expect(errors).toHaveProperty('name');
    expect(errors).toHaveProperty('email');
    expect(errors.name).toBe('Name must be at least 2 characters');
    expect(errors.email).toBe('Invalid email');
  });
});

describe('validationUtils', () => {
  describe('isValidMoroccanEmail', () => {
    it('validates Moroccan emails correctly', () => {
      expect(validationUtils.isValidMoroccanEmail('test@example.ma')).toBe(true);
      expect(validationUtils.isValidMoroccanEmail('test@example.com')).toBe(true);
      expect(validationUtils.isValidMoroccanEmail('test@example.org')).toBe(true);
      expect(validationUtils.isValidMoroccanEmail('test@example.net')).toBe(true);
    });

    it('rejects invalid emails', () => {
      expect(validationUtils.isValidMoroccanEmail('invalid-email')).toBe(false);
      expect(validationUtils.isValidMoroccanEmail('test@')).toBe(false);
      expect(validationUtils.isValidMoroccanEmail('@example.ma')).toBe(false);
    });
  });

  describe('isValidMoroccanPhone', () => {
    it('validates Moroccan phone numbers correctly', () => {
      expect(validationUtils.isValidMoroccanPhone('+212612345678')).toBe(true);
      expect(validationUtils.isValidMoroccanPhone('0612345678')).toBe(true);
      expect(validationUtils.isValidMoroccanPhone('+212 6 12 34 56 78')).toBe(true);
    });

    it('rejects invalid phone numbers', () => {
      expect(validationUtils.isValidMoroccanPhone('123456789')).toBe(false);
      expect(validationUtils.isValidMoroccanPhone('+33612345678')).toBe(false);
      expect(validationUtils.isValidMoroccanPhone('0812345678')).toBe(false); // Invalid prefix
    });
  });

  describe('isValidICE', () => {
    it('validates ICE numbers correctly', () => {
      expect(validationUtils.isValidICE('123456789012345')).toBe(true);
    });

    it('rejects invalid ICE numbers', () => {
      expect(validationUtils.isValidICE('12345678901234')).toBe(false); // Too short
      expect(validationUtils.isValidICE('1234567890123456')).toBe(false); // Too long
      expect(validationUtils.isValidICE('12345678901234a')).toBe(false); // Contains letter
    });
  });

  describe('isValidIF', () => {
    it('validates IF numbers correctly', () => {
      expect(validationUtils.isValidIF('12345678')).toBe(true);
    });

    it('rejects invalid IF numbers', () => {
      expect(validationUtils.isValidIF('1234567')).toBe(false); // Too short
      expect(validationUtils.isValidIF('123456789')).toBe(false); // Too long
      expect(validationUtils.isValidIF('1234567a')).toBe(false); // Contains letter
    });
  });

  describe('isValidRC', () => {
    it('validates RC numbers correctly', () => {
      expect(validationUtils.isValidRC('123456')).toBe(true);
      expect(validationUtils.isValidRC('1234567890')).toBe(true);
    });

    it('rejects invalid RC numbers', () => {
      expect(validationUtils.isValidRC('12345678901')).toBe(false); // Too long
      expect(validationUtils.isValidRC('12345a')).toBe(false); // Contains letter
    });
  });

  describe('isValidCNSS', () => {
    it('validates CNSS numbers correctly', () => {
      expect(validationUtils.isValidCNSS('1234567890')).toBe(true);
    });

    it('rejects invalid CNSS numbers', () => {
      expect(validationUtils.isValidCNSS('123456789')).toBe(false); // Too short
      expect(validationUtils.isValidCNSS('12345678901')).toBe(false); // Too long
      expect(validationUtils.isValidCNSS('123456789a')).toBe(false); // Contains letter
    });
  });

  describe('isValidAmount', () => {
    it('validates amounts correctly', () => {
      expect(validationUtils.isValidAmount(0)).toBe(true);
      expect(validationUtils.isValidAmount(100.50)).toBe(true);
      expect(validationUtils.isValidAmount(9999999)).toBe(true);
    });

    it('rejects invalid amounts', () => {
      expect(validationUtils.isValidAmount(-1)).toBe(false);
      expect(validationUtils.isValidAmount(10000001)).toBe(false);
      expect(validationUtils.isValidAmount(Infinity)).toBe(false);
      expect(validationUtils.isValidAmount(NaN)).toBe(false);
    });
  });

  describe('isValidPercentage', () => {
    it('validates percentages correctly', () => {
      expect(validationUtils.isValidPercentage(0)).toBe(true);
      expect(validationUtils.isValidPercentage(50.5)).toBe(true);
      expect(validationUtils.isValidPercentage(100)).toBe(true);
    });

    it('rejects invalid percentages', () => {
      expect(validationUtils.isValidPercentage(-1)).toBe(false);
      expect(validationUtils.isValidPercentage(101)).toBe(false);
      expect(validationUtils.isValidPercentage(Infinity)).toBe(false);
    });
  });

  describe('isValidSKU', () => {
    it('validates SKUs correctly', () => {
      expect(validationUtils.isValidSKU('ABC-123')).toBe(true);
      expect(validationUtils.isValidSKU('PROD-001-XL')).toBe(true);
      expect(validationUtils.isValidSKU('SKU123')).toBe(true);
    });

    it('rejects invalid SKUs', () => {
      expect(validationUtils.isValidSKU('ab')).toBe(false); // Too short
      expect(validationUtils.isValidSKU('abc-123')).toBe(false); // Lowercase
      expect(validationUtils.isValidSKU('ABC_123')).toBe(false); // Underscore not allowed
      expect(validationUtils.isValidSKU('ABC 123')).toBe(false); // Space not allowed
    });
  });

  describe('isFutureDate', () => {
    it('validates future dates correctly', () => {
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // Tomorrow
      expect(validationUtils.isFutureDate(futureDate)).toBe(true);
    });

    it('rejects past dates', () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // Yesterday
      expect(validationUtils.isFutureDate(pastDate)).toBe(false);
    });
  });

  describe('isValidDateRange', () => {
    it('validates date ranges correctly', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-02');
      expect(validationUtils.isValidDateRange(startDate, endDate)).toBe(true);
    });

    it('rejects invalid date ranges', () => {
      const startDate = new Date('2024-01-02');
      const endDate = new Date('2024-01-01');
      expect(validationUtils.isValidDateRange(startDate, endDate)).toBe(false);
    });
  });
});
