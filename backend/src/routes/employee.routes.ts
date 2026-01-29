/**
 * Employee Routes
 * Express router untuk Employee management endpoints dengan Swagger documentation
 */

import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { uploadEmployeePhoto, uploadEmployeeDocument } from '../config/upload';
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
    exportKaryawan,
} from '../controllers/employee.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

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
router.get('/', getAllKaryawan);

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
router.get('/export', exportKaryawan);

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
router.post('/bulk-delete', bulkDeleteKaryawan);

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
router.get('/nik/:nik', getKaryawanByNIK);

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
router.get('/:id', getKaryawanById);

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
router.post('/', createKaryawan);

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
router.put('/:id', updateKaryawan);

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
router.delete('/:id', deleteKaryawan);

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
router.post('/:id/anak', createAnakKaryawan);

/**
 * @swagger
 * /api/hr/employees/{id}/anak/{anakId}:
 *   put:
 *     summary: Update anak
 *     tags: [Employee Management]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id/anak/:anakId', updateAnakKaryawan);

/**
 * @swagger
 * /api/hr/employees/{id}/anak/{anakId}:
 *   delete:
 *     summary: Delete anak
 *     tags: [Employee Management]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id/anak/:anakId', deleteAnakKaryawan);

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
router.post('/:id/saudara-kandung', createSaudaraKandungKaryawan);

/**
 * @swagger
 * /api/hr/employees/{id}/saudara-kandung/{saudaraId}:
 *   put:
 *     summary: Update saudara kandung
 *     tags: [Employee Management]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id/saudara-kandung/:saudaraId', updateSaudaraKandungKaryawan);

/**
 * @swagger
 * /api/hr/employees/{id}/saudara-kandung/{saudaraId}:
 *   delete:
 *     summary: Delete saudara kandung
 *     tags: [Employee Management]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id/saudara-kandung/:saudaraId', deleteSaudaraKandungKaryawan);

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
router.post('/:id/photo', uploadEmployeePhoto.single('photo'), uploadKaryawanPhoto);

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
router.post('/:id/documents', uploadEmployeeDocument.single('document'), uploadKaryawanDocument);

/**
 * @swagger
 * /api/hr/employees/{id}/documents/{documentId}:
 *   delete:
 *     summary: Delete karyawan document
 *     tags: [Employee Management]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id/documents/:documentId', deleteKaryawanDocument);

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
router.get('/:id/qrcode', generateKaryawanQRCode);

export default router;
