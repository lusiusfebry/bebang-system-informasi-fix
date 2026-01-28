/**
 * Select Component
 * Reusable select dropdown with label and error handling
 */

import React from 'react';

export interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
    label: string;
    options: SelectOption[];
    error?: string;
    helperText?: string;
    placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
    label,
    options,
    error,
    helperText,
    placeholder = 'Pilih...',
    id,
    className = '',
    required,
    ...props
}) => {
    const selectId = id || `select-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
        <div className="w-full">
            <label
                htmlFor={selectId}
                className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
                {...props}
                id={selectId}
                required={required}
                className={`w-full px-4 py-2.5 text-sm border rounded-lg transition-colors cursor-pointer
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                    ${error
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                    }
                    focus:ring-2 focus:outline-none
                    disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed
                    ${className}`}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-1 text-xs text-red-500">{error}</p>
            )}
            {helperText && !error && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helperText}</p>
            )}
        </div>
    );
};

export default Select;
