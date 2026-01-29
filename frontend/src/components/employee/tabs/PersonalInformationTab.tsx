/**
 * Personal Information Tab Component
 * Displays and edits employee personal information
 */

import React, { useState, useEffect, useCallback } from 'react';
import { TextInput, TextArea, Select, DatePicker } from '../../common/form';
import type { SelectOption } from '../../common/form';
import {
    Employee,
    PersonalInformationFormData,
    JenisKelamin,
    Agama,
    GolonganDarah,
    StatusPernikahan,
    UpdateEmployeeDTO,
} from '../../../types/employee.types';
import { employeeService } from '../../../services/employee.service';
import {
    validateEmail,
    validatePhone,
    validateNIK,
    validateNPWP,
    validateBPJS,
    validateDateRange,
} from '../../../utils/validation';

interface PersonalInformationTabProps {
    employee: Employee;
    onUpdate?: () => void;
}

// Select options
const jenisKelaminOptions: SelectOption[] = [
    { value: '', label: 'Pilih Jenis Kelamin' },
    { value: JenisKelamin.LAKI_LAKI, label: 'Laki-laki' },
    { value: JenisKelamin.PEREMPUAN, label: 'Perempuan' },
];

const agamaOptions: SelectOption[] = [
    { value: '', label: 'Pilih Agama' },
    { value: Agama.ISLAM, label: 'Islam' },
    { value: Agama.KRISTEN, label: 'Kristen' },
    { value: Agama.KATOLIK, label: 'Katolik' },
    { value: Agama.HINDU, label: 'Hindu' },
    { value: Agama.BUDDHA, label: 'Buddha' },
    { value: Agama.KONGHUCU, label: 'Konghucu' },
];

const golonganDarahOptions: SelectOption[] = [
    { value: '', label: 'Pilih Golongan Darah' },
    { value: GolonganDarah.A, label: 'A' },
    { value: GolonganDarah.B, label: 'B' },
    { value: GolonganDarah.AB, label: 'AB' },
    { value: GolonganDarah.O, label: 'O' },
];

const statusPernikahanOptions: SelectOption[] = [
    { value: '', label: 'Pilih Status Pernikahan' },
    { value: StatusPernikahan.BELUM_MENIKAH, label: 'Belum Menikah' },
    { value: StatusPernikahan.MENIKAH, label: 'Menikah' },
    { value: StatusPernikahan.CERAI_HIDUP, label: 'Cerai Hidup' },
    { value: StatusPernikahan.CERAI_MATI, label: 'Cerai Mati' },
];

// Helper to format date for input
const formatDateForInput = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    } catch {
        return '';
    }
};

// Initial form state factory
const createInitialFormData = (employee: Employee): PersonalInformationFormData => ({
    namaLengkap: employee.namaLengkap || '',
    jenisKelamin: employee.jenisKelamin || '',
    tempatLahir: employee.tempatLahir || '',
    tanggalLahir: formatDateForInput(employee.tanggalLahir),
    emailPribadi: employee.emailPribadi || '',
    agama: employee.agama || '',
    golonganDarah: employee.golonganDarah || '',
    nomorKartuKeluarga: '',
    nomorKTP: employee.nomorKTP || '',
    nomorNPWP: employee.nomorNPWP || '',
    nomorBPJS: employee.nomorBPJS || '',
    alamatDomisili: employee.alamatDomisili || '',
    kotaDomisili: '',
    provinsiDomisili: '',
    alamatKTP: employee.alamatKTP || '',
    kotaKTP: '',
    provinsiKTP: '',
    nomorHandphone: employee.nomorHandphone || '',
    nomorHandphone2: '',
    nomorTeleponRumah1: '',
    nomorTeleponRumah2: '',
    statusPernikahan: employee.statusPernikahan || '',
    namaPasangan: '',
    tanggalMenikah: '',
    tanggalCerai: '',
    tanggalWafatPasangan: '',
    pekerjaanPasangan: '',
    jumlahAnak: employee.anak?.length || '',
    nomorRekening: employee.nomorRekening || '',
    namaRekening: employee.namaRekening || '',
    namaBank: employee.namaBank || '',
    cabangBank: '',
});

type FormErrors = Partial<Record<keyof PersonalInformationFormData, string>>;

export const PersonalInformationTab: React.FC<PersonalInformationTabProps> = ({
    employee,
    onUpdate,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [formData, setFormData] = useState<PersonalInformationFormData>(() =>
        createInitialFormData(employee)
    );
    const [errors, setErrors] = useState<FormErrors>({});

    // Reset form when employee changes
    useEffect(() => {
        setFormData(createInitialFormData(employee));
        setErrors({});
        setSaveError(null);
        setSaveSuccess(false);
    }, [employee]);

    // Handle field change
    const handleChange = useCallback((field: keyof PersonalInformationFormData, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: undefined }));
        setSaveError(null);
        setSaveSuccess(false);
    }, []);

    // Copy domisili address to KTP
    const handleCopyDomisiliToKTP = useCallback(() => {
        setFormData(prev => ({
            ...prev,
            alamatKTP: prev.alamatDomisili,
            kotaKTP: prev.kotaDomisili,
            provinsiKTP: prev.provinsiDomisili,
        }));
    }, []);

    // Validate form
    const validateForm = useCallback((): boolean => {
        const newErrors: FormErrors = {};

        // Required fields
        if (!formData.namaLengkap.trim()) {
            newErrors.namaLengkap = 'Nama lengkap wajib diisi';
        }

        // Email validation
        if (formData.emailPribadi && !validateEmail(formData.emailPribadi)) {
            newErrors.emailPribadi = 'Format email tidak valid';
        }

        // Phone validation (primary)
        if (formData.nomorHandphone && !validatePhone(formData.nomorHandphone)) {
            newErrors.nomorHandphone = 'Nomor handphone tidak valid (10-15 digit)';
        }

        // Phone validation (secondary phone 2)
        if (formData.nomorHandphone2 && !validatePhone(formData.nomorHandphone2)) {
            newErrors.nomorHandphone2 = 'Nomor handphone 2 tidak valid (10-15 digit)';
        }

        // Phone validation (telepon rumah 1)
        if (formData.nomorTeleponRumah1 && !validatePhone(formData.nomorTeleponRumah1)) {
            newErrors.nomorTeleponRumah1 = 'Nomor telepon rumah 1 tidak valid';
        }

        // Phone validation (telepon rumah 2)
        if (formData.nomorTeleponRumah2 && !validatePhone(formData.nomorTeleponRumah2)) {
            newErrors.nomorTeleponRumah2 = 'Nomor telepon rumah 2 tidak valid';
        }

        // NIK validation
        if (formData.nomorKTP && !validateNIK(formData.nomorKTP)) {
            newErrors.nomorKTP = 'NIK harus 16 digit angka';
        }

        // NPWP validation
        if (formData.nomorNPWP && !validateNPWP(formData.nomorNPWP)) {
            newErrors.nomorNPWP = 'Format NPWP tidak valid';
        }

        // BPJS validation
        if (formData.nomorBPJS && !validateBPJS(formData.nomorBPJS)) {
            newErrors.nomorBPJS = 'Nomor BPJS tidak valid';
        }

        // Nomor Kartu Keluarga validation (16 digits)
        if (formData.nomorKartuKeluarga && !/^[0-9]{16}$/.test(formData.nomorKartuKeluarga)) {
            newErrors.nomorKartuKeluarga = 'Nomor kartu keluarga harus 16 digit angka';
        }

        // Marriage-related validations
        const isMarried = formData.statusPernikahan === StatusPernikahan.MENIKAH;
        const isDivorced = formData.statusPernikahan === StatusPernikahan.CERAI_HIDUP;
        const isWidowed = formData.statusPernikahan === StatusPernikahan.CERAI_MATI;

        // Tanggal menikah required when married/divorced/widowed
        if ((isMarried || isDivorced || isWidowed) && !formData.tanggalMenikah) {
            newErrors.tanggalMenikah = 'Tanggal menikah wajib diisi';
        }

        // Date range validation for marriage
        if (formData.tanggalMenikah && formData.tanggalCerai) {
            if (!validateDateRange(formData.tanggalMenikah, formData.tanggalCerai)) {
                newErrors.tanggalCerai = 'Tanggal cerai harus setelah tanggal menikah';
            }
        }

        // Tanggal cerai required when divorced
        if (isDivorced && !formData.tanggalCerai) {
            newErrors.tanggalCerai = 'Tanggal cerai wajib diisi';
        }

        // Tanggal wafat pasangan required when widowed
        if (isWidowed && !formData.tanggalWafatPasangan) {
            newErrors.tanggalWafatPasangan = 'Tanggal wafat pasangan wajib diisi';
        }

        // Jumlah anak validation (non-negative number)
        if (formData.jumlahAnak !== '' && formData.jumlahAnak !== undefined) {
            const jumlahAnakNum = typeof formData.jumlahAnak === 'string'
                ? parseInt(formData.jumlahAnak, 10)
                : formData.jumlahAnak;
            if (isNaN(jumlahAnakNum) || jumlahAnakNum < 0) {
                newErrors.jumlahAnak = 'Jumlah anak harus angka >= 0';
            }
        }

        // Nomor rekening validation (numeric only)
        if (formData.nomorRekening && !/^[0-9]{10,20}$/.test(formData.nomorRekening.replace(/[\s-]/g, ''))) {
            newErrors.nomorRekening = 'Nomor rekening harus 10-20 digit angka';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    // Handle save
    const handleSave = useCallback(async () => {
        if (!validateForm()) return;

        setIsSaving(true);
        setSaveError(null);

        try {
            const updateData: UpdateEmployeeDTO = {
                // Group 1: Biodata
                namaLengkap: formData.namaLengkap,
                jenisKelamin: formData.jenisKelamin || undefined,
                tempatLahir: formData.tempatLahir || undefined,
                tanggalLahir: formData.tanggalLahir || undefined,
                emailPribadi: formData.emailPribadi || undefined,

                // Group 2: Identifikasi
                agama: formData.agama || undefined,
                golonganDarah: formData.golonganDarah || undefined,
                nomorKartuKeluarga: formData.nomorKartuKeluarga || undefined,
                nomorKTP: formData.nomorKTP || undefined,
                nomorNPWP: formData.nomorNPWP || undefined,
                nomorBPJS: formData.nomorBPJS || undefined,

                // Group 3: Alamat Domisili
                alamatDomisili: formData.alamatDomisili || undefined,
                kotaDomisili: formData.kotaDomisili || undefined,
                provinsiDomisili: formData.provinsiDomisili || undefined,

                // Group 4: Alamat KTP
                alamatKTP: formData.alamatKTP || undefined,
                kotaKTP: formData.kotaKTP || undefined,
                provinsiKTP: formData.provinsiKTP || undefined,

                // Group 5: Kontak
                nomorHandphone: formData.nomorHandphone || undefined,
                nomorHandphone2: formData.nomorHandphone2 || undefined,
                nomorTeleponRumah1: formData.nomorTeleponRumah1 || undefined,
                nomorTeleponRumah2: formData.nomorTeleponRumah2 || undefined,

                // Group 6: Status Pernikahan
                statusPernikahan: formData.statusPernikahan || undefined,
                namaPasangan: formData.namaPasangan || undefined,
                tanggalMenikah: formData.tanggalMenikah || undefined,
                tanggalCerai: formData.tanggalCerai || undefined,
                tanggalWafatPasangan: formData.tanggalWafatPasangan || undefined,
                pekerjaanPasangan: formData.pekerjaanPasangan || undefined,
                jumlahAnak: typeof formData.jumlahAnak === 'number' ? formData.jumlahAnak : undefined,

                // Group 7: Rekening Bank
                nomorRekening: formData.nomorRekening || undefined,
                namaRekening: formData.namaRekening || undefined,
                namaBank: formData.namaBank || undefined,
                cabangBank: formData.cabangBank || undefined,
            };

            await employeeService.updateEmployee(employee.id, updateData);
            setSaveSuccess(true);
            setIsEditing(false);
            onUpdate?.();
        } catch (err) {
            console.error('Error saving personal information:', err);
            setSaveError('Gagal menyimpan data. Silakan coba lagi.');
        } finally {
            setIsSaving(false);
        }
    }, [formData, employee.id, validateForm, onUpdate]);

    // Handle cancel
    const handleCancel = useCallback(() => {
        setFormData(createInitialFormData(employee));
        setErrors({});
        setSaveError(null);
        setIsEditing(false);
    }, [employee]);

    // Check if marriage-related fields should show
    const showMarriageFields = formData.statusPernikahan &&
        formData.statusPernikahan !== StatusPernikahan.BELUM_MENIKAH;

    return (
        <div className="space-y-6">
            {/* Header with Edit button */}
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Informasi Pribadi
                </h2>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                        <span className="material-symbols-rounded text-lg">edit</span>
                        Edit
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={handleCancel}
                            disabled={isSaving}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors disabled:opacity-50"
                        >
                            {isSaving ? (
                                <>
                                    <span className="material-symbols-rounded text-lg animate-spin">sync</span>
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-rounded text-lg">save</span>
                                    Simpan
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Success/Error Messages */}
            {saveSuccess && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-400">
                        Data berhasil disimpan!
                    </p>
                </div>
            )}
            {saveError && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-700 dark:text-red-400">{saveError}</p>
                </div>
            )}

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
                        label="Nama Lengkap"
                        value={formData.namaLengkap}
                        onChange={(e) => handleChange('namaLengkap', e.target.value)}
                        error={errors.namaLengkap}
                        disabled={!isEditing}
                        required
                    />
                    <Select
                        label="Jenis Kelamin"
                        value={formData.jenisKelamin}
                        onChange={(e) => handleChange('jenisKelamin', e.target.value)}
                        options={jenisKelaminOptions}
                        disabled={!isEditing}
                    />
                    <TextInput
                        label="Tempat Lahir"
                        value={formData.tempatLahir}
                        onChange={(e) => handleChange('tempatLahir', e.target.value)}
                        disabled={!isEditing}
                    />
                    <DatePicker
                        label="Tanggal Lahir"
                        value={formData.tanggalLahir}
                        onChange={(value) => handleChange('tanggalLahir', value)}
                        disabled={!isEditing}
                        max={new Date().toISOString().split('T')[0]}
                    />
                    <TextInput
                        label="Email Pribadi"
                        type="email"
                        value={formData.emailPribadi}
                        onChange={(e) => handleChange('emailPribadi', e.target.value)}
                        error={errors.emailPribadi}
                        disabled={!isEditing}
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
                        value={formData.agama}
                        onChange={(e) => handleChange('agama', e.target.value)}
                        options={agamaOptions}
                        disabled={!isEditing}
                    />
                    <Select
                        label="Golongan Darah"
                        value={formData.golonganDarah}
                        onChange={(e) => handleChange('golonganDarah', e.target.value)}
                        options={golonganDarahOptions}
                        disabled={!isEditing}
                    />
                    <TextInput
                        label="Nomor Kartu Keluarga"
                        value={formData.nomorKartuKeluarga}
                        onChange={(e) => handleChange('nomorKartuKeluarga', e.target.value)}
                        error={errors.nomorKartuKeluarga}
                        helperText="16 digit angka"
                        disabled={!isEditing}
                    />
                    <TextInput
                        label="Nomor KTP (NIK)"
                        value={formData.nomorKTP}
                        onChange={(e) => handleChange('nomorKTP', e.target.value)}
                        error={errors.nomorKTP}
                        helperText="16 digit angka"
                        disabled={!isEditing}
                    />
                    <TextInput
                        label="Nomor NPWP"
                        value={formData.nomorNPWP}
                        onChange={(e) => handleChange('nomorNPWP', e.target.value)}
                        error={errors.nomorNPWP}
                        disabled={!isEditing}
                    />
                    <TextInput
                        label="Nomor BPJS"
                        value={formData.nomorBPJS}
                        onChange={(e) => handleChange('nomorBPJS', e.target.value)}
                        error={errors.nomorBPJS}
                        disabled={!isEditing}
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
                            value={formData.alamatDomisili}
                            onChange={(e) => handleChange('alamatDomisili', e.target.value)}
                            disabled={!isEditing}
                            rows={3}
                        />
                    </div>
                    <TextInput
                        label="Kota/Kabupaten"
                        value={formData.kotaDomisili}
                        onChange={(e) => handleChange('kotaDomisili', e.target.value)}
                        disabled={!isEditing}
                    />
                    <TextInput
                        label="Provinsi"
                        value={formData.provinsiDomisili}
                        onChange={(e) => handleChange('provinsiDomisili', e.target.value)}
                        disabled={!isEditing}
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
                    {isEditing && (
                        <button
                            type="button"
                            onClick={handleCopyDomisiliToKTP}
                            className="text-sm text-primary hover:text-primary-dark font-medium"
                        >
                            Sama dengan Domisili
                        </button>
                    )}
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="md:col-span-2 lg:col-span-3">
                        <TextArea
                            label="Alamat Lengkap"
                            value={formData.alamatKTP}
                            onChange={(e) => handleChange('alamatKTP', e.target.value)}
                            disabled={!isEditing}
                            rows={3}
                        />
                    </div>
                    <TextInput
                        label="Kota/Kabupaten"
                        value={formData.kotaKTP}
                        onChange={(e) => handleChange('kotaKTP', e.target.value)}
                        disabled={!isEditing}
                    />
                    <TextInput
                        label="Provinsi"
                        value={formData.provinsiKTP}
                        onChange={(e) => handleChange('provinsiKTP', e.target.value)}
                        disabled={!isEditing}
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
                        value={formData.nomorHandphone}
                        onChange={(e) => handleChange('nomorHandphone', e.target.value)}
                        error={errors.nomorHandphone}
                        disabled={!isEditing}
                        required
                    />
                    <TextInput
                        label="Nomor Handphone 2"
                        type="tel"
                        value={formData.nomorHandphone2}
                        onChange={(e) => handleChange('nomorHandphone2', e.target.value)}
                        error={errors.nomorHandphone2}
                        disabled={!isEditing}
                    />
                    <TextInput
                        label="Telepon Rumah 1"
                        type="tel"
                        value={formData.nomorTeleponRumah1}
                        onChange={(e) => handleChange('nomorTeleponRumah1', e.target.value)}
                        error={errors.nomorTeleponRumah1}
                        disabled={!isEditing}
                    />
                    <TextInput
                        label="Telepon Rumah 2"
                        type="tel"
                        value={formData.nomorTeleponRumah2}
                        onChange={(e) => handleChange('nomorTeleponRumah2', e.target.value)}
                        error={errors.nomorTeleponRumah2}
                        disabled={!isEditing}
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
                        value={formData.statusPernikahan}
                        onChange={(e) => handleChange('statusPernikahan', e.target.value)}
                        options={statusPernikahanOptions}
                        disabled={!isEditing}
                    />
                    <TextInput
                        label="Jumlah Anak"
                        type="number"
                        value={formData.jumlahAnak.toString()}
                        onChange={(e) => handleChange('jumlahAnak', parseInt(e.target.value) || '')}
                        error={errors.jumlahAnak}
                        disabled={!isEditing}
                        min="0"
                    />

                    {showMarriageFields && (
                        <>
                            <TextInput
                                label="Nama Pasangan"
                                value={formData.namaPasangan}
                                onChange={(e) => handleChange('namaPasangan', e.target.value)}
                                disabled={!isEditing}
                            />
                            <DatePicker
                                label="Tanggal Menikah"
                                value={formData.tanggalMenikah}
                                onChange={(value) => handleChange('tanggalMenikah', value)}
                                error={errors.tanggalMenikah}
                                disabled={!isEditing}
                                required
                            />
                            <TextInput
                                label="Pekerjaan Pasangan"
                                value={formData.pekerjaanPasangan}
                                onChange={(e) => handleChange('pekerjaanPasangan', e.target.value)}
                                disabled={!isEditing}
                            />
                            {formData.statusPernikahan === StatusPernikahan.CERAI_HIDUP && (
                                <DatePicker
                                    label="Tanggal Cerai"
                                    value={formData.tanggalCerai}
                                    onChange={(value) => handleChange('tanggalCerai', value)}
                                    error={errors.tanggalCerai}
                                    disabled={!isEditing}
                                />
                            )}
                            {formData.statusPernikahan === StatusPernikahan.CERAI_MATI && (
                                <DatePicker
                                    label="Tanggal Wafat Pasangan"
                                    value={formData.tanggalWafatPasangan}
                                    onChange={(value) => handleChange('tanggalWafatPasangan', value)}
                                    error={errors.tanggalWafatPasangan}
                                    disabled={!isEditing}
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
                        value={formData.namaBank}
                        onChange={(e) => handleChange('namaBank', e.target.value)}
                        disabled={!isEditing}
                    />
                    <TextInput
                        label="Cabang Bank"
                        value={formData.cabangBank}
                        onChange={(e) => handleChange('cabangBank', e.target.value)}
                        disabled={!isEditing}
                    />
                    <TextInput
                        label="Nomor Rekening"
                        value={formData.nomorRekening}
                        onChange={(e) => handleChange('nomorRekening', e.target.value)}
                        error={errors.nomorRekening}
                        helperText="10-20 digit angka"
                        disabled={!isEditing}
                    />
                    <TextInput
                        label="Nama Pemegang Rekening"
                        value={formData.namaRekening}
                        onChange={(e) => handleChange('namaRekening', e.target.value)}
                        disabled={!isEditing}
                    />
                </div>
            </div>
        </div>
    );
};

export default PersonalInformationTab;
