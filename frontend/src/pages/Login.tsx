import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

interface LoginFormData {
    nik: string;
    password: string;
}

export default function Login() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>();

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            // TODO: Implement actual login API call
            console.log('Login attempt:', data);

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // For now, just redirect to welcome page
            navigate('/');
        } catch {
            setError('Login gagal. Silakan periksa NIK dan password Anda.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 p-4">
            <div className="w-full max-w-md">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-medium mb-4">
                        <span className="material-symbols-outlined text-primary text-3xl">apartment</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-1">
                        {import.meta.env.VITE_APP_NAME || 'Bebang Sistem Informasi'}
                    </h1>
                    <p className="text-primary-100">Masuk ke akun Anda</p>
                </div>

                {/* Login Card */}
                <div className="card">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Error Message */}
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                            </div>
                        )}

                        {/* NIK Field */}
                        <div>
                            <label htmlFor="nik" className="label">
                                NIK
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-xl">
                                    badge
                                </span>
                                <input
                                    id="nik"
                                    type="text"
                                    placeholder="Masukkan NIK Anda"
                                    className="input pl-10"
                                    {...register('nik', {
                                        required: 'NIK wajib diisi',
                                        minLength: { value: 3, message: 'NIK minimal 3 karakter' },
                                    })}
                                />
                            </div>
                            {errors.nik && (
                                <p className="mt-1 text-sm text-red-500">{errors.nik.message}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="label">
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-xl">
                                    lock
                                </span>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Masukkan password"
                                    className="input pl-10"
                                    {...register('password', {
                                        required: 'Password wajib diisi',
                                        minLength: { value: 4, message: 'Password minimal 4 karakter' },
                                    })}
                                />
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg
                                        className="animate-spin h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Memproses...
                                </span>
                            ) : (
                                'Masuk'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                        <p>© 2024 Bebang Sistem Informasi</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
