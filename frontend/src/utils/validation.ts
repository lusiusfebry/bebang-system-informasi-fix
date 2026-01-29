/**
 * Validation Utilities
 * Helper functions for form validation
 */

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
    if (!email) return true; // Optional field
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate phone number (10-15 digits)
 */
export const validatePhone = (phone: string): boolean => {
    if (!phone) return true; // Optional field
    const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate NIK (16 digit numeric)
 */
export const validateNIK = (nik: string): boolean => {
    if (!nik) return true; // Optional field
    const nikRegex = /^[0-9]{16}$/;
    return nikRegex.test(nik);
};

/**
 * Validate NPWP (format: XX.XXX.XXX.X-XXX.XXX or 15 digits)
 */
export const validateNPWP = (npwp: string): boolean => {
    if (!npwp) return true; // Optional field
    // Accept with or without dots/dashes
    const cleanNpwp = npwp.replace(/[.\-\s]/g, '');
    return /^[0-9]{15}$/.test(cleanNpwp);
};

/**
 * Validate BPJS (11 digit numeric)
 */
export const validateBPJS = (bpjs: string): boolean => {
    if (!bpjs) return true; // Optional field
    const bpjsRegex = /^[0-9]{11,13}$/;
    return bpjsRegex.test(bpjs);
};

/**
 * Validate date range (end date must be after start date)
 */
export const validateDateRange = (startDate: string, endDate: string): boolean => {
    if (!startDate || !endDate) return true;
    return new Date(endDate) >= new Date(startDate);
};

/**
 * Validate required field
 */
export const validateRequired = (value: string | null | undefined): boolean => {
    return value !== null && value !== undefined && value.trim() !== '';
};

/**
 * Validate numeric only
 */
export const validateNumeric = (value: string): boolean => {
    if (!value) return true;
    return /^[0-9]+$/.test(value);
};

/**
 * Validate minimum length
 */
export const validateMinLength = (value: string, minLength: number): boolean => {
    if (!value) return true;
    return value.length >= minLength;
};

/**
 * Format date for display (YYYY-MM-DD to DD/MM/YYYY)
 */
export const formatDateDisplay = (isoDate: string | null | undefined): string => {
    if (!isoDate) return '-';
    try {
        const date = new Date(isoDate);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    } catch {
        return isoDate;
    }
};

/**
 * Format phone number for display
 */
export const formatPhoneDisplay = (phone: string | null | undefined): string => {
    if (!phone) return '-';
    return phone;
};

/**
 * Validate non-negative number (>= 0)
 */
export const validateNonNegativeNumber = (value: number | string | undefined): boolean => {
    if (value === undefined || value === '') return true;
    const num = typeof value === 'string' ? parseInt(value, 10) : value;
    return !isNaN(num) && num >= 0;
};

/**
 * Validate date format (YYYY-MM-DD)
 */
export const validateDateFormat = (date: string): boolean => {
    if (!date) return true;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) return false;
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
};

/**
 * Validate bank account number (numeric only, 10-20 digits)
 */
export const validateBankAccount = (accountNumber: string): boolean => {
    if (!accountNumber) return true;
    const cleanNumber = accountNumber.replace(/[\s-]/g, '');
    return /^[0-9]{10,20}$/.test(cleanNumber);
};
