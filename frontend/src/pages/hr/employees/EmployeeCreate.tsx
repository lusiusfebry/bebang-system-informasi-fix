
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useToast } from '../../../components/common';
import { employeeService } from '../../../services/employee.service';
import { CreateEmployeeDTO, JenisKelamin, Agama, GolonganDarah, StatusPernikahan } from '../../../types/employee.types';
import { TextInput, TextArea, Select, DatePicker } from '../../../components/common/form';

// Select options (reused from PersonalInformationTab to ensure consistency)
const jenisKelaminOptions = [
    { value: '', label: 'Pilih Jenis Kelamin' },
    { value: JenisKelamin.LAKI_LAKI, label: 'Laki-laki' },
    { value: JenisKelamin.PEREMPUAN, label: 'Perempuan' },
];

const agamaOptions = [
    { value: '', label: 'Pilih Agama' },
    { value: Agama.ISLAM, label: 'Islam' },
    { value: Agama.KRISTEN, label: 'Kristen' },
    { value: Agama.KATOLIK, label: 'Katolik' },
    { value: Agama.HINDU, label: 'Hindu' },
    { value: Agama.BUDDHA, label: 'Buddha' },
    { value: Agama.KONGHUCU, label: 'Konghucu' },
];

const golonganDarahOptions = [
    { value: '', label: 'Pilih Golongan Darah' },
    { value: GolonganDarah.A, label: 'A' },
    { value: GolonganDarah.B, label: 'B' },
    { value: GolonganDarah.AB, label: 'AB' },
    { value: GolonganDarah.O, label: 'O' },
];

const statusPernikahanOptions = [
    { value: '', label: 'Pilih Status Pernikahan' },
    { value: StatusPernikahan.BELUM_MENIKAH, label: 'Belum Menikah' },
    { value: StatusPernikahan.MENIKAH, label: 'Menikah' },
    { value: StatusPernikahan.CERAI_HIDUP, label: 'Cerai Hidup' },
    { value: StatusPernikahan.CERAI_MATI, label: 'Cerai Mati' },
];

export default function EmployeeCreate() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [submitting, setSubmitting] = useState(false);

    // Using partial to allow partial updates during form filling, but we'll validate required fields
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CreateEmployeeDTO>({
        defaultValues: {
            // Set defaults to avoid uncontrolled input warnings
            jenisKelamin: undefined,
            agama: undefined,
            golonganDarah: undefined,
            statusPernikahan: undefined
        }
    });

    const statusPernikahan = watch('statusPernikahan');

    // Logic to show/hide marriage fields based on status
    const showMarriageFields = statusPernikahan && statusPernikahan !== StatusPernikahan.BELUM_MENIKAH;

    const onSubmit: SubmitHandler<CreateEmployeeDTO> = async (data) => {
        setSubmitting(true);
        try {
            // Prepare data for API (handle dates, etc.)
            const payload: CreateEmployeeDTO = {
                ...data,
                // Ensure dates are in ISO format if present
                tanggalMasuk: data.tanggalMasuk ? new Date(data.tanggalMasuk).toISOString() : new Date().toISOString(),
                tanggalLahir: data.tanggalLahir ? new Date(data.tanggalLahir).toISOString() : undefined,
                tanggalMenikah: data.tanggalMenikah ? new Date(data.tanggalMenikah).toISOString() : undefined,
                tanggalCerai: data.tanggalCerai ? new Date(data.tanggalCerai).toISOString() : undefined,
                tanggalWafatPasangan: data.tanggalWafatPasangan ? new Date(data.tanggalWafatPasangan).toISOString() : undefined,
                // Parse numbers
                jumlahAnak: data.jumlahAnak ? Number(data.jumlahAnak) : 0,
            };

            const newEmployee = await employeeService.createEmployee(payload);

            showToast('Karyawan berhasil ditambahkan', 'success');
            navigate(`/hr/employees/${newEmployee.id}`);
        } catch (error) {
            console.error('Error creating employee:', error);
            showToast('Gagal menambahkan karyawan. Periksa kembali input Anda.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    // Helper to copy Domisili to KTP
    const copyDomisiliToKtp = () => {
        const domisili = watch('alamatDomisili');
        const kota = watch('kotaDomisili');
        const provinsi = watch('provinsiDomisili');

        setValue('alamatKTP', domisili);
        setValue('kotaKTP', kota);
        setValue('provinsiKTP', provinsi);
    };

    return (
        <div className="container mx-auto max-w-6xl px-4 py-6">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <button
                        onClick={() => navigate('/hr/employees')}
                        className="flex items-center text-gray-500 hover:text-gray-700 transition-colors mb-2"
                        type="button"
                    >
                        <span className="material-symbols-rounded mr-1">arrow_back</span>
                        Kembali ke Daftar
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tambah Karyawan Baru</h1>
                    <p className="text-gray-600 dark:text-gray-400">Lengkapi data diri karyawan baru di bawah ini.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* Group 1: Biodata Karyawan */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                        <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                            <span className="material-symbols-rounded text-primary">person</span>
                            Biodata Karyawan
                        </h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <TextInput
                            label="Nomor Induk Karyawan"
                            {...register('nomorIndukKaryawan', { required: 'NIK wajib diisi' })}
                            error={errors.nomorIndukKaryawan?.message}
                            placeholder="Contoh: MP-2024-001"
                            required
                        />
                        <TextInput
                            label="Nama Lengkap"
                            {...register('namaLengkap', { required: 'Nama Lengkap wajib diisi' })}
                            error={errors.namaLengkap?.message}
                            placeholder="Nama Lengkap Karyawan"
                            required
                        />
                        <Select
                            label="Jenis Kelamin"
                            {...register('jenisKelamin')}
                            options={jenisKelaminOptions}
                        />
                        <TextInput
                            label="Tempat Lahir"
                            {...register('tempatLahir')}
                        />
                        <DatePicker
                            label="Tanggal Lahir"
                            {...register('tanggalLahir')}
                            max={new Date().toISOString().split('T')[0]}
                        />
                        <TextInput
                            label="Email Pribadi"
                            type="email"
                            {...register('emailPribadi', {
                                required: 'Email wajib diisi',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Format email tidak valid"
                                }
                            })}
                            error={errors.emailPribadi?.message}
                            placeholder="email@contoh.com"
                            required
                        />
                        <DatePicker
                            label="Tanggal Bergabung"
                            {...register('tanggalMasuk', { required: 'Tanggal bergabung wajib diisi' })}
                            error={errors.tanggalMasuk?.message}
                            required
                        />
                    </div>
                </div>

                {/* Group 2: Identifikasi */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                        <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                            <span className="material-symbols-rounded text-primary">badge</span>
                            Identifikasi
                        </h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Select
                            label="Agama"
                            {...register('agama')}
                            options={agamaOptions}
                        />
                        <Select
                            label="Golongan Darah"
                            {...register('golonganDarah')}
                            options={golonganDarahOptions}
                        />
                        <TextInput
                            label="Nomor Kartu Keluarga"
                            {...register('nomorKartuKeluarga', {
                                pattern: { value: /^[0-9]{16}$/, message: "Harus 16 digit angka" }
                            })}
                            error={errors.nomorKartuKeluarga?.message}
                            helperText="16 digit angka"
                        />
                        <TextInput
                            label="Nomor KTP (NIK)"
                            {...register('nomorKTP', {
                                pattern: { value: /^[0-9]{16}$/, message: "Harus 16 digit angka" }
                            })}
                            error={errors.nomorKTP?.message}
                            helperText="16 digit angka"
                        />
                        <TextInput
                            label="Nomor NPWP"
                            {...register('nomorNPWP')}
                        />
                        <TextInput
                            label="Nomor BPJS"
                            {...register('nomorBPJS')}
                        />
                    </div>
                </div>

                {/* Group 3: Alamat Domisili */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                        <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                            <span className="material-symbols-rounded text-primary">home</span>
                            Alamat Domisili
                        </h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="md:col-span-2 lg:col-span-3">
                            <TextArea
                                label="Alamat Lengkap"
                                {...register('alamatDomisili')}
                                rows={3}
                            />
                        </div>
                        <TextInput
                            label="Kota/Kabupaten"
                            {...register('kotaDomisili')}
                        />
                        <TextInput
                            label="Provinsi"
                            {...register('provinsiDomisili')}
                        />
                    </div>
                </div>

                {/* Group 4: Alamat KTP */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 flex justify-between items-center">
                        <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                            <span className="material-symbols-rounded text-primary">contact_mail</span>
                            Alamat KTP
                        </h3>
                        <button
                            type="button"
                            onClick={copyDomisiliToKtp}
                            className="text-sm text-primary hover:text-primary-dark font-medium"
                        >
                            Sama dengan Domisili
                        </button>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="md:col-span-2 lg:col-span-3">
                            <TextArea
                                label="Alamat Lengkap"
                                {...register('alamatKTP')}
                                rows={3}
                            />
                        </div>
                        <TextInput
                            label="Kota/Kabupaten"
                            {...register('kotaKTP')}
                        />
                        <TextInput
                            label="Provinsi"
                            {...register('provinsiKTP')}
                        />
                    </div>
                </div>

                {/* Group 5: Informasi Kontak */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                        <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                            <span className="material-symbols-rounded text-primary">call</span>
                            Informasi Kontak
                        </h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <TextInput
                            label="Nomor Handphone"
                            type="tel"
                            {...register('nomorHandphone', { required: 'Nomor Handphone wajib diisi' })}
                            error={errors.nomorHandphone?.message}
                            required
                        />
                        <TextInput
                            label="Nomor Handphone 2"
                            type="tel"
                            {...register('nomorHandphone2')}
                        />
                        <TextInput
                            label="Telepon Rumah 1"
                            type="tel"
                            {...register('nomorTeleponRumah1')}
                        />
                        <TextInput
                            label="Telepon Rumah 2"
                            type="tel"
                            {...register('nomorTeleponRumah2')}
                        />
                    </div>
                </div>

                {/* Group 6: Status Pernikahan */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                        <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                            <span className="material-symbols-rounded text-primary">favorite</span>
                            Status Pernikahan dan Anak
                        </h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Select
                            label="Status Pernikahan"
                            {...register('statusPernikahan')}
                            options={statusPernikahanOptions}
                        />
                        <TextInput
                            label="Jumlah Anak"
                            type="number"
                            {...register('jumlahAnak', { min: 0 })}
                            min="0"
                        />

                        {showMarriageFields && (
                            <>
                                <TextInput
                                    label="Nama Pasangan"
                                    {...register('namaPasangan')}
                                />
                                <DatePicker
                                    label="Tanggal Menikah"
                                    {...register('tanggalMenikah', { required: 'Tanggal menikah wajib diisi jika menikah' })}
                                    error={errors.tanggalMenikah?.message}
                                    required
                                />
                                <TextInput
                                    label="Pekerjaan Pasangan"
                                    {...register('pekerjaanPasangan')}
                                />
                                {statusPernikahan === StatusPernikahan.CERAI_HIDUP && (
                                    <DatePicker
                                        label="Tanggal Cerai"
                                        {...register('tanggalCerai', { required: 'Tanggal cerai wajib diisi' })}
                                        error={errors.tanggalCerai?.message}
                                        required
                                    />
                                )}
                                {statusPernikahan === StatusPernikahan.CERAI_MATI && (
                                    <DatePicker
                                        label="Tanggal Wafat Pasangan"
                                        {...register('tanggalWafatPasangan', { required: 'Tanggal wafat wajib diisi' })}
                                        error={errors.tanggalWafatPasangan?.message}
                                        required
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Group 7: Rekening Bank */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                        <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                            <span className="material-symbols-rounded text-primary">account_balance</span>
                            Rekening Bank
                        </h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <TextInput
                            label="Nama Bank"
                            {...register('namaBank')}
                        />
                        <TextInput
                            label="Cabang Bank"
                            {...register('cabangBank')}
                        />
                        <TextInput
                            label="Nomor Rekening"
                            {...register('nomorRekening', {
                                pattern: { value: /^[0-9]{10,20}$/, message: "Harus 10-20 digit angka" }
                            })}
                            error={errors.nomorRekening?.message}
                            helperText="10-20 digit angka"
                        />
                        <TextInput
                            label="Nama Pemegang Rekening"
                            {...register('namaPemegangRekening')}
                        />
                    </div>
                </div>

                {/* Submit Actions */}
                <div className="flex justify-end gap-4 pt-6 pb-12">
                    <button
                        type="button"
                        onClick={() => navigate('/hr/employees')}
                        className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 font-medium"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-primary/30 font-medium"
                    >
                        {submitting && <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                        <span>Simpan Karyawan Baru</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
