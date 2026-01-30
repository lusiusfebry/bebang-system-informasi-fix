import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';

import { connectDatabase, disconnectDatabase } from './config/database';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { loggerMiddleware } from './middleware/logger.middleware';
import logger from './utils/logger';
import authRoutes from './routes/auth.routes';
import hrMasterRoutes from './routes/hr-master.routes';
import { setupSwagger } from './config/swagger';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
}));

// Compression
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files for uploads - use absolute path aligned with upload config
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
app.use('/uploads', express.static(path.resolve(process.cwd(), uploadDir)));

// Request logging
app.use(loggerMiddleware);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'Bebang API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
    });
});

// API routes prefix
app.get('/api', (_req: Request, res: Response) => {
    res.json({
        success: true,
        message: 'Welcome to Bebang Sistem Informasi API',
        version: '1.0.0',
    });
});

// Auth routes
app.use('/api/auth', authRoutes);

// RBAC routes
import roleRoutes from './routes/role.routes';
import permissionRoutes from './routes/permission.routes';
import userRoutes from './routes/user.routes';

app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/users', userRoutes);

// HR Master Data routes
app.use('/api/hr/master', hrMasterRoutes);

// Employee Management routes
import employeeRoutes from './routes/employee.routes';
app.use('/api/hr/employees', employeeRoutes);

// Import routes

// Resignation routes
import resignationRoutes from './routes/resignation.routes';
app.use('/api/hr/resignations', resignationRoutes);

// Setup Swagger documentation
setupSwagger(app);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
    logger.info('🛑 SIGTERM received, shutting down gracefully...');
    await disconnectDatabase();
    process.exit(0);
});

process.on('SIGINT', async () => {
    logger.info('🛑 SIGINT received, shutting down gracefully...');
    await disconnectDatabase();
    process.exit(0);
});

// Start server
async function startServer(): Promise<void> {
    try {
        // Connect to database
        await connectDatabase();

        // Start listening
        app.listen(PORT, () => {
            logger.info(`🚀 Server is running on http://localhost:${PORT}`);
            logger.info(`📋 Health check: http://localhost:${PORT}/health`);
            logger.info(`🔧 Environment: ${process.env.NODE_ENV}`);
        });
    } catch (error) {
        logger.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
