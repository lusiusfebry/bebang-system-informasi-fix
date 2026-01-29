import { Router } from 'express';
import { authenticate, authorizeRoles, requirePermissions } from '../middleware/auth.middleware';
import {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
    assignPermissionsToRole,
    getRolePermissions,
} from '../controllers/role.controller';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get all roles (requires role.read permission)
router.get('/', requirePermissions('role.read'), getAllRoles);

// Get role by ID
router.get('/:id', requirePermissions('role.read'), getRoleById);

// Get role permissions
router.get('/:id/permissions', requirePermissions('role.read'), getRolePermissions);

// Create new role (Admin only)
router.post('/', requirePermissions('role.create'), createRole);

// Update role
router.put('/:id', requirePermissions('role.update'), updateRole);

// Delete role
router.delete('/:id', requirePermissions('role.delete'), deleteRole);

// Assign permissions to role
router.post('/:id/permissions', requirePermissions('role.assign_permissions'), assignPermissionsToRole);

export default router;
