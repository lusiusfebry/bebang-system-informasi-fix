/**
 * File Upload Configuration
 * Multer configuration for employee photos and documents
 */

import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directories exist
const UPLOAD_BASE_DIR = process.env.UPLOAD_DIR || 'uploads';
const EMPLOYEE_PHOTO_DIR = path.join(UPLOAD_BASE_DIR, 'employees', 'photos');
const EMPLOYEE_DOC_DIR = path.join(UPLOAD_BASE_DIR, 'employees', 'documents');

// Create directories if they don't exist
[EMPLOYEE_PHOTO_DIR, EMPLOYEE_DOC_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Storage configuration for employee photos
const photoStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, EMPLOYEE_PHOTO_DIR);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `photo-${uniqueSuffix}${ext}`);
    }
});

// Storage configuration for employee documents
const documentStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, EMPLOYEE_DOC_DIR);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `doc-${uniqueSuffix}${ext}`);
    }
});

// File filter for images
const imageFileFilter = (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const allowedTypes = (process.env.ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/jpg').split(',');
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipe file tidak diizinkan. Hanya JPEG, PNG, JPG yang diperbolehkan.'));
    }
};

// File filter for documents
const documentFileFilter = (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const allowedTypes = (process.env.ALLOWED_DOCUMENT_TYPES || 'application/pdf').split(',');
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipe file tidak diizinkan. Hanya PDF dan dokumen Word yang diperbolehkan.'));
    }
};

// Multer instances
export const uploadEmployeePhoto = multer({
    storage: photoStorage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880') // 5MB default
    }
});

export const uploadEmployeeDocument = multer({
    storage: documentStorage,
    fileFilter: documentFileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880') // 5MB default
    }
});

// Helper function to get file URL
export const getFileUrl = (filePath: string): string => {
    return `/uploads/${filePath.replace(/\\/g, '/')}`;
};

// Helper function to delete file
export const deleteFile = (filePath: string): void => {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
    }
};

// Helper function to get relative path for storage in DB
export const getRelativePath = (absolutePath: string): string => {
    return path.relative(process.cwd(), absolutePath);
};

// Export directories for reference
export const UPLOAD_DIRS = {
    BASE: UPLOAD_BASE_DIR,
    EMPLOYEE_PHOTOS: EMPLOYEE_PHOTO_DIR,
    EMPLOYEE_DOCUMENTS: EMPLOYEE_DOC_DIR,
};
