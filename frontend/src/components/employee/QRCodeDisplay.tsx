/**
 * QR Code Display Component
 * Displays QR code for employee with download option
 */

import React, { useState, useEffect } from 'react';
import { employeeService } from '../../services/employee.service';

interface QRCodeDisplayProps {
    employeeId: string;
    nik: string;
    size?: number;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
    employeeId,
    nik,
    size = 160
}) => {
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQRCode = async () => {
            setLoading(true);
            setError(null);
            try {
                const base64 = await employeeService.getEmployeeQRCodeBase64(employeeId);
                // Ensure the string is a data URL for img src
                const dataUrl = base64.startsWith('data:image')
                    ? base64
                    : `data:image/png;base64,${base64}`;
                setQrCode(dataUrl);
            } catch (err) {
                console.error('Error fetching QR code:', err);
                setError('Gagal memuat QR Code');
            } finally {
                setLoading(false);
            }
        };

        if (employeeId) {
            fetchQRCode();
        }
    }, [employeeId]);

    const handleDownload = () => {
        if (!qrCode) return;

        const link = document.createElement('a');
        link.href = qrCode;
        link.download = `qrcode-${nik}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div
                    className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg"
                    style={{ width: size, height: size }}
                />
                <div className="mt-3 h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div
                    className="flex items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-lg"
                    style={{ width: size, height: size }}
                >
                    <span className="material-symbols-rounded text-red-500 text-4xl">error</span>
                </div>
                <p className="mt-3 text-sm text-red-500 dark:text-red-400">{error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div
                className="bg-white p-2 rounded-lg shadow-inner border border-gray-100"
                style={{ width: size + 16, height: size + 16 }}
            >
                {qrCode && (
                    <img
                        src={qrCode}
                        alt={`QR Code for ${nik}`}
                        className="w-full h-full object-contain"
                    />
                )}
            </div>

            <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                NIK: {nik}
            </p>

            <button
                onClick={handleDownload}
                className="mt-3 flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
            >
                <span className="material-symbols-rounded text-lg">file_download</span>
                Unduh QR
            </button>
        </div>
    );
};

export default QRCodeDisplay;
