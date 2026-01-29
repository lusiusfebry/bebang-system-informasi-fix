/**
 * Employee Status Badge Component
 * Badge for displaying employee active/inactive status
 */

import React from 'react';

interface EmployeeStatusBadgeProps {
    status: 'AKTIF' | 'TIDAK_AKTIF';
    size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
};

const dotSizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
};

export const EmployeeStatusBadge: React.FC<EmployeeStatusBadgeProps> = ({
    status,
    size = 'md'
}) => {
    const isActive = status === 'AKTIF';

    const baseClasses = 'inline-flex items-center gap-1.5 rounded-full font-medium';
    const statusClasses = isActive
        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';

    const dotClasses = isActive
        ? 'bg-green-500 dark:bg-green-400'
        : 'bg-red-500 dark:bg-red-400';

    return (
        <span className={`${baseClasses} ${sizeClasses[size]} ${statusClasses}`}>
            <span className={`${dotSizeClasses[size]} ${dotClasses} rounded-full`} />
            {isActive ? 'Aktif' : 'Tidak Aktif'}
        </span>
    );
};

export default EmployeeStatusBadge;
