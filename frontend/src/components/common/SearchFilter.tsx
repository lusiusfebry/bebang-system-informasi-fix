/**
 * SearchFilter Component
 * Search input with status filter dropdown
 */

import React, { useState, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import type { StatusMaster } from '../../types/hr-master.types';

interface SearchFilterProps {
    onSearch: (search: string) => void;
    onFilterStatus?: (status: StatusMaster | '') => void;
    placeholder?: string;
    showStatusFilter?: boolean;
    initialSearch?: string;
    initialStatus?: StatusMaster | '';
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
    onSearch,
    onFilterStatus,
    placeholder = 'Cari...',
    showStatusFilter = true,
    initialSearch = '',
    initialStatus = '',
}) => {
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [status, setStatus] = useState<StatusMaster | ''>(initialStatus);
    const debouncedSearch = useDebounce(searchTerm, 300);

    // Trigger search on debounced value change
    useEffect(() => {
        onSearch(debouncedSearch);
    }, [debouncedSearch, onSearch]);

    // Handle status change
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as StatusMaster | '';
        setStatus(newStatus);
        if (onFilterStatus) {
            onFilterStatus(newStatus);
        }
    };

    // Clear search
    const handleClear = () => {
        setSearchTerm('');
        onSearch('');
    };

    return (
        <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 dark:border-gray-600 
                        rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                        placeholder-gray-500 dark:placeholder-gray-400
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                {searchTerm && (
                    <button
                        onClick={handleClear}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center 
                            text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        aria-label="Clear search"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                )}
            </div>

            {/* Status Filter */}
            {showStatusFilter && onFilterStatus && (
                <select
                    value={status}
                    onChange={handleStatusChange}
                    className="px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 
                        rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                        min-w-[150px] cursor-pointer transition-colors"
                >
                    <option value="">Semua Status</option>
                    <option value="AKTIF">Aktif</option>
                    <option value="TIDAK_AKTIF">Tidak Aktif</option>
                </select>
            )}
        </div>
    );
};

export default SearchFilter;
