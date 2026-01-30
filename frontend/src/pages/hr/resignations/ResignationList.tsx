import { useState, useEffect } from 'react';
import { useToast } from '../../../components/common';
import { resignationService } from '../../../services/resignation.service';
import { Resignation, ResignationStatus } from '../../../types/resignation.types';
import ResignationForm from './ResignationForm';

export default function ResignationList() {
    const { showToast } = useToast();
    const [resignations, setResignations] = useState<Resignation[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const [filters, setFilters] = useState({
        search: '',
        status: '' as ResignationStatus | ''
    });

    // Pagination
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1
    });

    useEffect(() => {
        fetchResignations();
    }, [pagination.page, refreshTrigger, filters]);

    const fetchResignations = async () => {
        try {
            setLoading(true);
            const response = await resignationService.getAll({
                page: pagination.page,
                limit: pagination.limit,
                search: filters.search,
                status: filters.status || undefined
            });
            setResignations(response.data);
            setPagination(prev => ({
                ...prev,
                total: response.meta.total,
                totalPages: response.meta.totalPages
            }));
        } catch (error) {
            console.error('Error fetching resignations:', error);
            showToast('Gagal memuat data resignasi', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        if (!confirm('Apakah Anda yakin ingin menyetujui pengajuan ini? Status karyawan akan berubah menjadi TIDAK AKTIF.')) return;

        try {
            await resignationService.approve(id);
            showToast('Pengajuan disetujui', 'success');
            setRefreshTrigger(prev => prev + 1);
        } catch {
            showToast('Gagal menyetujui pengajuan', 'error');
        }
    };

    const handleReject = async (id: string) => {
        const reason = prompt('Masukkan alasan penolakan:');
        if (reason === null) return; // Cancelled
        if (!reason) {
            showToast('Alasan penolakan wajib diisi', 'error');
            return;
        }

        try {
            await resignationService.reject(id, reason);
            showToast('Pengajuan ditolak', 'success');
            setRefreshTrigger(prev => prev + 1);
        } catch {
            showToast('Gagal menolak pengajuan', 'error');
        }
    };

    const getStatusColor = (status: ResignationStatus) => {
        switch (status) {
            case ResignationStatus.APPROVED: return 'bg-green-100 text-green-800';
            case ResignationStatus.REJECTED: return 'bg-red-100 text-red-800';
            case ResignationStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manajemen Resign & Terminasi</h1>
                    <p className="text-gray-500 text-sm mt-1">Kelola pengajuan resign dan terminasi karyawan</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <span className="material-symbols-rounded">add</span>
                    Buat Pengajuan
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6 flex gap-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Cari nama karyawan..."
                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    />
                </div>
                <select
                    className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as ResignationStatus }))}
                >
                    <option value="">Semua Status</option>
                    <option value={ResignationStatus.PENDING}>Pending</option>
                    <option value={ResignationStatus.APPROVED}>Disetujui</option>
                    <option value={ResignationStatus.REJECTED}>Ditolak</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Karyawan</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Tipe</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Tanggal Efektif</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Alasan</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Memuat data...</td>
                            </tr>
                        ) : resignations.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Tidak ada data ditemukan</td>
                            </tr>
                        ) : (
                            resignations.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900 dark:text-white">{item.karyawan?.namaLengkap}</div>
                                        <div className="text-xs text-gray-500">{item.karyawan?.nomorIndukKaryawan}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{item.type}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(item.effectiveDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs" title={item.reason}>
                                        {item.reason}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.status === ResignationStatus.PENDING && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleApprove(item.id)}
                                                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                    title="Setujui"
                                                >
                                                    <span className="material-symbols-rounded">check</span>
                                                </button>
                                                <button
                                                    onClick={() => handleReject(item.id)}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                    title="Tolak"
                                                >
                                                    <span className="material-symbols-rounded">close</span>
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination Controls could go here */}
            </div>

            {/* Form Modal */}
            {showForm && (
                <ResignationForm
                    onClose={() => setShowForm(false)}
                    onSuccess={() => {
                        setShowForm(false);
                        setRefreshTrigger(prev => prev + 1);
                    }}
                />
            )}
        </div>
    );
}
