import React from 'react';

interface ImportProgressProps {
    status: 'uploading' | 'validating' | 'importing' | 'complete' | 'error' | 'idle';
    message?: string;
}

export const ImportProgress: React.FC<ImportProgressProps> = ({ status, message }) => {
    if (status === 'idle') return null;

    const getStatusColor = () => {
        switch (status) {
            case 'complete': return 'bg-green-600';
            case 'error': return 'bg-red-600';
            default: return 'bg-blue-600';
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'uploading': return 'Uploading file...';
            case 'validating': return 'Validating data...';
            case 'importing': return 'Importing records...';
            case 'complete': return 'Import Complete!';
            case 'error': return 'Error Occurred';
            default: return 'Processing...';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-sm w-full mx-4 text-center">
                <div className="mb-4 flex justify-center">
                    {status === 'complete' ? (
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                            <span className="material-symbols-rounded text-2xl">check</span>
                        </div>
                    ) : status === 'error' ? (
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                            <span className="material-symbols-rounded text-2xl">error</span>
                        </div>
                    ) : (
                        <div className="w-12 h-12 text-blue-600 flex items-center justify-center animate-spin">
                            <span className="material-symbols-rounded text-4xl">progress_activity</span>
                        </div>
                    )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {getStatusText()}
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    {message || 'Please wait while we process your request.'}
                </p>

                {status !== 'complete' && status !== 'error' && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
                        <div
                            className={`h-2.5 rounded-full ${getStatusColor()} animate-progress-indeterminate`}
                            style={{ width: '100%' }}
                        ></div>
                    </div>
                )}
            </div>
        </div>
    );
};
