import { Router } from 'express';
import { resignationController } from '../controllers/resignation.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Apply auth middleware to all routes
router.use(authenticate);

// View routes (HR & Admin)
router.get('/', authorize(Role.ADMIN, Role.HR_MANAGER), resignationController.findAll);
router.get('/:id', authorize(Role.ADMIN, Role.HR_MANAGER), resignationController.findById);

// Action routes
router.post('/', authorize(Role.ADMIN, Role.HR_MANAGER), resignationController.create);
router.patch('/:id/approve', authorize(Role.ADMIN, Role.HR_MANAGER), resignationController.approve);
router.patch('/:id/reject', authorize(Role.ADMIN, Role.HR_MANAGER), resignationController.reject);

export default router;
