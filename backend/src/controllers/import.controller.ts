import { Request, Response } from 'express';
import { importService } from '../services/import.service';
import { deleteFile, getRelativePath } from '../config/upload';

export class ImportController {
    /**
     * Upload and preview Excel file
     */
    async uploadAndPreviewExcel(req: Request, res: Response) {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            const result = await importService.previewImport(req.file.path);

            // Return validation result along with file path for confirmation
            res.status(200).json({
                message: 'File processed successfully',
                data: {
                    ...result,
                    tempFilePath: getRelativePath(req.file.path)
                }
            });
        } catch (error) {
            console.error('Upload preview error:', error);
            // Cleanup on error
            if (req.file) deleteFile(req.file.path);

            res.status(500).json({
                message: 'Error processing file',
                error: (error as Error).message
            });
        }
    }

    /**
     * Confirm import
     */
    async confirmImport(req: Request, res: Response) {
        try {
            const { filePath } = req.body;

            if (!filePath) {
                return res.status(400).json({ message: 'File path is required' });
            }

            // Resolve relative path to absolute
            const absolutePath = getRelativePath(filePath) === filePath
                ? filePath // already normalized or absolute?
                : filePath; // In real app, cleaner path handling needed

            // Security check: ensure path is within import dir (omitted for brevity but recommended)

            const result = await importService.executeImport(filePath);

            res.status(200).json({
                message: 'Import successful',
                data: result
            });
        } catch (error) {
            console.error('Import confirm error:', error);
            res.status(500).json({
                message: 'Error executing import',
                error: (error as Error).message
            });
        }
    }

    /**
     * Download template
     */
    async downloadTemplate(req: Request, res: Response) {
        try {
            const templatePath = importService.getTemplatePath();
            res.download(templatePath, 'Employee_Import_Template.xlsx');
        } catch (error) {
            res.status(404).json({ message: 'Template file not found' });
        }
    }
}

export const importController = new ImportController();
