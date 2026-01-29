import React, { useState } from 'react';

interface ImportErrorDisplayProps {
    errors: { row: number; errors: string[] }[];
    totalRows: number;
    validRows: number;
    invalidRows: number;
}

export const ImportErrorDisplay: React.FC<ImportErrorDisplayProps> = ({
    errors,
    totalRows,
    validRows,
    invalidRows
}) => {
    const [expanded, setExpanded] = useState<boolean>(true);

    const downloadErrorLog = () => {
        // Simple CSV generation for errors
        const headers = ['Row_Number', 'Error_Message'];
        const rows = errors.flatMap(err =>
            err.errors.map(msg => `${err.row},"${msg.replace(/"/g, '""')}"`)
        );

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'import_errors.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (totalRows === 0) return null;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <span className="material-symbols-rounded text-blue-500 mr-2">error</span>
                Validation Summary
            </h3>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Total Rows</div>
                    <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{totalRows}</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="text-sm text-green-600 dark:text-green-400 flex items-center">
                        <span className="material-symbols-rounded text-sm mr-1">check_circle</span> Valid Rows
                    </div>
                    <div className="text-2xl font-semibold text-green-700 dark:text-green-300">{validRows}</div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="text-sm text-red-600 dark:text-red-400 flex items-center">
                        <span className="material-symbols-rounded text-sm mr-1">cancel</span> Invalid Rows
                    </div>
                    <div className="text-2xl font-semibold text-red-700 dark:text-red-300">{invalidRows}</div>
                </div>
            </div>

            {invalidRows > 0 && (
                <div className="border rounded-md border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div
                        className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        onClick={() => setExpanded(!expanded)}
                    >
                        <div className="flex items-center space-x-2">
                            <span className="material-symbols-rounded text-gray-600 dark:text-gray-300">
                                {expanded ? 'expand_more' : 'chevron_right'}
                            </span>
                            <span className="font-medium text-gray-700 dark:text-gray-200">
                                Detailed Error Log ({errors.length} rows)
                            </span>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); downloadErrorLog(); }}
                            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                        >
                            <span className="material-symbols-rounded text-sm mr-1">download</span>
                            Download CSV
                        </button>
                    </div>

                    {expanded && (
                        <div className="max-h-60 overflow-y-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24">
                                            Row #
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Issues Found
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {errors.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {item.row}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-red-600 dark:text-red-400">
                                                <ul className="list-disc pl-4 space-y-1">
                                                    {item.errors.map((err, i) => (
                                                        <li key={i}>{err}</li>
                                                    ))}
                                                </ul>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
