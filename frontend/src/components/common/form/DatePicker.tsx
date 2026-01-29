/**
 * DatePicker Component
 * Reusable date input field with label and error handling
 */

import React from 'react';

interface DatePickerProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    helperText?: string;
    required?: boolean;
    disabled?: boolean;
    min?: string;
    max?: string;
    id?: string;
    className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
    label,
    value,
    onChange,
    error,
    helperText,
    required = false,
    disabled = false,
    min,
    max,
    id,
    className = '',
}) => {
    const inputId = id || `datepicker-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
        <div className="w-full">
            <label
                htmlFor={inputId}
                className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
                type="date"
                id={inputId}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                min={min}
                max={max}
                disabled={disabled}
                className={`w-full px-4 py-2.5 text-sm border rounded-lg transition-colors
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                    ${error
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                    }
                    focus:ring-2 focus:outline-none
                    disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed
                    ${className}`}
            />
            {error && (
                <p className="mt-1 text-xs text-red-500">{error}</p>
            )}
            {helperText && !error && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helperText}</p>
            )}
        </div>
    );
};

export default DatePicker;
