/**
 * SearchableSelect Component
 * Dropdown with search/filter functionality for master data
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';

export interface SearchableSelectOption {
    value: string;
    label: string;
}

interface SearchableSelectProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: SearchableSelectOption[];
    error?: string;
    helperText?: string;
    disabled?: boolean;
    required?: boolean;
    placeholder?: string;
    loading?: boolean;
    id?: string;
    className?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
    label,
    value,
    onChange,
    options,
    error,
    helperText,
    disabled = false,
    required = false,
    placeholder = 'Pilih...',
    loading = false,
    id,
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const selectId = id || `searchable-select-${label.toLowerCase().replace(/\s+/g, '-')}`;

    // Get selected option label
    const selectedOption = options.find(opt => opt.value === value);
    const displayValue = selectedOption?.label || '';

    // Filter options based on search term
    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus input when dropdown opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleToggle = useCallback(() => {
        if (!disabled) {
            setIsOpen(prev => !prev);
            setSearchTerm('');
        }
    }, [disabled]);

    const handleSelect = useCallback((optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchTerm('');
    }, [onChange]);

    const handleClear = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
    }, [onChange]);

    return (
        <div className={`w-full ${className}`} ref={containerRef}>
            <label
                htmlFor={selectId}
                className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            <div className="relative">
                {/* Selected value button */}
                <button
                    type="button"
                    id={selectId}
                    onClick={handleToggle}
                    disabled={disabled}
                    className={`w-full px-4 py-2.5 text-sm text-left border rounded-lg transition-colors
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                        ${error
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                        }
                        focus:ring-2 focus:outline-none
                        disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed
                        flex items-center justify-between`}
                >
                    <span className={displayValue ? '' : 'text-gray-400 dark:text-gray-500'}>
                        {displayValue || placeholder}
                    </span>
                    <div className="flex items-center gap-1">
                        {value && !disabled && (
                            <span
                                onClick={handleClear}
                                className="material-symbols-rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-lg cursor-pointer"
                            >
                                close
                            </span>
                        )}
                        <span className="material-symbols-rounded text-gray-400 text-lg">
                            {isOpen ? 'expand_less' : 'expand_more'}
                        </span>
                    </div>
                </button>

                {/* Dropdown */}
                {isOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-hidden">
                        {/* Search input */}
                        <div className="p-2 border-b border-gray-200 dark:border-gray-600">
                            <input
                                ref={inputRef}
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Cari..."
                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                                    bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        {/* Options list */}
                        <div className="max-h-48 overflow-y-auto">
                            {loading ? (
                                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                    <span className="material-symbols-rounded animate-spin text-lg">sync</span>
                                    Memuat...
                                </div>
                            ) : filteredOptions.length === 0 ? (
                                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                    {searchTerm ? 'Tidak ditemukan' : 'Tidak ada pilihan'}
                                </div>
                            ) : (
                                filteredOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => handleSelect(option.value)}
                                        className={`w-full px-4 py-2.5 text-sm text-left transition-colors
                                            hover:bg-gray-100 dark:hover:bg-gray-600
                                            ${option.value === value
                                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                                : 'text-gray-900 dark:text-white'
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <p className="mt-1 text-xs text-red-500">{error}</p>
            )}
            {helperText && !error && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helperText}</p>
            )}
        </div>
    );
};

export default SearchableSelect;
