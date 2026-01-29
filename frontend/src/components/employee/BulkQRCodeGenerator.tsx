import React, { useState } from 'react';
import { employeeService } from '../../services/employee.service';
import { useToast } from '../../components/common/Toast';

interface BulkQRCodeGeneratorProps {
    selectedEmployeeIds: string[];
    onClose: () => void;
    onSuccess?: () => void;
}

const BulkQRCodeGenerator: React.FC<BulkQRCodeGeneratorProps> = ({ selectedEmployeeIds, onClose, onSuccess }) => {
    const [generating, setGenerating] = useState(false);
    const { showToast } = useToast();

    const handleGenerate = async () => {
        if (selectedEmployeeIds.length === 0) {
            showToast('No employees selected', 'error');
            return;
        }

        setGenerating(true);
        try {
            const blob = await employeeService.bulkGenerateQRCodes(selectedEmployeeIds);

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const timestamp = new Date().toISOString().slice(0, 10);
            link.download = `qrcodes-${timestamp}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            showToast('QR Codes generated successfully', 'success');
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error('Bulk generation error:', error);
            showToast('Failed to generate QR codes', 'error');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <span className="material-symbols-rounded text-blue-600">qr_code_2</span>
                        Generate QR Codes
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <span className="material-symbols-rounded">close</span>
                    </button>
                </div>

                <div className="mb-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                        <span className="material-symbols-rounded text-blue-600 mt-0.5">info</span>
                        <div>
                            <p className="text-sm text-blue-800 font-medium">Bulk Generation</p>
                            <p className="text-sm text-blue-600 mt-1">
                                You are about to generate QR codes for <span className="font-bold">{selectedEmployeeIds.length}</span> employees.
                                This will download a ZIP file containing PNG images of their QR codes.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={generating}
                        className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                        {generating ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                                Generating...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-rounded">download</span>
                                Generate & Download
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BulkQRCodeGenerator;
