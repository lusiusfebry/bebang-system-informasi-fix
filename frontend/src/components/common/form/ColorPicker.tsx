/**
 * ColorPicker Component
 * Color picker with hex input and preview (untuk Tag)
 */

import React, { useState, useEffect } from 'react';

interface ColorPickerProps {
    label: string;
    value: string;
    onChange: (color: string) => void;
    error?: string;
    helperText?: string;
    required?: boolean;
    disabled?: boolean;
}

// Preset colors for quick selection
const presetColors = [
    '#EF4444', // red
    '#F97316', // orange
    '#F59E0B', // amber
    '#EAB308', // yellow
    '#84CC16', // lime
    '#22C55E', // green
    '#14B8A6', // teal
    '#06B6D4', // cyan
    '#3B82F6', // blue
    '#6366F1', // indigo
    '#8B5CF6', // violet
    '#A855F7', // purple
    '#EC4899', // pink
    '#6B7280', // gray
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
    label,
    value,
    onChange,
    error,
    helperText,
    required,
    disabled = false,
}) => {
    const [hexValue, setHexValue] = useState(value || '#3B82F6');

    useEffect(() => {
        if (value) {
            setHexValue(value);
        }
    }, [value]);

    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = e.target.value.toUpperCase();
        // Ensure it starts with #
        if (!newValue.startsWith('#')) {
            newValue = '#' + newValue;
        }
        setHexValue(newValue);

        // Only call onChange if it's a valid hex color
        if (/^#[0-9A-F]{6}$/i.test(newValue)) {
            onChange(newValue);
        }
    };

    const handleColorSelect = (color: string) => {
        if (!disabled) {
            setHexValue(color);
            onChange(color);
        }
    };

    const handleNativePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const color = e.target.value.toUpperCase();
        setHexValue(color);
        onChange(color);
    };

    return (
        <div className="w-full">
            <label className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            <div className="flex items-center gap-3">
                {/* Color preview with native picker */}
                <div className="relative">
                    <div
                        className={`w-10 h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 
                            overflow-hidden cursor-pointer transition-transform hover:scale-105
                            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        style={{ backgroundColor: hexValue }}
                    >
                        <input
                            type="color"
                            value={hexValue}
                            onChange={handleNativePickerChange}
                            disabled={disabled}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                </div>

                {/* Hex input */}
                <input
                    type="text"
                    value={hexValue}
                    onChange={handleHexChange}
                    disabled={disabled}
                    maxLength={7}
                    placeholder="#000000"
                    className={`flex-1 px-4 py-2.5 text-sm border rounded-lg transition-colors font-mono uppercase
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                        placeholder-gray-500 dark:placeholder-gray-400
                        ${error
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                        }
                        focus:ring-2 focus:outline-none
                        disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed`}
                />
            </div>

            {/* Preset colors */}
            <div className="mt-3 flex flex-wrap gap-2">
                {presetColors.map((color) => (
                    <button
                        key={color}
                        type="button"
                        onClick={() => handleColorSelect(color)}
                        disabled={disabled}
                        className={`w-6 h-6 rounded border-2 transition-transform hover:scale-110
                            disabled:opacity-50 disabled:cursor-not-allowed
                            ${hexValue === color
                                ? 'border-gray-900 dark:border-white ring-2 ring-offset-1 ring-blue-500'
                                : 'border-transparent'}`}
                        style={{ backgroundColor: color }}
                        title={color}
                    />
                ))}
            </div>

            {/* Tag preview */}
            <div className="mt-3">
                <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Preview:</span>
                <span
                    className="inline-block px-3 py-1 text-sm font-medium rounded-full text-white"
                    style={{ backgroundColor: hexValue }}
                >
                    Tag Preview
                </span>
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

export default ColorPicker;
