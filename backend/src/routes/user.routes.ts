import { Router } from 'express';
import { authenticate, requirePermissions } from '../middleware/auth.middleware';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    assignRoleToUser,
} from '../controllers/user.controller';

const router = Router();

router.use(authenticate);

// Get all users
router.get('/', requirePermissions('user.read'), getAllUsers);

// Get user by ID
router.get('/:id', requirePermissions('user.read'), getUserById);

// Create new user
router.post('/', requirePermissions('user.create'), createUser);

// Update user
router.put('/:id', requirePermissions('user.update'), updateUser);

// Delete user
router.delete('/:id', requirePermissions('user.delete'), deleteUser);

// Assign role to user
router.post('/:id/role', requirePermissions('user.update'), assignRoleToUser);

export default router;
