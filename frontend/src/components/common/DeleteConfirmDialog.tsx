/**
 * DeleteConfirmDialog Component
 * Dialog konfirmasi untuk delete action
 */

import React from 'react';
import Modal from './Modal';

interface DeleteConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName?: string;
    loading?: boolean;
    title?: string;
    message?: string;
    confirmLabel?: string;
    confirmVariant?: 'danger' | 'warning';
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    itemName,
    loading = false,
    title = 'Konfirmasi Hapus',
    message,
    confirmLabel = 'Hapus',
    confirmVariant = 'danger'
}) => {
    const handleConfirm = () => {
        onConfirm();
    };

    const isDanger = confirmVariant === 'danger';
    const buttonColorClass = isDanger
        ? 'bg-red-600 hover:bg-red-700 focus:ring-red-200'
        : 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-200';
    const iconColorClass = isDanger
        ? 'text-red-600 dark:text-red-400'
        : 'text-yellow-600 dark:text-yellow-400';
    const iconBgClass = isDanger
        ? 'bg-red-100 dark:bg-red-900/30'
        : 'bg-yellow-100 dark:bg-yellow-900/30';

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
            footer={
                <div className="flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                            bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                            rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 
                            disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={loading}
                        className={`px-4 py-2 text-sm font-medium text-white 
                            rounded-lg focus:ring-4 
                            disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                            inline-flex items-center gap-2 ${buttonColorClass}`}
                    >
                        {loading && (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                        )}
                        {loading ? 'Memproses...' : confirmLabel}
                    </button>
                </div>
            }
        >
            <div className="flex flex-col items-center gap-4 py-4">
                {/* Warning Icon */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBgClass}`}>
                    <svg
                        className={`w-6 h-6 ${iconColorClass}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>

                {/* Message */}
                <div className="text-center">
                    <p className="text-gray-900 dark:text-white">
                        {message ? message : (
                            <>
                                Apakah Anda yakin ingin menghapus{' '}
                                <span className="font-semibold">{itemName}</span>?
                            </>
                        )}
                    </p>
                    {!message && (
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Data akan dinonaktifkan dan tidak dapat digunakan lagi.
                        </p>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default DeleteConfirmDialog;
