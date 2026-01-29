import React from 'react';
import { Employee } from '../../types/employee.types';
import { getFileUrl } from '../../utils/file';

interface EmployeeIDCardProps {
    employee: Employee;
    qrCodeDataUrl: string;
    showBothSides?: boolean;
}

const EmployeeIDCard: React.FC<EmployeeIDCardProps> = ({ employee, qrCodeDataUrl }) => {
    // Standard CR80 ID card size ratio styling is handled by print.css container
    // Here we define internal layout

    return (
        <div className="id-card-container relative bg-white overflow-hidden flex flex-col items-center justify-between p-4 box-border">
            {/* Background Pattern/Design - improved aesthetic */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-700 to-indigo-800 z-0 rounded-b-[40px]"></div>

            {/* Header Content */}
            <div className="w-full flex justify-between items-start z-10 mb-2">
                <div className="flex items-center space-x-2">
                    {/* Placeholder Logo or Company Name */}
                    <div className="bg-white/20 p-1 rounded backdrop-blur-sm">
                        <span className="material-symbols-rounded text-white text-xl">business</span>
                    </div>
                    <span className="text-white font-bold text-sm tracking-wide">BEBANG SYSTEM</span>
                </div>
            </div>

            {/* Photo & Main Info */}
            <div className="z-10 flex flex-col items-center w-full mt-2">
                <div className="relative">
                    <img
                        src={employee.fotoKaryawan ? getFileUrl(employee.fotoKaryawan) : `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.namaLengkap)}&background=random`}
                        alt={employee.namaLengkap}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg bg-gray-100"
                    />
                    {/* Status Indicator */}
                    <div className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white ${employee.statusKaryawan?.namaStatus === 'Aktif' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                </div>

                <div className="text-center mt-3 w-full">
                    <h2 className="text-lg font-bold text-gray-900 leading-tight uppercase truncate px-2">{employee.namaLengkap}</h2>
                    <p className="text-sm text-blue-700 font-semibold mb-1">{employee.posisiJabatan?.namaPosisiJabatan || 'Position'}</p>
                    <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 mx-auto rounded-full mb-2"></div>
                </div>
            </div>

            {/* Details & QR Code Grid */}
            <div className="w-full grid grid-cols-3 gap-2 z-10 mt-auto items-end">
                {/* Info Column */}
                <div className="col-span-2 space-y-1.5 text-left">
                    <div>
                        <p className="text-[10px] text-gray-500 font-medium">Employee ID (NIK)</p>
                        <p className="text-sm font-bold text-gray-800 font-mono tracking-tight">{employee.nomorIndukKaryawan}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-500 font-medium">Department</p>
                        <p className="text-xs font-semibold text-gray-700 truncate">{employee.department?.namaDepartment || '-'}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-500 font-medium">Division</p>
                        <p className="text-xs text-gray-700 truncate">{employee.divisi?.namaDivisi || '-'}</p>
                    </div>
                </div>

                {/* QR Code Column */}
                <div className="col-span-1 flex justify-end">
                    <div className="p-1 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <img src={qrCodeDataUrl} alt="QR Code" className="w-[72px] h-[72px] object-contain" />
                    </div>
                </div>
            </div>

            {/* Footer Stripe */}
            <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-500"></div>
        </div>
    );
};

export default EmployeeIDCard;
