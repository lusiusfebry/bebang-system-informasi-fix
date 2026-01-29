/**
 * HR Master Data Routes
 * RESTful routing untuk semua 10 master data HR entities
 * @swagger
 * tags:
 *   - name: Divisi
 *     description: Divisi master data endpoints
 *   - name: Department
 *     description: Department master data endpoints
 *   - name: Posisi Jabatan
 *     description: Posisi Jabatan master data endpoints
 *   - name: Kategori Pangkat
 *     description: Kategori Pangkat master data endpoints
 *   - name: Golongan
 *     description: Golongan master data endpoints
 *   - name: Sub Golongan
 *     description: Sub Golongan master data endpoints
 *   - name: Jenis Hubungan Kerja
 *     description: Jenis Hubungan Kerja master data endpoints
 *   - name: Tag
 *     description: Tag master data endpoints
 *   - name: Lokasi Kerja
 *     description: Lokasi Kerja master data endpoints
 *   - name: Status Karyawan
 *     description: Status Karyawan master data endpoints
 */

import { Router } from 'express';
import { authenticate, requirePermissions } from '../middleware/auth.middleware';
import { validateBody, validateQuery, validateParams } from '../middleware/validation.middleware';
import {
    createDivisiSchema,
    updateDivisiSchema,
    createDepartmentSchema,
    updateDepartmentSchema,
    createPosisiJabatanSchema,
    updatePosisiJabatanSchema,
    createKategoriPangkatSchema,
    updateKategoriPangkatSchema,
    createGolonganSchema,
    updateGolonganSchema,
    createSubGolonganSchema,
    updateSubGolonganSchema,
    createJenisHubunganKerjaSchema,
    updateJenisHubunganKerjaSchema,
    createTagSchema,
    updateTagSchema,
    createLokasiKerjaSchema,
    updateLokasiKerjaSchema,
    createStatusKaryawanSchema,
    updateStatusKaryawanSchema,
    masterDataQuerySchema,
    idParamsSchema,
} from '../validators/hr-master.validator';
import * as hrMasterController from '../controllers/hr-master.controller';

const router = Router();

// ==========================================
// DIVISI ROUTES
// ==========================================

/**
 * @swagger
 * /api/hr/master/divisi:
 *   get:
 *     summary: Get all divisi
 *     tags: [Divisi]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Items per page
 *       - in: query
 *         name: status
 *         schema:
 *           $ref: '#/components/schemas/StatusMaster'
 *         description: Filter by status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name
 *     responses:
 *       200:
 *         description: Paginated list of divisi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       401:
 *         description: Unauthorized
 */
router.get('/divisi',
    authenticate,
    requirePermissions('hr_master.read'),
    validateQuery(masterDataQuerySchema),
    hrMasterController.getAllDivisi
);

/**
 * @swagger
 * /api/hr/master/divisi/{id}:
 *   get:
 *     summary: Get divisi by ID
 *     tags: [Divisi]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Divisi ID
 *     responses:
 *       200:
 *         description: Divisi details
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - properties:
 *                     data:
 *                       $ref: '#/components/schemas/Divisi'
 *       404:
 *         description: Divisi not found
 */
router.get('/divisi/:id',
    authenticate,
    requirePermissions('hr_master.read'),
    validateParams(idParamsSchema),
    hrMasterController.getDivisiById
);

/**
 * @swagger
 * /api/hr/master/divisi:
 *   post:
 *     summary: Create new divisi
 *     tags: [Divisi]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDivisi'
 *     responses:
 *       201:
 *         description: Divisi created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - properties:
 *                     data:
 *                       $ref: '#/components/schemas/Divisi'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/divisi',
    authenticate,
    requirePermissions('hr_master.create'),
    validateBody(createDivisiSchema),
    hrMasterController.createDivisi
);

/**
 * @swagger
 * /api/hr/master/divisi/{id}:
 *   put:
 *     summary: Update divisi
 *     tags: [Divisi]
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
 *             $ref: '#/components/schemas/UpdateDivisi'
 *     responses:
 *       200:
 *         description: Divisi updated successfully
 *       404:
 *         description: Divisi not found
 */
router.put('/divisi/:id',
    authenticate,
    requirePermissions('hr_master.update'),
    validateParams(idParamsSchema),
    validateBody(updateDivisiSchema),
    hrMasterController.updateDivisi
);

/**
 * @swagger
 * /api/hr/master/divisi/{id}:
 *   delete:
 *     summary: Soft delete divisi
 *     tags: [Divisi]
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
 *         description: Divisi deactivated successfully
 *       404:
 *         description: Divisi not found
 */
router.delete('/divisi/:id',
    authenticate,
    requirePermissions('hr_master.delete'),
    validateParams(idParamsSchema),
    hrMasterController.deleteDivisi
);

// ==========================================
// DEPARTMENT ROUTES
// ==========================================

/**
 * @swagger
 * /api/hr/master/department:
 *   get:
 *     summary: Get all department
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           $ref: '#/components/schemas/StatusMaster'
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: divisiId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by divisi
 *     responses:
 *       200:
 *         description: Paginated list of departments
 */
router.get('/department',
    authenticate,
    requirePermissions('hr_master.read'),
    hrMasterController.getAllDepartment
);

/**
 * @swagger
 * /api/hr/master/department/{id}:
 *   get:
 *     summary: Get department by ID
 *     tags: [Department]
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
 *         description: Department details with divisi relation
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - properties:
 *                     data:
 *                       $ref: '#/components/schemas/Department'
 *       404:
 *         description: Department not found
 */
router.get('/department/:id',
    authenticate,
    requirePermissions('hr_master.read'),
    validateParams(idParamsSchema),
    hrMasterController.getDepartmentById
);

/**
 * @swagger
 * /api/hr/master/department:
 *   post:
 *     summary: Create new department
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDepartment'
 *     responses:
 *       201:
 *         description: Department created successfully
 *       400:
 *         description: Validation error
 */
router.post('/department',
    authenticate,
    requirePermissions('hr_master.create'),
    validateBody(createDepartmentSchema),
    hrMasterController.createDepartment
);

/**
 * @swagger
 * /api/hr/master/department/{id}:
 *   put:
 *     summary: Update department
 *     tags: [Department]
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
 *             $ref: '#/components/schemas/UpdateDepartment'
 *     responses:
 *       200:
 *         description: Department updated successfully
 *       404:
 *         description: Department not found
 */
router.put('/department/:id',
    authenticate,
    requirePermissions('hr_master.update'),
    validateParams(idParamsSchema),
    validateBody(updateDepartmentSchema),
    hrMasterController.updateDepartment
);

/**
 * @swagger
 * /api/hr/master/department/{id}:
 *   delete:
 *     summary: Soft delete department
 *     tags: [Department]
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
 *         description: Department deactivated successfully
 *       404:
 *         description: Department not found
 */
router.delete('/department/:id',
    authenticate,
    requirePermissions('hr_master.delete'),
    validateParams(idParamsSchema),
    hrMasterController.deleteDepartment
);

// ==========================================
// POSISI JABATAN ROUTES
// ==========================================

/**
 * @swagger
 * /api/hr/master/posisi-jabatan:
 *   get:
 *     summary: Get all posisi jabatan
 *     tags: [Posisi Jabatan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           $ref: '#/components/schemas/StatusMaster'
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated list of posisi jabatan
 */
router.get('/posisi-jabatan',
    authenticate,
    requirePermissions('hr_master.read'),
    hrMasterController.getAllPosisiJabatan
);

/**
 * @swagger
 * /api/hr/master/posisi-jabatan/{id}:
 *   get:
 *     summary: Get posisi jabatan by ID
 *     tags: [Posisi Jabatan]
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
 *         description: Posisi jabatan details
 *       404:
 *         description: Posisi jabatan not found
 */
router.get('/posisi-jabatan/:id',
    authenticate,
    requirePermissions('hr_master.read'),
    validateParams(idParamsSchema),
    hrMasterController.getPosisiJabatanById
);

/**
 * @swagger
 * /api/hr/master/posisi-jabatan:
 *   post:
 *     summary: Create new posisi jabatan
 *     tags: [Posisi Jabatan]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePosisiJabatan'
 *     responses:
 *       201:
 *         description: Posisi jabatan created successfully
 *       400:
 *         description: Validation error
 */
router.post('/posisi-jabatan',
    authenticate,
    requirePermissions('hr_master.create'),
    validateBody(createPosisiJabatanSchema),
    hrMasterController.createPosisiJabatan
);

/**
 * @swagger
 * /api/hr/master/posisi-jabatan/{id}:
 *   put:
 *     summary: Update posisi jabatan
 *     tags: [Posisi Jabatan]
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
 *             $ref: '#/components/schemas/UpdatePosisiJabatan'
 *     responses:
 *       200:
 *         description: Posisi jabatan updated successfully
 *       404:
 *         description: Posisi jabatan not found
 */
router.put('/posisi-jabatan/:id',
    authenticate,
    requirePermissions('hr_master.update'),
    validateParams(idParamsSchema),
    validateBody(updatePosisiJabatanSchema),
    hrMasterController.updatePosisiJabatan
);

/**
 * @swagger
 * /api/hr/master/posisi-jabatan/{id}:
 *   delete:
 *     summary: Soft delete posisi jabatan
 *     tags: [Posisi Jabatan]
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
 *         description: Posisi jabatan deactivated successfully
 *       404:
 *         description: Posisi jabatan not found
 */
router.delete('/posisi-jabatan/:id',
    authenticate,
    requirePermissions('hr_master.delete'),
    validateParams(idParamsSchema),
    hrMasterController.deletePosisiJabatan
);

// ==========================================
// KATEGORI PANGKAT ROUTES
// ==========================================

/**
 * @swagger
 * /api/hr/master/kategori-pangkat:
 *   get:
 *     summary: Get all kategori pangkat
 *     tags: [Kategori Pangkat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           $ref: '#/components/schemas/StatusMaster'
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated list of kategori pangkat
 */
router.get('/kategori-pangkat',
    authenticate,
    requirePermissions('hr_master.read'),
    hrMasterController.getAllKategoriPangkat
);

/**
 * @swagger
 * /api/hr/master/kategori-pangkat/{id}:
 *   get:
 *     summary: Get kategori pangkat by ID
 *     tags: [Kategori Pangkat]
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
 *         description: Kategori pangkat details
 *       404:
 *         description: Kategori pangkat not found
 */
router.get('/kategori-pangkat/:id',
    authenticate,
    requirePermissions('hr_master.read'),
    validateParams(idParamsSchema),
    hrMasterController.getKategoriPangkatById
);

/**
 * @swagger
 * /api/hr/master/kategori-pangkat:
 *   post:
 *     summary: Create new kategori pangkat
 *     tags: [Kategori Pangkat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateKategoriPangkat'
 *     responses:
 *       201:
 *         description: Kategori pangkat created successfully
 *       400:
 *         description: Validation error
 */
router.post('/kategori-pangkat',
    authenticate,
    requirePermissions('hr_master.create'),
    validateBody(createKategoriPangkatSchema),
    hrMasterController.createKategoriPangkat
);

/**
 * @swagger
 * /api/hr/master/kategori-pangkat/{id}:
 *   put:
 *     summary: Update kategori pangkat
 *     tags: [Kategori Pangkat]
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
 *             $ref: '#/components/schemas/UpdateKategoriPangkat'
 *     responses:
 *       200:
 *         description: Kategori pangkat updated successfully
 *       404:
 *         description: Kategori pangkat not found
 */
router.put('/kategori-pangkat/:id',
    authenticate,
    requirePermissions('hr_master.update'),
    validateParams(idParamsSchema),
    validateBody(updateKategoriPangkatSchema),
    hrMasterController.updateKategoriPangkat
);

/**
 * @swagger
 * /api/hr/master/kategori-pangkat/{id}:
 *   delete:
 *     summary: Soft delete kategori pangkat
 *     tags: [Kategori Pangkat]
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
 *         description: Kategori pangkat deactivated successfully
 *       404:
 *         description: Kategori pangkat not found
 */
router.delete('/kategori-pangkat/:id',
    authenticate,
    requirePermissions('hr_master.delete'),
    validateParams(idParamsSchema),
    hrMasterController.deleteKategoriPangkat
);

// ==========================================
// GOLONGAN ROUTES
// ==========================================

/**
 * @swagger
 * /api/hr/master/golongan:
 *   get:
 *     summary: Get all golongan
 *     tags: [Golongan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           $ref: '#/components/schemas/StatusMaster'
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated list of golongan
 */
router.get('/golongan',
    authenticate,
    requirePermissions('hr_master.read'),
    hrMasterController.getAllGolongan
);

/**
 * @swagger
 * /api/hr/master/golongan/{id}:
 *   get:
 *     summary: Get golongan by ID
 *     tags: [Golongan]
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
 *         description: Golongan details
 *       404:
 *         description: Golongan not found
 */
router.get('/golongan/:id',
    authenticate,
    requirePermissions('hr_master.read'),
    validateParams(idParamsSchema),
    hrMasterController.getGolonganById
);

/**
 * @swagger
 * /api/hr/master/golongan:
 *   post:
 *     summary: Create new golongan
 *     tags: [Golongan]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateGolongan'
 *     responses:
 *       201:
 *         description: Golongan created successfully
 *       400:
 *         description: Validation error
 */
router.post('/golongan',
    authenticate,
    requirePermissions('hr_master.create'),
    validateBody(createGolonganSchema),
    hrMasterController.createGolongan
);

/**
 * @swagger
 * /api/hr/master/golongan/{id}:
 *   put:
 *     summary: Update golongan
 *     tags: [Golongan]
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
 *             $ref: '#/components/schemas/UpdateGolongan'
 *     responses:
 *       200:
 *         description: Golongan updated successfully
 *       404:
 *         description: Golongan not found
 */
router.put('/golongan/:id',
    authenticate,
    requirePermissions('hr_master.update'),
    validateParams(idParamsSchema),
    validateBody(updateGolonganSchema),
    hrMasterController.updateGolongan
);

/**
 * @swagger
 * /api/hr/master/golongan/{id}:
 *   delete:
 *     summary: Soft delete golongan
 *     tags: [Golongan]
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
 *         description: Golongan deactivated successfully
 *       404:
 *         description: Golongan not found
 */
router.delete('/golongan/:id',
    authenticate,
    requirePermissions('hr_master.delete'),
    validateParams(idParamsSchema),
    hrMasterController.deleteGolongan
);

// ==========================================
// SUB GOLONGAN ROUTES
// ==========================================

/**
 * @swagger
 * /api/hr/master/sub-golongan:
 *   get:
 *     summary: Get all sub golongan
 *     tags: [Sub Golongan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           $ref: '#/components/schemas/StatusMaster'
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated list of sub golongan
 */
router.get('/sub-golongan',
    authenticate,
    requirePermissions('hr_master.read'),
    hrMasterController.getAllSubGolongan
);

/**
 * @swagger
 * /api/hr/master/sub-golongan/{id}:
 *   get:
 *     summary: Get sub golongan by ID
 *     tags: [Sub Golongan]
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
 *         description: Sub golongan details
 *       404:
 *         description: Sub golongan not found
 */
router.get('/sub-golongan/:id',
    authenticate,
    requirePermissions('hr_master.read'),
    validateParams(idParamsSchema),
    hrMasterController.getSubGolonganById
);

/**
 * @swagger
 * /api/hr/master/sub-golongan:
 *   post:
 *     summary: Create new sub golongan
 *     tags: [Sub Golongan]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSubGolongan'
 *     responses:
 *       201:
 *         description: Sub golongan created successfully
 *       400:
 *         description: Validation error
 */
router.post('/sub-golongan',
    authenticate,
    requirePermissions('hr_master.create'),
    validateBody(createSubGolonganSchema),
    hrMasterController.createSubGolongan
);

/**
 * @swagger
 * /api/hr/master/sub-golongan/{id}:
 *   put:
 *     summary: Update sub golongan
 *     tags: [Sub Golongan]
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
 *             $ref: '#/components/schemas/UpdateSubGolongan'
 *     responses:
 *       200:
 *         description: Sub golongan updated successfully
 *       404:
 *         description: Sub golongan not found
 */
router.put('/sub-golongan/:id',
    authenticate,
    requirePermissions('hr_master.update'),
    validateParams(idParamsSchema),
    validateBody(updateSubGolonganSchema),
    hrMasterController.updateSubGolongan
);

/**
 * @swagger
 * /api/hr/master/sub-golongan/{id}:
 *   delete:
 *     summary: Soft delete sub golongan
 *     tags: [Sub Golongan]
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
 *         description: Sub golongan deactivated successfully
 *       404:
 *         description: Sub golongan not found
 */
router.delete('/sub-golongan/:id',
    authenticate,
    requirePermissions('hr_master.delete'),
    validateParams(idParamsSchema),
    hrMasterController.deleteSubGolongan
);

// ==========================================
// JENIS HUBUNGAN KERJA ROUTES
// ==========================================

/**
 * @swagger
 * /api/hr/master/jenis-hubungan-kerja:
 *   get:
 *     summary: Get all jenis hubungan kerja
 *     tags: [Jenis Hubungan Kerja]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           $ref: '#/components/schemas/StatusMaster'
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated list of jenis hubungan kerja
 */
router.get('/jenis-hubungan-kerja',
    authenticate,
    requirePermissions('hr_master.read'),
    hrMasterController.getAllJenisHubunganKerja
);

/**
 * @swagger
 * /api/hr/master/jenis-hubungan-kerja/{id}:
 *   get:
 *     summary: Get jenis hubungan kerja by ID
 *     tags: [Jenis Hubungan Kerja]
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
 *         description: Jenis hubungan kerja details
 *       404:
 *         description: Jenis hubungan kerja not found
 */
router.get('/jenis-hubungan-kerja/:id',
    authenticate,
    requirePermissions('hr_master.read'),
    validateParams(idParamsSchema),
    hrMasterController.getJenisHubunganKerjaById
);

/**
 * @swagger
 * /api/hr/master/jenis-hubungan-kerja:
 *   post:
 *     summary: Create new jenis hubungan kerja
 *     tags: [Jenis Hubungan Kerja]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateJenisHubunganKerja'
 *     responses:
 *       201:
 *         description: Jenis hubungan kerja created successfully
 *       400:
 *         description: Validation error
 */
router.post('/jenis-hubungan-kerja',
    authenticate,
    requirePermissions('hr_master.create'),
    validateBody(createJenisHubunganKerjaSchema),
    hrMasterController.createJenisHubunganKerja
);

/**
 * @swagger
 * /api/hr/master/jenis-hubungan-kerja/{id}:
 *   put:
 *     summary: Update jenis hubungan kerja
 *     tags: [Jenis Hubungan Kerja]
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
 *             $ref: '#/components/schemas/UpdateJenisHubunganKerja'
 *     responses:
 *       200:
 *         description: Jenis hubungan kerja updated successfully
 *       404:
 *         description: Jenis hubungan kerja not found
 */
router.put('/jenis-hubungan-kerja/:id',
    authenticate,
    requirePermissions('hr_master.update'),
    validateParams(idParamsSchema),
    validateBody(updateJenisHubunganKerjaSchema),
    hrMasterController.updateJenisHubunganKerja
);

/**
 * @swagger
 * /api/hr/master/jenis-hubungan-kerja/{id}:
 *   delete:
 *     summary: Soft delete jenis hubungan kerja
 *     tags: [Jenis Hubungan Kerja]
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
 *         description: Jenis hubungan kerja deactivated successfully
 *       404:
 *         description: Jenis hubungan kerja not found
 */
router.delete('/jenis-hubungan-kerja/:id',
    authenticate,
    requirePermissions('hr_master.delete'),
    validateParams(idParamsSchema),
    hrMasterController.deleteJenisHubunganKerja
);

// ==========================================
// TAG ROUTES
// ==========================================

/**
 * @swagger
 * /api/hr/master/tag:
 *   get:
 *     summary: Get all tags
 *     tags: [Tag]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           $ref: '#/components/schemas/StatusMaster'
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated list of tags
 */
router.get('/tag',
    authenticate,
    requirePermissions('hr_master.read'),
    hrMasterController.getAllTag
);

/**
 * @swagger
 * /api/hr/master/tag/{id}:
 *   get:
 *     summary: Get tag by ID
 *     tags: [Tag]
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
 *         description: Tag details
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - properties:
 *                     data:
 *                       $ref: '#/components/schemas/Tag'
 *       404:
 *         description: Tag not found
 */
router.get('/tag/:id',
    authenticate,
    requirePermissions('hr_master.read'),
    validateParams(idParamsSchema),
    hrMasterController.getTagById
);

/**
 * @swagger
 * /api/hr/master/tag:
 *   post:
 *     summary: Create new tag
 *     tags: [Tag]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTag'
 *           example:
 *             namaTag: "Urgent"
 *             warnaTag: "#FF5733"
 *             keterangan: "Tag untuk item urgent"
 *     responses:
 *       201:
 *         description: Tag created successfully
 *       400:
 *         description: Validation error (e.g. invalid hex color)
 */
router.post('/tag',
    authenticate,
    requirePermissions('hr_master.create'),
    validateBody(createTagSchema),
    hrMasterController.createTag
);

/**
 * @swagger
 * /api/hr/master/tag/{id}:
 *   put:
 *     summary: Update tag
 *     tags: [Tag]
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
 *             $ref: '#/components/schemas/UpdateTag'
 *     responses:
 *       200:
 *         description: Tag updated successfully
 *       404:
 *         description: Tag not found
 */
router.put('/tag/:id',
    authenticate,
    requirePermissions('hr_master.update'),
    validateParams(idParamsSchema),
    validateBody(updateTagSchema),
    hrMasterController.updateTag
);

/**
 * @swagger
 * /api/hr/master/tag/{id}:
 *   delete:
 *     summary: Soft delete tag
 *     tags: [Tag]
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
 *         description: Tag deactivated successfully
 *       404:
 *         description: Tag not found
 */
router.delete('/tag/:id',
    authenticate,
    requirePermissions('hr_master.delete'),
    validateParams(idParamsSchema),
    hrMasterController.deleteTag
);

// ==========================================
// LOKASI KERJA ROUTES
// ==========================================

/**
 * @swagger
 * /api/hr/master/lokasi-kerja:
 *   get:
 *     summary: Get all lokasi kerja
 *     tags: [Lokasi Kerja]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           $ref: '#/components/schemas/StatusMaster'
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated list of lokasi kerja
 */
router.get('/lokasi-kerja',
    authenticate,
    requirePermissions('hr_master.read'),
    hrMasterController.getAllLokasiKerja
);

/**
 * @swagger
 * /api/hr/master/lokasi-kerja/{id}:
 *   get:
 *     summary: Get lokasi kerja by ID
 *     tags: [Lokasi Kerja]
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
 *         description: Lokasi kerja details
 *       404:
 *         description: Lokasi kerja not found
 */
router.get('/lokasi-kerja/:id',
    authenticate,
    requirePermissions('hr_master.read'),
    validateParams(idParamsSchema),
    hrMasterController.getLokasiKerjaById
);

/**
 * @swagger
 * /api/hr/master/lokasi-kerja:
 *   post:
 *     summary: Create new lokasi kerja
 *     tags: [Lokasi Kerja]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateLokasiKerja'
 *     responses:
 *       201:
 *         description: Lokasi kerja created successfully
 *       400:
 *         description: Validation error
 */
router.post('/lokasi-kerja',
    authenticate,
    requirePermissions('hr_master.create'),
    validateBody(createLokasiKerjaSchema),
    hrMasterController.createLokasiKerja
);

/**
 * @swagger
 * /api/hr/master/lokasi-kerja/{id}:
 *   put:
 *     summary: Update lokasi kerja
 *     tags: [Lokasi Kerja]
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
 *             $ref: '#/components/schemas/UpdateLokasiKerja'
 *     responses:
 *       200:
 *         description: Lokasi kerja updated successfully
 *       404:
 *         description: Lokasi kerja not found
 */
router.put('/lokasi-kerja/:id',
    authenticate,
    requirePermissions('hr_master.update'),
    validateParams(idParamsSchema),
    validateBody(updateLokasiKerjaSchema),
    hrMasterController.updateLokasiKerja
);

/**
 * @swagger
 * /api/hr/master/lokasi-kerja/{id}:
 *   delete:
 *     summary: Soft delete lokasi kerja
 *     tags: [Lokasi Kerja]
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
 *         description: Lokasi kerja deactivated successfully
 *       404:
 *         description: Lokasi kerja not found
 */
router.delete('/lokasi-kerja/:id',
    authenticate,
    requirePermissions('hr_master.delete'),
    validateParams(idParamsSchema),
    hrMasterController.deleteLokasiKerja
);

// ==========================================
// STATUS KARYAWAN ROUTES
// ==========================================

/**
 * @swagger
 * /api/hr/master/status-karyawan:
 *   get:
 *     summary: Get all status karyawan
 *     tags: [Status Karyawan]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           $ref: '#/components/schemas/StatusMaster'
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated list of status karyawan
 */
router.get('/status-karyawan',
    authenticate,
    requirePermissions('hr_master.read'),
    hrMasterController.getAllStatusKaryawan
);

/**
 * @swagger
 * /api/hr/master/status-karyawan/{id}:
 *   get:
 *     summary: Get status karyawan by ID
 *     tags: [Status Karyawan]
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
 *         description: Status karyawan details
 *       404:
 *         description: Status karyawan not found
 */
router.get('/status-karyawan/:id',
    authenticate,
    requirePermissions('hr_master.read'),
    validateParams(idParamsSchema),
    hrMasterController.getStatusKaryawanById
);

/**
 * @swagger
 * /api/hr/master/status-karyawan:
 *   post:
 *     summary: Create new status karyawan
 *     tags: [Status Karyawan]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStatusKaryawan'
 *     responses:
 *       201:
 *         description: Status karyawan created successfully
 *       400:
 *         description: Validation error
 */
router.post('/status-karyawan',
    authenticate,
    requirePermissions('hr_master.create'),
    validateBody(createStatusKaryawanSchema),
    hrMasterController.createStatusKaryawan
);

/**
 * @swagger
 * /api/hr/master/status-karyawan/{id}:
 *   put:
 *     summary: Update status karyawan
 *     tags: [Status Karyawan]
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
 *             $ref: '#/components/schemas/UpdateStatusKaryawan'
 *     responses:
 *       200:
 *         description: Status karyawan updated successfully
 *       404:
 *         description: Status karyawan not found
 */
router.put('/status-karyawan/:id',
    authenticate,
    requirePermissions('hr_master.update'),
    validateParams(idParamsSchema),
    validateBody(updateStatusKaryawanSchema),
    hrMasterController.updateStatusKaryawan
);

/**
 * @swagger
 * /api/hr/master/status-karyawan/{id}:
 *   delete:
 *     summary: Soft delete status karyawan
 *     tags: [Status Karyawan]
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
 *         description: Status karyawan deactivated successfully
 *       404:
 *         description: Status karyawan not found
 */
router.delete('/status-karyawan/:id',
    authenticate,
    requirePermissions('hr_master.delete'),
    validateParams(idParamsSchema),
    hrMasterController.deleteStatusKaryawan
);

export default router;
