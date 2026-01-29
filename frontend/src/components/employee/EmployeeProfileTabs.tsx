/**
 * Employee Profile Tabs Component
 * Tab navigation for employee profile sections
 */

import React from 'react';
import { Link } from 'react-router-dom';

interface EmployeeProfileTabsProps {
    activeTab: string;
    employeeId: string;
}

interface Tab {
    id: string;
    label: string;
    icon: string;
}

const tabs: Tab[] = [
    { id: 'personal-info', label: 'Informasi Pribadi', icon: 'person' },
    { id: 'hr-info', label: 'Informasi Kepegawaian', icon: 'badge' },
    { id: 'family-info', label: 'Informasi Keluarga', icon: 'family_restroom' },
];

export const EmployeeProfileTabs: React.FC<EmployeeProfileTabsProps> = ({
    activeTab,
    employeeId,
}) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mt-6">
            <div className="overflow-x-auto">
                <nav className="flex border-b border-gray-200 dark:border-gray-700" aria-label="Tabs">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        const href = `/hr/employees/${employeeId}/${tab.id}`;

                        return (
                            <Link
                                key={tab.id}
                                to={href}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${isActive
                                    ? 'border-primary text-primary dark:text-primary-light'
                                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                <span className="material-symbols-rounded text-lg">{tab.icon}</span>
                                {tab.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};

export default EmployeeProfileTabs;
