export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="shrink-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                    <span>© {currentYear} Bebang Sistem Informasi.</span>
                    <span className="hidden sm:inline">PT Prima Sarana Gemilang</span>
                </div>
                <div className="flex items-center gap-4">
                    <a href="/help" className="hover:text-primary transition-colors">
                        Help
                    </a>
                    <span className="hidden sm:inline text-gray-300 dark:text-gray-600">|</span>
                    <a href="#" className="hover:text-primary transition-colors">
                        Privacy
                    </a>
                    <span className="hidden sm:inline text-gray-300 dark:text-gray-600">|</span>
                    <a href="#" className="hover:text-primary transition-colors">
                        Terms
                    </a>
                </div>
            </div>
        </footer>
    );
}
