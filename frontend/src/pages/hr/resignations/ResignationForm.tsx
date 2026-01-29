
import React, { useState, useEffect } from 'react';
import { useToast } from '../../../components/common';
import { resignationService } from '../../../services/resignation.service';
import { employeeService } from '../../../services/employee.service';
import { ResignationType } from '../../../types/resignation.types';
import { EmployeeListItem } from '../../../types/employee.types';

interface ResignationFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

export default function ResignationForm({ onClose, onSuccess }: ResignationFormProps) {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [employees, setEmployees] = useState<EmployeeListItem[]>([]);

    const [formData, setFormData] = useState({
        karyawanId: '',
        type: ResignationType.RESIGNATION,
        effectiveDate: new Date().toISOString().split('T')[0],
        reason: '',
        remarks: ''
    });

    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = async () => {
        try {
            // Fetch all active employees (ideally)
            // For now, fetching first page or adjust service to fetch all
            const response = await employeeService.getEmployees({ limit: 1000 }); // Basic "all" fetch
            setEmployees(response.data);
        } catch (error) {
            showToast('Gagal memuat daftar karyawan', 'error');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.karyawanId) {
            showToast('Pilih karyawan', 'error');
            return;
        }

        try {
            setLoading(true);
            await resignationService.create(formData);
            showToast('Pengajuan berhasil dibuat', 'success');
            onSuccess();
        } catch (error) {
            console.error(error);
            showToast('Gagal membuat pengajuan', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Buat Pengajuan Baru</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <span className="material-symbols-rounded">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Employee Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Karyawan
                        </label>
                        <select
                            required
                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary"
                            value={formData.karyawanId}
                            onChange={(e) => setFormData(prev => ({ ...prev, karyawanId: e.target.value }))}
                        >
                            <option value="">Pilih Karyawan</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.namaLengkap} ({emp.nomorIndukKaryawan})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Type Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tipe Pengajuan
                        </label>
                        <select
                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary"
                            value={formData.type}
                            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as ResignationType }))}
                        >
                            {Object.values(ResignationType).map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    {/* Effective Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tanggal Efektif Berhenti
                        </label>
                        <input
                            type="date"
                            required
                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary"
                            value={formData.effectiveDate}
                            onChange={(e) => setFormData(prev => ({ ...prev, effectiveDate: e.target.value }))}
                        />
                    </div>

                    {/* Reason */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Alasan
                        </label>
                        <textarea
                            required
                            rows={3}
                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary"
                            value={formData.reason}
                            onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                            placeholder="Alasan pengunduran diri/terminasi..."
                        />
                    </div>

                    {/* Remarks */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Keterangan Tambahan (Opsional)
                        </label>
                        <textarea
                            rows={2}
                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary"
                            value={formData.remarks}
                            onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-primary text-white hover:bg-primary-dark rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Menyimpan...' : 'Simpan Pengajuan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
