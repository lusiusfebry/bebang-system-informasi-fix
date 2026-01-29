/**
 * DataTable Component
 * Reusable data table with actions, sorting, and loading states
 */

import React from 'react';
import StatusBadge from './StatusBadge';
import type { StatusMaster } from '../../types/hr-master.types';

// Sort direction type
export type SortDirection = 'asc' | 'desc';

// Sort state type
export interface SortState {
    key: string;
    direction: SortDirection;
}

// Column definition
export interface TableColumn<T> {
    header: React.ReactNode;
    accessor: keyof T | string;
    render?: (item: T) => React.ReactNode;
    sortable?: boolean;
    className?: string;
}

interface DataTableProps<T> {
    columns: TableColumn<T>[];
    data: T[];
    loading?: boolean;
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    emptyMessage?: string;
    keyExtractor: (item: T) => string;
    // Sorting props
    sortState?: SortState;
    onSort?: (sort: SortState) => void;
}

// Loading skeleton row
const SkeletonRow: React.FC<{ columns: number }> = ({ columns }) => (
    <tr className="animate-pulse">
        {Array.from({ length: columns }).map((_, index) => (
            <td key={index} className="px-6 py-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </td>
        ))}
        <td className="px-6 py-4">
            <div className="flex gap-2">
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
        </td>
    </tr>
);

// Empty state component
const EmptyState: React.FC<{ message: string; colSpan: number }> = ({ message, colSpan }) => (
    <tr>
        <td colSpan={colSpan} className="px-6 py-12 text-center">
            <div className="flex flex-col items-center gap-3">
                <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                </svg>
                <p className="text-gray-500 dark:text-gray-400">{message}</p>
            </div>
        </td>
    </tr>
);

// Sort icon component
const SortIcon: React.FC<{ direction?: SortDirection; isActive: boolean }> = ({ direction, isActive }) => (
    <span className={`ml-1 inline-flex ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
        {!isActive || !direction ? (
            // Default sort icon (both arrows)
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
        ) : direction === 'asc' ? (
            // Ascending icon
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
        ) : (
            // Descending icon
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        )}
    </span>
);

// Helper function to get nested property
const getNestedValue = <T,>(obj: T, path: string): unknown => {
    const keys = path.split('.');
    let value: unknown = obj;
    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = (value as Record<string, unknown>)[key];
        } else {
            return undefined;
        }
    }
    return value;
};

// Helper type to check if type has status property
type WithStatus = { status?: StatusMaster };

export function DataTable<T>({
    columns,
    data,
    loading = false,
    onEdit,
    onDelete,
    emptyMessage = 'Tidak ada data',
    keyExtractor,
    sortState,
    onSort,
}: DataTableProps<T>) {
    const totalColumns = columns.length + (onEdit || onDelete ? 1 : 0);

    // Helper to check if item has status
    const hasStatus = (item: T): item is T & WithStatus => {
        return 'status' in (item as object);
    };

    // Handle sort click
    const handleSortClick = (column: TableColumn<T>) => {
        if (!column.sortable || !onSort) return;

        const key = column.accessor as string;
        let direction: SortDirection = 'asc';

        // Toggle direction if already sorted by this column
        if (sortState?.key === key) {
            direction = sortState.direction === 'asc' ? 'desc' : 'asc';
        }

        onSort({ key, direction });
    };

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                {/* Table Header */}
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        {columns.map((column, index) => {
                            const isSortable = column.sortable && onSort;
                            const isActive = sortState?.key === column.accessor;

                            return (
                                <th
                                    key={index}
                                    scope="col"
                                    onClick={() => isSortable && handleSortClick(column)}
                                    className={`px-6 py-3 text-left text-xs font-semibold text-gray-600 
                                        dark:text-gray-300 uppercase tracking-wider ${column.className || ''}
                                        ${isSortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none transition-colors' : ''}`}
                                >
                                    <div className="flex items-center">
                                        {column.header}
                                        {isSortable && (
                                            <SortIcon
                                                direction={isActive ? sortState?.direction : undefined}
                                                isActive={isActive}
                                            />
                                        )}
                                    </div>
                                </th>
                            );
                        })}
                        {(onEdit || onDelete) && (
                            <th
                                scope="col"
                                className="px-6 py-3 text-center text-xs font-semibold text-gray-600 
                                    dark:text-gray-300 uppercase tracking-wider w-28"
                            >
                                Aksi
                            </th>
                        )}
                    </tr>
                </thead>

                {/* Table Body */}
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {loading ? (
                        // Loading skeleton
                        Array.from({ length: 5 }).map((_, index) => (
                            <SkeletonRow key={index} columns={columns.length} />
                        ))
                    ) : data.length === 0 ? (
                        // Empty state
                        <EmptyState message={emptyMessage} colSpan={totalColumns} />
                    ) : (
                        // Data rows
                        data.map((item) => (
                            <tr
                                key={keyExtractor(item)}
                                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            >
                                {columns.map((column, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className={`px-6 py-4 text-sm text-gray-900 dark:text-gray-100 ${column.className || ''}`}
                                    >
                                        {column.render ? (
                                            column.render(item)
                                        ) : column.accessor === 'status' && hasStatus(item) && item.status ? (
                                            <StatusBadge status={item.status} />
                                        ) : (
                                            String(getNestedValue(item, column.accessor as string) ?? '-')
                                        )}
                                    </td>
                                ))}

                                {/* Action buttons */}
                                {(onEdit || onDelete) && (
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <div className="flex items-center justify-center gap-2">
                                            {onEdit && (
                                                <button
                                                    onClick={() => onEdit(item)}
                                                    className="p-1.5 text-blue-600 hover:text-blue-800 
                                                        dark:text-blue-400 dark:hover:text-blue-300
                                                        hover:bg-blue-100 dark:hover:bg-blue-900/30 
                                                        rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                        />
                                                    </svg>
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={() => onDelete(item)}
                                                    className="p-1.5 text-red-600 hover:text-red-800 
                                                        dark:text-red-400 dark:hover:text-red-300
                                                        hover:bg-red-100 dark:hover:bg-red-900/30 
                                                        rounded-lg transition-colors"
                                                    title="Hapus"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                        />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default DataTable;
