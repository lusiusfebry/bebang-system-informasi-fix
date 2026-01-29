
import React from 'react';

interface AvatarProps {
    src?: string | null;
    name: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string; // Allow custom classes
}

export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', className = '' }) => {
    // Generate initials (max 2 chars)
    const initials = name
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    // Generate random background color based on name
    const colors = [
        'bg-red-500', 'bg-orange-500', 'bg-amber-500',
        'bg-yellow-500', 'bg-lime-500', 'bg-green-500',
        'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500',
        'bg-sky-500', 'bg-blue-500', 'bg-indigo-500',
        'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500',
        'bg-pink-500', 'bg-rose-500'
    ];

    // Simple hash function to pick color
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const bgColor = colors[hash % colors.length];

    // Size mappings
    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base',
        xl: 'w-16 h-16 text-lg'
    };

    return (
        <div
            className={`
                relative inline-flex items-center justify-center 
                rounded-full overflow-hidden 
                ${sizeClasses[size]} 
                ${!src ? `${bgColor} text-white font-medium` : 'bg-gray-200'}
                ${className}
            `}
        >
            {src ? (
                <img
                    src={src}
                    alt={name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        // Fallback to initials if image fails to load
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement?.classList.add(bgColor, 'text-white', 'font-medium');
                        e.currentTarget.parentElement?.classList.remove('bg-gray-200');
                        // Inject initials into parent div
                        const textNode = document.createTextNode(initials);
                        e.currentTarget.parentElement?.appendChild(textNode);
                    }}
                />
            ) : (
                <span>{initials}</span>
            )}
        </div>
    );
};
