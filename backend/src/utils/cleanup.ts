import fs from 'fs';
import path from 'path';
import { UPLOAD_DIRS } from '../config/upload';

const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

export function cleanupTempFiles() {
    const importDir = UPLOAD_DIRS.EXCEL_IMPORTS;

    if (!fs.existsSync(importDir)) return;

    try {
        const files = fs.readdirSync(importDir);
        const now = Date.now();

        files.forEach(file => {
            const filePath = path.join(importDir, file);
            const stats = fs.statSync(filePath);

            if (now - stats.mtimeMs > MAX_AGE_MS) {
                fs.unlinkSync(filePath);
                console.log(`Deleted old import file: ${file}`);
            }
        });
    } catch (error) {
        console.error('Error cleaning up temp files:', error);
    }
}
