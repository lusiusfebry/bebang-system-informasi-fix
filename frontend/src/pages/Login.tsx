import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';

interface LoginFormData {
    nik: string;
    password: string;
}

export default function Login() {
    const navigate = useNavigate();
    const { login, isAuthenticated, isLoading: authLoading } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>();

    // Redirect if already authenticated
    if (!authLoading && isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            await login(data.nik, data.password);
            navigate('/');
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Login gagal. Silakan periksa NIK dan password Anda.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-stretch overflow-x-hidden">
            <div className="flex w-full min-h-screen">
                {/* Left Side: Hero Industrial Background */}
                <div className="hidden lg:flex lg:w-3/5 relative bg-primary items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-primary/40 mix-blend-multiply z-10"></div>
                        <div
                            className="w-full h-full bg-center bg-no-repeat bg-cover transform scale-105"
                            style={{
                                backgroundImage: `url('https://images.unsplash.com/photo-1581093458791-9d15482442f6?q=80&w=2070&auto=format&fit=crop')`,
                            }}
                        ></div>
                    </div>
                    <div className="relative z-20 px-12 text-white max-w-2xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="size-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                                <span className="material-symbols-outlined text-primary text-3xl">apartment</span>
                            </div>
                            <h1 className="text-3xl font-black tracking-tight">Bebang Sistem Informasi</h1>
                        </div>
                        <h2 className="text-5xl font-bold leading-tight mb-6">
                            Layanan Data Terpadu PT Prima Sarana Gemilang
                        </h2>
                        <p className="text-xl font-light leading-relaxed text-white/90">
                            Sistem informasi manajemen karyawan yang efisien, transparan, dan terintegrasi untuk
                            mendukung operasional perusahaan di setiap lini.
                        </p>
                        <div className="mt-12 flex gap-4">
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20">
                                <span className="material-symbols-outlined text-white">verified_user</span>
                                <span className="text-sm font-medium">Secure Access</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20">
                                <span className="material-symbols-outlined text-white">monitoring</span>
                                <span className="text-sm font-medium">Real-time Data</span>
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-10 left-12 z-20">
                        <p className="text-white/60 text-sm">© 2024 PT Prima Sarana Gemilang. All rights reserved.</p>
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="w-full lg:w-2/5 flex flex-col items-center justify-center p-8 bg-white dark:bg-background-dark">
                    <div className="w-full max-w-md space-y-8">
                        {/* Mobile Logo */}
                        <div className="text-center lg:hidden flex flex-col items-center mb-10">
                            <div className="size-12 bg-primary rounded-xl flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-white text-2xl">apartment</span>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Bebang Sistem Informasi
                            </h2>
                        </div>

                        {/* Login Header */}
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                                Login ke Akun Anda
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400">
                                Silakan masukkan NIK dan kata sandi untuk melanjutkan.
                            </p>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-8">
                            {/* Error Message */}
                            {error && (
                                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-lg">error</span>
                                        {error}
                                    </p>
                                </div>
                            )}

                            {/* NIK Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Nomor Induk Karyawan (NIK)
                                </label>
                                <div className="relative flex items-center">
                                    <span className="material-symbols-outlined absolute left-4 text-slate-400">
                                        badge
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Masukkan NIK Anda"
                                        className="w-full h-14 pl-12 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        {...register('nik', {
                                            required: 'NIK wajib diisi',
                                            minLength: { value: 3, message: 'NIK minimal 3 karakter' },
                                        })}
                                    />
                                </div>
                                {errors.nik && (
                                    <p className="text-sm text-red-500">{errors.nik.message}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        Kata Sandi
                                    </label>
                                    <a
                                        href="#"
                                        className="text-xs font-bold text-primary hover:underline transition-all"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        Lupa Kata Sandi?
                                    </a>
                                </div>
                                <div className="relative flex items-center">
                                    <span className="material-symbols-outlined absolute left-4 text-slate-400">
                                        lock
                                    </span>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Masukkan kata sandi"
                                        className="w-full h-14 pl-12 pr-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        {...register('password', {
                                            required: 'Password wajib diisi',
                                            minLength: { value: 4, message: 'Password minimal 4 karakter' },
                                        })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                    >
                                        <span className="material-symbols-outlined">
                                            {showPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-red-500">{errors.password.message}</p>
                                )}
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 bg-primary text-white font-bold rounded-lg shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
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
                                        <span>Memproses...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Masuk ke Dashboard</span>
                                        <span className="material-symbols-outlined">login</span>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Help Link */}
                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Mengalami masalah saat login?{' '}
                                <a href="#" className="text-primary font-bold hover:underline">
                                    Hubungi IT Support
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* Mobile Footer */}
                    <div className="mt-12 lg:hidden text-center">
                        <p className="text-slate-400 text-xs">© 2024 PT Prima Sarana Gemilang</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
