import { Router } from 'express';
import { resignationController } from '../controllers/resignation.controller';
import { authenticate, requirePermissions } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Resignation
 *   description: Manajemen pengunduran diri karyawan
 */

// Apply auth middleware to all routes
router.use(authenticate);

// View routes (HR & Admin)
/**
 * @swagger
 * /api/hr/resignations:
 *   get:
 *     summary: Get all resignations
 *     tags: [Resignation]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of resignations
 */
router.get('/', requirePermissions('resignation.read'), resignationController.findAll);

/**
 * @swagger
 * /api/hr/resignations/{id}:
 *   get:
 *     summary: Get resignation by ID
 *     tags: [Resignation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resignation details
 */
router.get('/:id', requirePermissions('resignation.read'), resignationController.findById);

// Action routes
/**
 * @swagger
 * /api/hr/resignations:
 *   post:
 *     summary: Create new resignation
 *     tags: [Resignation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *               - date
 *             properties:
 *               reason:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Resignation created
 */
router.post('/', requirePermissions('resignation.create'), resignationController.create);

/**
 * @swagger
 * /api/hr/resignations/{id}/approve:
 *   patch:
 *     summary: Approve resignation
 *     tags: [Resignation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resignation approved
 */
router.patch('/:id/approve', requirePermissions('resignation.approve'), resignationController.approve);

/**
 * @swagger
 * /api/hr/resignations/{id}/reject:
 *   patch:
 *     summary: Reject resignation
 *     tags: [Resignation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resignation rejected
 */
router.patch('/:id/reject', requirePermissions('resignation.approve'), resignationController.reject);

export default router;
