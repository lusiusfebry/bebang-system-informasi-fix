/**
 * QR Code Utility
 * Helper functions untuk generate QR code dari data karyawan
 */

import QRCode from 'qrcode';

interface QRCodeOptions {
    width?: number;
    margin?: number;
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

const defaultOptions: QRCodeOptions = {
    width: 300,
    margin: 1,
    errorCorrectionLevel: 'M',
};

/**
 * Generate QR code as PNG buffer
 */
export async function generateQRCodeBuffer(data: string, options?: QRCodeOptions): Promise<Buffer> {
    const opts = { ...defaultOptions, ...options };
    return QRCode.toBuffer(data, {
        type: 'png',
        width: opts.width,
        margin: opts.margin,
        errorCorrectionLevel: opts.errorCorrectionLevel,
    });
}

/**
 * Generate QR code as base64 string
 */
export async function generateQRCodeBase64(data: string, options?: QRCodeOptions): Promise<string> {
    const opts = { ...defaultOptions, ...options };
    return QRCode.toDataURL(data, {
        type: 'image/png',
        width: opts.width,
        margin: opts.margin,
        errorCorrectionLevel: opts.errorCorrectionLevel,
    });
}

/**
 * Generate QR code as data URL (same as base64 but with prefix)
 */
export async function generateQRCodeDataURL(data: string, options?: QRCodeOptions): Promise<string> {
    return generateQRCodeBase64(data, options);
}
