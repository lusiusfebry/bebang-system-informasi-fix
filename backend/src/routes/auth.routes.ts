import { Router } from 'express';
import { login, getProfile, logout } from '../controllers/auth.controller';
import { authenticateAndValidate } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT token
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private (requires authentication and validates user is active)
 */
router.get('/profile', authenticateAndValidate, getProfile);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private (requires authentication and validates user is active)
 */
router.post('/logout', authenticateAndValidate, logout);

export default router;
