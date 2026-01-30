/**
 * Employee Routes
 * Express router untuk Employee management endpoints dengan Swagger documentation
 */

import { Router } from 'express';
import { authenticate, requirePermissions } from '../middleware/auth.middleware';
import { uploadEmployeePhoto, uploadEmployeeDocument, uploadExcelFile } from '../config/upload';
import {
    getAllKaryawan,
    getKaryawanById,
    getKaryawanByNIK,
    createKaryawan,
    updateKaryawan,
    deleteKaryawan,
    createAnakKaryawan,
    updateAnakKaryawan,
    deleteAnakKaryawan,
    createSaudaraKandungKaryawan,
    updateSaudaraKandungKaryawan,
    deleteSaudaraKandungKaryawan,
    uploadKaryawanPhoto,
    uploadKaryawanDocument,
    deleteKaryawanDocument,
    generateKaryawanQRCode,
    bulkDeleteKaryawan,
    bulkGenerateQRCodes,
    exportKaryawan,
    importEmployees,
} from '../controllers/employee.controller';

const router = Router();

// All routes require authentication
// All routes require authentication but permissions are specific per route

// ==========================================
// Main CRUD Routes
// ==========================================

/**
 * @swagger
 * /api/hr/employees:
 *   get:
 *     summary: Get all karyawan
 *     description: Get paginated list of karyawan with optional filters
 *     tags: [Employee Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by nama, NIK, or email
 *       - in: query
 *         name: divisiId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by divisi ID
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by department ID
 *       - in: query
 *         name: statusKaryawanId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by status karyawan ID
 *       - in: query
 *         name: lokasiKerjaId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by lokasi kerja ID
 *       - in: query
 *         name: tagId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by tag ID
 *       - in: query
 *         name: jenisHubunganKerjaId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by jenis hubungan kerja ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *         description: Items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [namaLengkap, nomorIndukKaryawan, createdAt, tanggalMasuk]
 *           default: namaLengkap
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Paginated list of karyawan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/KaryawanList'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, requirePermissions('employee.read'), getAllKaryawan);


/**
 * @swagger
 * /api/hr/employees/import:
 *   post:
 *     summary: Import employees from Excel
 *     tags: [Employee Management]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         required: true
 *         description: Excel file (.xlsx)
 *     responses:
 *       200:
 *         description: Import result
 */
router.post('/import', authenticate, requirePermissions('employee.create'), uploadExcelFile.single('file'), importEmployees);

/**
 * @swagger
 * /api/hr/employees/export:
 *   get:
 *     summary: Export employees to CSV
 *     tags: [Employee Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: CSV file download
 */
router.get('/export', authenticate, requirePermissions('employee.export'), exportKaryawan);

/**
 * @swagger
 * /api/hr/employees/bulk-delete:
 *   post:
 *     summary: Bulk delete employees
 *     tags: [Employee Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Employees deleted
 */
router.post('/bulk-delete', authenticate, requirePermissions('employee.delete'), bulkDeleteKaryawan);

/**
 * @swagger
 * /api/hr/employees/bulk-qrcode:
 *   post:
 *     summary: Generate QR codes for multiple employees
 *     tags: [Employee Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 description: Array of employee IDs to generate QR codes for
 *     responses:
 *       200:
 *         description: QR codes generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: QR codes generated successfully
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/bulk-qrcode', authenticate, requirePermissions('employee.read'), bulkGenerateQRCodes);

/**
 * @swagger
 * /api/hr/employees/nik/{nik}:
 *   get:
 *     summary: Get karyawan by NIK
 *     tags: [Employee Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: nik
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Karyawan found
 *       404:
 *         description: Karyawan not found
 */
router.get('/nik/:nik', authenticate, requirePermissions('employee.read'), getKaryawanByNIK);

/**
 * @swagger
 * /api/hr/employees/{id}:
 *   get:
 *     summary: Get karyawan by ID
 *     tags: [Employee Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Karyawan found
 *       404:
 *         description: Karyawan not found
 */
router.get('/:id', authenticate, requirePermissions('employee.read'), getKaryawanById);

/**
 * @swagger
 * /api/hr/employees:
 *   post:
 *     summary: Create new karyawan
 *     tags: [Employee Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - namaLengkap
 *               - nomorIndukKaryawan
 *               - nomorHandphone
 *             properties:
 *               namaLengkap:
 *                 type: string
 *               nomorIndukKaryawan:
 *                 type: string
 *               nomorHandphone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Karyawan created
 *       400:
 *         description: Validation error
 */
router.post('/', authenticate, requirePermissions('employee.create'), createKaryawan);

/**
 * @swagger
 * /api/hr/employees/{id}:
 *   put:
 *     summary: Update karyawan
 *     tags: [Employee Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Karyawan updated
 *       404:
 *         description: Karyawan not found
 */
router.put('/:id', authenticate, requirePermissions('employee.update'), updateKaryawan);

/**
 * @swagger
 * /api/hr/employees/{id}:
 *   delete:
 *     summary: Delete karyawan
 *     tags: [Employee Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Karyawan deleted
 *       404:
 *         description: Karyawan not found
 */
router.delete('/:id', authenticate, requirePermissions('employee.delete'), deleteKaryawan);

// ==========================================
// Anak Routes
// ==========================================

/**
 * @swagger
 * /api/hr/employees/{id}/anak:
 *   post:
 *     summary: Add anak to karyawan
 *     tags: [Employee Management]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/anak', authenticate, requirePermissions('employee.update'), createAnakKaryawan);

/**
 * @swagger
 * /api/hr/employees/{id}/anak/{anakId}:
 *   put:
 *     summary: Update anak
 *     tags: [Employee Management]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id/anak/:anakId', authenticate, requirePermissions('employee.update'), updateAnakKaryawan);

/**
 * @swagger
 * /api/hr/employees/{id}/anak/{anakId}:
 *   delete:
 *     summary: Delete anak
 *     tags: [Employee Management]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id/anak/:anakId', authenticate, requirePermissions('employee.update'), deleteAnakKaryawan);

// ==========================================
// Saudara Kandung Routes
// ==========================================

/**
 * @swagger
 * /api/hr/employees/{id}/saudara-kandung:
 *   post:
 *     summary: Add saudara kandung to karyawan (max 5)
 *     tags: [Employee Management]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/saudara-kandung', authenticate, requirePermissions('employee.update'), createSaudaraKandungKaryawan);

/**
 * @swagger
 * /api/hr/employees/{id}/saudara-kandung/{saudaraId}:
 *   put:
 *     summary: Update saudara kandung
 *     tags: [Employee Management]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id/saudara-kandung/:saudaraId', authenticate, requirePermissions('employee.update'), updateSaudaraKandungKaryawan);

/**
 * @swagger
 * /api/hr/employees/{id}/saudara-kandung/{saudaraId}:
 *   delete:
 *     summary: Delete saudara kandung
 *     tags: [Employee Management]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id/saudara-kandung/:saudaraId', authenticate, requirePermissions('employee.update'), deleteSaudaraKandungKaryawan);

// ==========================================
// File Upload Routes
// ==========================================

/**
 * @swagger
 * /api/hr/employees/{id}/photo:
 *   post:
 *     summary: Upload karyawan photo
 *     tags: [Employee Management]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: photo
 *         type: file
 *         required: true
 *         description: Photo file (JPEG, PNG, max 5MB)
 */
router.post('/:id/photo', authenticate, requirePermissions('employee.update'), uploadEmployeePhoto.single('photo'), uploadKaryawanPhoto);

/**
 * @swagger
 * /api/hr/employees/{id}/documents:
 *   post:
 *     summary: Upload karyawan document
 *     tags: [Employee Management]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: document
 *         type: file
 *         required: true
 *       - in: formData
 *         name: jenisDokumen
 *         type: string
 *         required: true
 */
router.post('/:id/documents', authenticate, requirePermissions('employee.update'), uploadEmployeeDocument.single('document'), uploadKaryawanDocument);

/**
 * @swagger
 * /api/hr/employees/{id}/documents/{documentId}:
 *   delete:
 *     summary: Delete karyawan document
 *     tags: [Employee Management]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id/documents/:documentId', authenticate, requirePermissions('employee.update'), deleteKaryawanDocument);

// ==========================================
// QR Code Route
// ==========================================

/**
 * @swagger
 * /api/hr/employees/{id}/qrcode:
 *   get:
 *     summary: Generate QR code from karyawan NIK
 *     tags: [Employee Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [image, base64]
 *           default: image
 *         description: Output format (image returns PNG, base64 returns JSON)
 *     responses:
 *       200:
 *         description: QR code generated
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 qrcode:
 *                   type: string
 *                 nik:
 *                   type: string
 *       404:
 *         description: Karyawan not found
 */
router.get('/:id/qrcode', authenticate, requirePermissions('employee.read'), generateKaryawanQRCode);

export default router;
