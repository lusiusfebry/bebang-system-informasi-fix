interface ModuleCardProps {
    id: string;
    name: string;
    description: string;
    icon: string;
    isHighlighted?: boolean;
    comingSoon?: boolean;
    isDashed?: boolean;
    onClick?: () => void;
}

export default function ModuleCard({
    name,
    description,
    icon,
    isHighlighted = false,
    comingSoon = false,
    isDashed = false,
    onClick,
}: ModuleCardProps) {
    const handleClick = () => {
        if (!comingSoon && onClick) {
            onClick();
        }
    };

    if (isDashed) {
        return (
            <div
                onClick={handleClick}
                className="relative flex flex-col justify-between p-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 min-h-[200px] cursor-pointer hover:border-primary dark:hover:border-primary transition-all opacity-60 hover:opacity-80"
            >
                <div>
                    <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 text-2xl">
                            {icon}
                        </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">{name}</h3>
                    <p className="text-sm text-gray-400 dark:text-gray-500">{description}</p>
                </div>
            </div>
        );
    }

    if (isHighlighted) {
        return (
            <div
                onClick={handleClick}
                className="relative flex flex-col justify-between p-6 rounded-xl bg-primary text-white border border-primary min-h-[200px] cursor-pointer hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-1 transition-all"
            >
                <div>
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-white text-2xl">{icon}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{name}</h3>
                    <p className="text-sm text-white/80">{description}</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium mt-4">
                    <span>Buka Modul</span>
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={handleClick}
            className={`relative flex flex-col justify-between p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 min-h-[200px] transition-all ${comingSoon
                    ? 'opacity-60 cursor-not-allowed'
                    : 'cursor-pointer hover:shadow-md hover:-translate-y-1'
                }`}
        >
            {comingSoon && (
                <span className="absolute top-4 right-4 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-xs font-medium rounded-full">
                    Segera Hadir
                </span>
            )}
            <div>
                <div className="w-12 h-12 rounded-xl bg-background-light dark:bg-gray-800 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-primary text-2xl">{icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
            </div>
            {!comingSoon && (
                <div className="flex items-center gap-2 text-sm font-medium text-primary mt-4">
                    <span>Buka Modul</span>
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </div>
            )}
        </div>
    );
}
