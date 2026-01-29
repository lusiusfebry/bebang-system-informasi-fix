import { Router } from 'express';
import { resignationController } from '../controllers/resignation.controller';
import { authenticate, requirePermissions } from '../middleware/auth.middleware';

const router = Router();

// Apply auth middleware to all routes
router.use(authenticate);

// View routes (HR & Admin)
router.get('/', requirePermissions('resignation.read'), resignationController.findAll);
router.get('/:id', requirePermissions('resignation.read'), resignationController.findById);

// Action routes
router.post('/', requirePermissions('resignation.create'), resignationController.create);
router.patch('/:id/approve', requirePermissions('resignation.approve'), resignationController.approve);
router.patch('/:id/reject', requirePermissions('resignation.approve'), resignationController.reject);

export default router;
