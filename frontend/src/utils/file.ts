export const getFileUrl = (filePath: string): string => {
    if (!filePath) return '';
    if (filePath.startsWith('http')) return filePath;
    // Ensure one slash if filePath doesn't start with /
    const cleanPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
    // Assuming backend serves uploads at /uploads
    // Adjust if you use a full URL in config
    return `${import.meta.env.VITE_API_URL || ''}/uploads${cleanPath}`;
};
