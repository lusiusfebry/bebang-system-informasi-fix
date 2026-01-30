import { Router } from 'express';
import { authenticate, requirePermissions } from '../middleware/auth.middleware';
import { getAllPermissions, getPermissionsByModule } from '../controllers/permission.controller';

/**
 * @swagger
 * tags:
 *   name: Permissions
 *   description: Akses permission
 */
const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/permissions:
 *   get:
 *     summary: Get all permissions
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get('/', requirePermissions('role.read'), getAllPermissions);

/**
 * @swagger
 * /api/permissions/module/{module}:
 *   get:
 *     summary: Get permissions by module
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: module
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of permissions for module
 */
router.get('/module/:module', requirePermissions('role.read'), getPermissionsByModule);

export default router;
