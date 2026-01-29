/**
 * Employee Profile Page
 * Main page for viewing employee profile with tabs
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEmployee } from '../../../hooks/useEmployee';
import { EmployeeProfileHeader, EmployeeProfileTabs, QRCodeDisplay, PersonalInformationTab, HRInformationTab, FamilyInformationTab } from '../../../components/employee';
import { employeeService } from '../../../services/employee.service';

// Allowed tab values
const ALLOWED_TABS = new Set(['personal-info', 'hr-info', 'family-info']);
const DEFAULT_TAB = 'personal-info';

const EmployeeProfile: React.FC = () => {
    const { id, tab: tabParam } = useParams<{ id: string; tab?: string }>();
    const navigate = useNavigate();
    const { employee, loading, error, refetch } = useEmployee(id);
    const [exportLoading, setExportLoading] = useState(false);
    const [exportError, setExportError] = useState<string | null>(null);

    // Normalize tab: use default if invalid
    const tab = tabParam && ALLOWED_TABS.has(tabParam) ? tabParam : DEFAULT_TAB;

    // Redirect to default tab if tab param is invalid
    useEffect(() => {
        if (id && tabParam && !ALLOWED_TABS.has(tabParam)) {
            navigate(`/hr/employees/${id}/${DEFAULT_TAB}`, { replace: true });
        }
    }, [id, tabParam, navigate]);

    const handleEdit = () => {
        if (id) {
            navigate(`/hr/employees/${id}/edit`);
        }
    };

    const handleExportPDF = async () => {
        if (!id || exportLoading) return;

        setExportLoading(true);
        setExportError(null);

        try {
            const response = await employeeService.exportEmployeePDF(id);

            // Create download link from blob
            const url = window.URL.createObjectURL(response);
            const link = document.createElement('a');
            link.href = url;
            link.download = `karyawan-${employee?.nomorIndukKaryawan || id}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error exporting PDF:', err);
            setExportError('Gagal mengekspor PDF. Silakan coba lagi.');
        } finally {
            setExportLoading(false);
        }
    };


    // Loading state
    if (loading) {
        return (
            <div className="container mx-auto max-w-6xl px-4 py-6">
                {/* Header Skeleton */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="w-32 h-32 rounded-xl bg-gray-200 dark:bg-gray-700 mx-auto lg:mx-0" />
                        <div className="flex-1 space-y-4">
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto lg:mx-0" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40 mx-auto lg:mx-0" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto lg:mx-0" />
                        </div>
                    </div>
                </div>

                {/* Tabs Skeleton */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mt-6 p-4 animate-pulse">
                    <div className="flex gap-4">
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-40" />
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-36" />
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !employee) {
        return (
            <div className="container mx-auto max-w-6xl px-4 py-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
                    <span className="material-symbols-rounded text-6xl text-red-500 mb-4">error</span>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {error || 'Karyawan tidak ditemukan'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Data karyawan tidak dapat dimuat. Silakan coba lagi.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={refetch}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors"
                        >
                            Coba Lagi
                        </button>
                        <button
                            onClick={() => navigate('/hr')}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                        >
                            Kembali
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-6xl px-4 py-6">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Content */}
                <div className="flex-1">
                    {/* Header */}
                    <EmployeeProfileHeader
                        employee={employee}
                        onEdit={handleEdit}
                        onExportPDF={handleExportPDF}
                        exportLoading={exportLoading}
                        exportError={exportError}
                    />

                    {/* Tabs */}
                    <EmployeeProfileTabs
                        activeTab={tab}
                        employeeId={employee.id}
                    />

                    {/* Tab Content */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mt-6 p-6">
                        {tab === 'personal-info' && (
                            <PersonalInformationTab
                                employee={employee}
                                onUpdate={refetch}
                            />
                        )}

                        {tab === 'hr-info' && (
                            <HRInformationTab
                                employee={employee}
                                onUpdate={refetch}
                            />
                        )}

                        {tab === 'family-info' && (
                            <FamilyInformationTab
                                employee={employee}
                                onUpdate={refetch}
                            />
                        )}
                    </div>
                </div>

                {/* Sidebar - QR Code */}
                <div className="lg:w-64 lg:sticky lg:top-6 lg:self-start">
                    <QRCodeDisplay
                        employeeId={employee.id}
                        nik={employee.nomorIndukKaryawan}
                        size={180}
                    />
                </div>
            </div>
        </div>
    );
};

export default EmployeeProfile;
