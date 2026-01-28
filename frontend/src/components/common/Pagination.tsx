/**
 * Pagination Component
 * Reusable pagination with page navigation and items per page selector
 */

import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onLimitChange?: (limit: number) => void;
    showLimitSelector?: boolean;
}

const limitOptions = [10, 25, 50, 100];

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    onLimitChange,
    showLimitSelector = true,
}) => {
    // Calculate displayed range
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // Generate page numbers with ellipsis
    const getPageNumbers = (): (number | string)[] => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            if (currentPage > 3) {
                pages.push('...');
            }

            // Show pages around current
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('...');
            }

            // Always show last page
            if (totalPages > 1) {
                pages.push(totalPages);
            }
        }

        return pages;
    };

    if (totalPages === 0) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 
            bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            {/* Info Text */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
                Menampilkan <span className="font-medium">{startItem}</span> -{' '}
                <span className="font-medium">{endItem}</span> dari{' '}
                <span className="font-medium">{totalItems}</span> data
            </div>

            <div className="flex items-center gap-4">
                {/* Limit Selector */}
                {showLimitSelector && onLimitChange && (
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 dark:text-gray-400">
                            Per halaman:
                        </label>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => onLimitChange(Number(e.target.value))}
                            className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 
                                rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {limitOptions.map((limit) => (
                                <option key={limit} value={limit}>
                                    {limit}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Page Navigation */}
                <nav className="flex items-center gap-1" aria-label="Pagination">
                    {/* Previous Button */}
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 
                            dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 
                            rounded-lg disabled:opacity-50 disabled:cursor-not-allowed 
                            disabled:hover:bg-transparent transition-colors"
                        aria-label="Previous page"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Page Numbers */}
                    {getPageNumbers().map((page, index) => (
                        <React.Fragment key={index}>
                            {page === '...' ? (
                                <span className="px-3 py-2 text-gray-500 dark:text-gray-400">...</span>
                            ) : (
                                <button
                                    onClick={() => onPageChange(page as number)}
                                    className={`min-w-[2.5rem] px-3 py-2 text-sm font-medium rounded-lg 
                                        transition-colors ${currentPage === page
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                    aria-current={currentPage === page ? 'page' : undefined}
                                >
                                    {page}
                                </button>
                            )}
                        </React.Fragment>
                    ))}

                    {/* Next Button */}
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 
                            dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 
                            rounded-lg disabled:opacity-50 disabled:cursor-not-allowed 
                            disabled:hover:bg-transparent transition-colors"
                        aria-label="Next page"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default Pagination;
