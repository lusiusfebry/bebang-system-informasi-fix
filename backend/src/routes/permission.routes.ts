import { Router } from 'express';
import { authenticate, requirePermissions } from '../middleware/auth.middleware';
import { getAllPermissions, getPermissionsByModule } from '../controllers/permission.controller';

const router = Router();

router.use(authenticate);

// Get all permissions
router.get('/', requirePermissions('role.read'), getAllPermissions);

// Get permissions by module
router.get('/module/:module', requirePermissions('role.read'), getPermissionsByModule);

export default router;
