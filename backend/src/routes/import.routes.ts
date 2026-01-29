import { Router } from 'express';
import { importController } from '../controllers/import.controller';
import { uploadExcelFile } from '../config/upload';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Employee Import
 *   description: Import karyawan dari Excel
 */

// Base path: /api/hr/import

/**
 * @swagger
 * /api/hr/import/template:
 *   get:
 *     summary: Download import template
 *     tags: [Employee Import]
 *     responses:
 *       200:
 *         description: Excel template file
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get(
    '/template',
    authenticate,
    importController.downloadTemplate
);

/**
 * @swagger
 * /api/hr/import/upload:
 *   post:
 *     summary: Upload and preview Excel file
 *     tags: [Employee Import]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Preview data and validation results
 */
router.post(
    '/upload',
    authenticate,
    // authorize(['ADMIN', 'HR_MANAGER']), // Role based access if needed
    uploadExcelFile.single('file'),
    importController.uploadAndPreviewExcel
);

/**
 * @swagger
 * /api/hr/import/confirm:
 *   post:
 *     summary: Confirm and execute import
 *     tags: [Employee Import]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filePath:
 *                 type: string
 *     responses:
 *       200:
 *         description: Import success result
 */
router.post(
    '/confirm',
    authenticate,
    // authorize(['ADMIN', 'HR_MANAGER']),
    importController.confirmImport
);

export default router;
