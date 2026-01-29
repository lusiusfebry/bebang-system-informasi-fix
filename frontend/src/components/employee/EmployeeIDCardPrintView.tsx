import React, { useEffect, useState } from 'react';
import { Employee, QRCodeResponse } from '../../types/employee.types';
import { employeeService } from '../../services/employee.service';
import EmployeeIDCard from './EmployeeIDCard';
import { useToast } from '../../components/common/Toast';

interface EmployeeIDCardPrintViewProps {
    employee: Employee;
    onClose: () => void;
}

const EmployeeIDCardPrintView: React.FC<EmployeeIDCardPrintViewProps> = ({ employee, onClose }) => {
    const [qrCode, setQrCode] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchQRCode = async () => {
            try {
                const response = await employeeService.getEmployeeQRCode(employee.id, 'base64') as QRCodeResponse;
                if (response.success && response.data.qrcode) {
                    setQrCode(response.data.qrcode);
                } else {
                    showToast('Failed to load QR Code', 'error');
                }
            } catch (error) {
                console.error('Error fetching QR code:', error);
                showToast('Error loading QR Code', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchQRCode();
    }, [employee.id, showToast]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600">Preparing ID Card...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 transition-all duration-300 overflow-y-auto">
            {/* Main Preview Container */}
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header - Hidden on Print */}
                <div className="no-print p-4 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <span className="material-symbols-rounded">badge</span>
                        ID Card Preview
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <span className="material-symbols-rounded text-gray-500">close</span>
                    </button>
                </div>

                {/* Content - Printable Area */}
                <div className="p-8 flex-1 flex flex-col items-center justify-center bg-gray-100 overflow-y-auto">
                    <div className="printable-id-card transform transition-transform hover:scale-105 duration-300">
                        <EmployeeIDCard employee={employee} qrCodeDataUrl={qrCode} />
                    </div>
                </div>

                {/* Footer Actions - Hidden on Print */}
                <div className="no-print p-4 border-t bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
                    >
                        <span className="material-symbols-rounded">print</span>
                        Print ID Card
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmployeeIDCardPrintView;
