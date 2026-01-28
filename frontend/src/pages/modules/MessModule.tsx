import MainLayout from '../../components/layout/MainLayout';

export default function MessModule() {
    return (
        <MainLayout>
            <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                <a href="/" className="hover:text-primary transition-colors">Home</a>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span className="text-gray-900 dark:text-white font-medium">Mess Management</span>
            </nav>

            <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-3xl">restaurant</span>
                </div>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white">Mess Management</h1>
                    <p className="text-gray-600 dark:text-gray-400">Kelola mess, katering, dan akomodasi karyawan</p>
                </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
                <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-2xl">construction</span>
                    <div>
                        <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-1">Segera Hadir</h3>
                        <p className="text-amber-700 dark:text-amber-400 text-sm">
                            Modul Mess Management sedang dalam tahap pengembangan dan akan segera tersedia.
                        </p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
