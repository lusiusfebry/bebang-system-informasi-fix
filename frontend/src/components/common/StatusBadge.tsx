/**
 * StatusBadge Component
 * Badge untuk menampilkan status Aktif/Tidak Aktif
 */

import React from 'react';
import type { StatusMaster } from '../../types/hr-master.types';

interface StatusBadgeProps {
    status: StatusMaster;
    size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
    const isActive = status === 'AKTIF';

    return (
        <span
            className={`inline-flex items-center font-medium rounded-full
                ${sizeClasses[size]}
                ${isActive
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}
        >
            <span
                className={`w-1.5 h-1.5 rounded-full mr-1.5
                    ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}
            />
            {isActive ? 'Aktif' : 'Tidak Aktif'}
        </span>
    );
};

export default StatusBadge;
