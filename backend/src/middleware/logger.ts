import morgan from 'morgan';

// Create custom morgan format
const format = process.env.NODE_ENV === 'development'
    ? ':method :url :status :response-time ms - :res[content-length]'
    : 'combined';

export const requestLogger = morgan(format);
