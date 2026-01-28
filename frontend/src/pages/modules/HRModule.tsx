import MainLayout from '../../components/layout/MainLayout';

export default function HRModule() {
    return (
        <MainLayout>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                <a href="/" className="hover:text-primary transition-colors">Home</a>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span className="text-gray-900 dark:text-white font-medium">Human Resources</span>
            </nav>

            {/* Page Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-3xl">groups</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Human Resources</h1>
                        <p className="text-gray-600 dark:text-gray-400">Kelola data karyawan dan administrasi HR</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { icon: 'person_add', label: 'Tambah Karyawan', color: 'bg-blue-500' },
                    { icon: 'badge', label: 'Data Karyawan', color: 'bg-green-500' },
                    { icon: 'event', label: 'Cuti & Absensi', color: 'bg-orange-500' },
                    { icon: 'analytics', label: 'Laporan HR', color: 'bg-purple-500' },
                ].map((action, index) => (
                    <button
                        key={index}
                        className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-md hover:-translate-y-0.5 transition-all"
                    >
                        <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center`}>
                            <span className="material-symbols-outlined text-white text-xl">{action.icon}</span>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{action.label}</span>
                    </button>
                ))}
            </div>

            {/* Under Development Notice */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
                <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-2xl">construction</span>
                    <div>
                        <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-1">Modul Dalam Pengembangan</h3>
                        <p className="text-amber-700 dark:text-amber-400 text-sm">
                            Fitur lengkap HR module sedang dalam tahap pengembangan. Stay tuned untuk update selanjutnya!
                        </p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
