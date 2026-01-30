import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { importService } from '../../../services/import.service';
import { ImportPreviewResponse, ParsedEmployeeData } from '../../../types/import.types';
import { ImportErrorDisplay } from '../../../components/employee/ImportErrorDisplay';
import { ImportProgress } from '../../../components/employee/ImportProgress';
import { useToast } from '../../../components/common';
import { PermissionGuard } from '../../../components/auth/PermissionGuard';
import { PERMISSIONS } from '../../../constants/permissions';

const EmployeeImportContent: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [file, setFile] = useState<File | null>(null);
    const [previewData, setPreviewData] = useState<ImportPreviewResponse | null>(null);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'validating' | 'importing' | 'complete' | 'error'>('idle');
    const [statusMessage, setStatusMessage] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setPreviewData(null); // Reset preview on new file
        }
    };

    const handleDownloadTemplate = async () => {
        try {
            await importService.downloadTemplate();
            showToast('Template downloaded successfully', 'success');
        } catch {
            showToast('Failed to download template', 'error');
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        try {
            setStatus('uploading');
            setStatusMessage('Uploading and parsing Excel file...');

            const response = await importService.uploadAndPreview(file);

            setPreviewData(response);
            setStatus('idle');

            if (response.data.invalidRows > 0) {
                showToast(`Found ${response.data.invalidRows} invalid rows. Please review errors.`, 'error');
            } else {
                showToast('File validated successfully! Ready to import.', 'success');
            }
        } catch (error: any) {
            setStatus('error');
            setStatusMessage(error.response?.data?.message || 'Failed to upload file');
            setTimeout(() => setStatus('idle'), 2000);
            showToast('Failed to process file', 'error');
        }
    };

    const handleConfirmImport = async () => {
        if (!previewData?.data.tempFilePath) return;

        try {
            setStatus('importing');
            setStatusMessage('Importing valid records to database...');

            const result = await importService.confirmImport(previewData.data.tempFilePath);

            setStatus('complete');
            setStatusMessage(`Successfully imported ${result.data.successCount} employees!`);

            setTimeout(() => {
                navigate('/hr/employees');
            }, 2000);
        } catch (error: any) {
            setStatus('error');
            setStatusMessage(error.response?.data?.message || 'Import failed');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-6">
                <button
                    onClick={() => navigate('/hr/employees')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                    <span className="material-symbols-rounded text-gray-600 dark:text-gray-400">arrow_back</span>
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Import Employees</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Add employees in bulk via Excel upload</p>
                </div>
            </div>

            <ImportProgress status={status} message={statusMessage} />

            <div className="grid md:grid-cols-3 gap-6">
                {/* Left Panel: Upload & Instructions */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">1. Upload File</h2>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Excel File (.xlsx)
                            </label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".xlsx, .xls"
                                className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100
                                    dark:file:bg-blue-900/30 dark:file:text-blue-400
                                "
                            />
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleUpload}
                                disabled={!file || status !== 'idle'}
                                className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="material-symbols-rounded text-sm mr-2">upload</span>
                                Validate & Preview
                            </button>

                            <button
                                onClick={handleDownloadTemplate}
                                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
                            >
                                <span className="material-symbols-rounded text-sm mr-2">download</span>
                                Download Template
                            </button>
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
                        <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center">
                            <span className="material-symbols-rounded text-sm mr-1.5">warning</span>
                            Important Notes
                        </h3>
                        <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1 ml-4 list-disc">
                            <li>Use the provided template for best results.</li>
                            <li>Required fields: <strong>Nama Lengkap, NIK, No. HP</strong>.</li>
                            <li>NIK must be unique (16 digits).</li>
                            <li>Dates should be formatted correctly.</li>
                            <li>Max file size: 10MB.</li>
                        </ul>
                    </div>
                </div>

                {/* Right Panel: Preview */}
                <div className="md:col-span-2">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 min-h-[500px] flex flex-col">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">2. Data Preview</h2>
                        </div>

                        <div className="flex-1 p-6">
                            {!previewData ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                    <span className="material-symbols-rounded text-6xl mb-4 opacity-50">upload_file</span>
                                    <p>Upload a file to see preview</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <ImportErrorDisplay
                                        errors={previewData.data.errors}
                                        totalRows={previewData.data.totalRows}
                                        validRows={previewData.data.validRows}
                                        invalidRows={previewData.data.invalidRows}
                                    />

                                    {previewData.data.validRows > 0 && (
                                        <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg flex items-center justify-between">
                                            <div>
                                                <h4 className="text-green-800 dark:text-green-300 font-medium">Ready to Import</h4>
                                                <p className="text-sm text-green-600 dark:text-green-400">
                                                    {previewData.data.validRows} records passed validation
                                                </p>
                                            </div>
                                            <button
                                                onClick={handleConfirmImport}
                                                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium shadow-sm transition-colors"
                                            >
                                                Import {previewData.data.validRows} Records
                                            </button>
                                        </div>
                                    )}

                                    <div className="overflow-x-auto border rounded-lg border-gray-200 dark:border-gray-700">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                                            <thead className="bg-gray-50 dark:bg-gray-700">
                                                <tr>
                                                    <th className="px-4 py-3 text-left">Row</th>
                                                    <th className="px-4 py-3 text-left">Nama Lengkap</th>
                                                    <th className="px-4 py-3 text-left">NIK</th>
                                                    <th className="px-4 py-3 text-left">Divisi</th>
                                                    <th className="px-4 py-3 text-left">Department</th>
                                                    <th className="px-4 py-3 text-left">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                {previewData.data.preview.slice(0, 10).map((item: ParsedEmployeeData, idx: number) => (
                                                    <tr key={idx} className={item.errors.length > 0 ? 'bg-red-50 dark:bg-red-900/10' : ''}>
                                                        <td className="px-4 py-3 text-gray-500">{item.rowNumber}</td>
                                                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{item.data.namaLengkap}</td>
                                                        <td className="px-4 py-3 text-gray-500">{item.data.nomorIndukKaryawan}</td>
                                                        <td className="px-4 py-3 text-gray-500">{item.data.divisiName || '-'}</td>
                                                        <td className="px-4 py-3 text-gray-500">{item.data.departmentName || '-'}</td>
                                                        <td className="px-4 py-3">
                                                            {item.errors.length > 0 ? (
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                                                    Invalid
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                                    Valid
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {previewData.data.preview.length > 10 && (
                                            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 text-center text-xs text-gray-500">
                                                Showing 10 of {previewData.data.preview.length} rows
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function EmployeeImport() {
    return (
        <PermissionGuard permission={PERMISSIONS.EMPLOYEE_IMPORT} fallback={<div className="p-8 text-center">Access Denied</div>}>
            <EmployeeImportContent />
        </PermissionGuard>
    );
}
