/**
 * HR Information Tab Component
 * Displays and edits employee HR/employment information
 */

import React, { useState, useEffect, useCallback } from 'react';
import { TextInput, TextArea, Select, DatePicker, SearchableSelect } from '../../common/form';
import type { SelectOption, SearchableSelectOption } from '../../common/form';
import {
    Employee,
    HRInformationFormData,
    TingkatPendidikan,
    StatusKelulusan,
    UpdateEmployeeDTO,
} from '../../../types/employee.types';
import type {
    Divisi,
    Department,
    PosisiJabatan,
    JenisHubunganKerja,
    LokasiKerja,
    KategoriPangkat,
    Golongan,
    SubGolongan,
} from '../../../types/hr-master.types';
import { employeeService } from '../../../services/employee.service';
import { useHRMasterData } from '../../../hooks/useHRMasterData';
import { validateEmail, validatePhone } from '../../../utils/validation';

interface HRInformationTabProps {
    employee: Employee;
    onUpdate?: () => void;
}

// Select options for enums
const tingkatPendidikanOptions: SelectOption[] = [
    { value: '', label: 'Pilih Tingkat Pendidikan' },
    { value: TingkatPendidikan.SD, label: 'SD' },
    { value: TingkatPendidikan.SMP, label: 'SMP' },
    { value: TingkatPendidikan.SMA, label: 'SMA/SMK' },
    { value: TingkatPendidikan.D3, label: 'D3' },
    { value: TingkatPendidikan.S1, label: 'S1' },
    { value: TingkatPendidikan.S2, label: 'S2' },
    { value: TingkatPendidikan.S3, label: 'S3' },
];

const statusKelulusanOptions: SelectOption[] = [
    { value: '', label: 'Pilih Status Kelulusan' },
    { value: StatusKelulusan.LULUS, label: 'Lulus' },
    { value: StatusKelulusan.TIDAK_LULUS, label: 'Tidak Lulus' },
    { value: StatusKelulusan.SEDANG_BELAJAR, label: 'Sedang Belajar' },
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
const createInitialFormData = (employee: Employee): HRInformationFormData => ({
    // Section 1: Kepegawaian (from employee header)
    nomorIndukKaryawan: employee.nomorIndukKaryawan || '',
    posisiJabatanId: employee.posisiJabatanId || '',
    divisiId: employee.divisiId || '',
    departmentId: employee.departmentId || '',
    emailPerusahaan: employee.emailPerusahaan || '',
    managerId: employee.managerId || '',
    atasanLangsungId: employee.atasanLangsungId || '',

    // Section 2: Kontrak
    jenisHubunganKerjaId: employee.jenisHubunganKerjaId || '',
    tanggalMasukGroup: '',
    tanggalMasuk: formatDateForInput(employee.tanggalMasuk),
    tanggalPermanent: '',
    tanggalKontrak: '',
    tanggalAkhirKontrak: '',
    tanggalBerhenti: formatDateForInput(employee.tanggalKeluar),

    // Section 3: Education
    tingkatPendidikan: '',
    bidangStudi: '',
    namaSekolah: '',
    kotaSekolah: '',
    statusKelulusan: '',
    keteranganPendidikan: '',

    // Section 4: Pangkat dan Golongan
    kategoriPangkatId: '',
    golonganPangkatId: '',
    subGolonganPangkatId: '',
    noDanaPensiun: '',

    // Section 5: Kontak Darurat
    namaKontakDarurat1: '',
    nomorTeleponKontakDarurat1: '',
    hubunganKontakDarurat1: '',
    alamatKontakDarurat1: '',
    namaKontakDarurat2: '',
    nomorTeleponKontakDarurat2: '',
    hubunganKontakDarurat2: '',
    alamatKontakDarurat2: '',

    // Section 6: POO/POH & Seragam
    pointOfOriginal: '',
    pointOfHire: '',
    ukuranSeragamKerja: '',
    ukuranSepatuKerja: '',

    // Section 7: Pergerakan Karyawan
    lokasiSebelumnyaId: '',
    tanggalMutasi: '',

    // Section 8: Costing
    siklusPembayaranGaji: '',
    costing: '',
    assign: '',
    actual: '',
});

type FormErrors = Partial<Record<keyof HRInformationFormData, string>>;

export const HRInformationTab: React.FC<HRInformationTabProps> = ({
    employee,
    onUpdate,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [formData, setFormData] = useState<HRInformationFormData>(() =>
        createInitialFormData(employee)
    );
    const [errors, setErrors] = useState<FormErrors>({});
    const [employeeOptions, setEmployeeOptions] = useState<SearchableSelectOption[]>([]);
    const [employeeListLoading, setEmployeeListLoading] = useState(false);

    // Fetch employee list for Manager/Atasan dropdowns
    useEffect(() => {
        const fetchEmployees = async () => {
            setEmployeeListLoading(true);
            try {
                // Fetch all employees (using a large limit for now)
                const response = await employeeService.getEmployees({ limit: 1000 });
                const options = response.data
                    .filter(emp => emp.id !== employee.id) // Exclude self
                    .map(emp => ({
                        value: emp.id,
                        label: `${emp.namaLengkap} (${emp.nomorIndukKaryawan})`,
                    }));
                setEmployeeOptions(options);
            } catch (err) {
                console.error('Error fetching employee list:', err);
            } finally {
                setEmployeeListLoading(false);
            }
        };

        fetchEmployees();
    }, [employee.id]);

    // Fetch master data for dropdowns - using proper types from hr-master.types.ts
    const { data: divisiData, loading: divisiLoading } = useHRMasterData<Divisi>('divisi');
    const { data: departmentData, loading: departmentLoading } = useHRMasterData<Department>('department');
    const { data: posisiData, loading: posisiLoading } = useHRMasterData<PosisiJabatan>('posisi-jabatan');
    const { data: jenisHubunganData, loading: jenisHubunganLoading } = useHRMasterData<JenisHubunganKerja>('jenis-hubungan-kerja');
    const { data: lokasiData, loading: lokasiLoading } = useHRMasterData<LokasiKerja>('lokasi-kerja');
    const { data: kategoriPangkatData, loading: kategoriPangkatLoading } = useHRMasterData<KategoriPangkat>('kategori-pangkat');
    const { data: golonganData, loading: golonganLoading } = useHRMasterData<Golongan>('golongan');
    const { data: subGolonganData, loading: subGolonganLoading } = useHRMasterData<SubGolongan>('sub-golongan');

    // Convert master data to select options
    const divisiOptions: SearchableSelectOption[] = divisiData.map(d => ({ value: d.id, label: d.namaDivisi }));
    const departmentOptions: SearchableSelectOption[] = departmentData.map(d => ({ value: d.id, label: d.namaDepartment }));
    const posisiOptions: SearchableSelectOption[] = posisiData.map(d => ({ value: d.id, label: d.namaPosisiJabatan }));
    const jenisHubunganOptions: SearchableSelectOption[] = jenisHubunganData.map(d => ({ value: d.id, label: d.namaJenisHubunganKerja }));
    const lokasiOptions: SearchableSelectOption[] = lokasiData.map(d => ({ value: d.id, label: d.namaLokasiKerja }));
    const kategoriPangkatOptions: SearchableSelectOption[] = kategoriPangkatData.map(d => ({ value: d.id, label: d.namaKategoriPangkat }));
    const golonganOptions: SearchableSelectOption[] = golonganData.map(d => ({ value: d.id, label: d.namaGolongan }));
    const subGolonganOptions: SearchableSelectOption[] = subGolonganData.map(d => ({ value: d.id, label: d.namaSubGolongan }));

    // Reset form when employee changes
    useEffect(() => {
        setFormData(createInitialFormData(employee));
        setErrors({});
        setSaveError(null);
        setSaveSuccess(false);
    }, [employee]);

    // Handle field change
    const handleChange = useCallback((field: keyof HRInformationFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: undefined }));
        setSaveError(null);
        setSaveSuccess(false);
    }, []);

    // Validate form
    const validateForm = useCallback((): boolean => {
        const newErrors: FormErrors = {};

        // Email perusahaan validation
        if (formData.emailPerusahaan && !validateEmail(formData.emailPerusahaan)) {
            newErrors.emailPerusahaan = 'Format email tidak valid';
        }

        // Phone validation for emergency contacts
        if (formData.nomorTeleponKontakDarurat1 && !validatePhone(formData.nomorTeleponKontakDarurat1)) {
            newErrors.nomorTeleponKontakDarurat1 = 'Nomor telepon tidak valid';
        }
        if (formData.nomorTeleponKontakDarurat2 && !validatePhone(formData.nomorTeleponKontakDarurat2)) {
            newErrors.nomorTeleponKontakDarurat2 = 'Nomor telepon tidak valid';
        }

        // Contract date validation
        if (formData.tanggalKontrak && formData.tanggalAkhirKontrak) {
            if (new Date(formData.tanggalAkhirKontrak) < new Date(formData.tanggalKontrak)) {
                newErrors.tanggalAkhirKontrak = 'Tanggal akhir kontrak harus setelah tanggal mulai';
            }
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
                // Kepegawaian (Header fields - usually read only but included in case of updates)
                // nomorIndukKaryawan: formData.nomorIndukKaryawan, // Cannot update NIK usually
                posisiJabatanId: formData.posisiJabatanId || undefined,
                divisiId: formData.divisiId || undefined,
                departmentId: formData.departmentId || undefined,
                emailPerusahaan: formData.emailPerusahaan || undefined,
                managerId: formData.managerId || undefined,
                atasanLangsungId: formData.atasanLangsungId || undefined,

                // Kontrak
                jenisHubunganKerjaId: formData.jenisHubunganKerjaId || undefined,
                tanggalMasukGroup: formData.tanggalMasukGroup || undefined,
                tanggalMasuk: formData.tanggalMasuk || undefined,
                tanggalPermanent: formData.tanggalPermanent || undefined,
                tanggalKontrak: formData.tanggalKontrak || undefined,
                tanggalAkhirKontrak: formData.tanggalAkhirKontrak || undefined,
                tanggalBerhenti: formData.tanggalBerhenti || undefined,

                // Education
                tingkatPendidikan: formData.tingkatPendidikan || undefined,
                bidangStudi: formData.bidangStudi || undefined,
                namaSekolah: formData.namaSekolah || undefined,
                kotaSekolah: formData.kotaSekolah || undefined,
                statusKelulusan: formData.statusKelulusan || undefined,
                keteranganPendidikan: formData.keteranganPendidikan || undefined,

                // Pangkat dan Golongan
                kategoriPangkatId: formData.kategoriPangkatId || undefined,
                golonganPangkatId: formData.golonganPangkatId || undefined,
                subGolonganPangkatId: formData.subGolonganPangkatId || undefined,
                noDanaPensiun: formData.noDanaPensiun || undefined,

                // Kontak Darurat
                namaKontakDarurat1: formData.namaKontakDarurat1 || undefined,
                nomorTeleponKontakDarurat1: formData.nomorTeleponKontakDarurat1 || undefined,
                hubunganKontakDarurat1: formData.hubunganKontakDarurat1 || undefined,
                alamatKontakDarurat1: formData.alamatKontakDarurat1 || undefined,
                namaKontakDarurat2: formData.namaKontakDarurat2 || undefined,
                nomorTeleponKontakDarurat2: formData.nomorTeleponKontakDarurat2 || undefined,
                hubunganKontakDarurat2: formData.hubunganKontakDarurat2 || undefined,
                alamatKontakDarurat2: formData.alamatKontakDarurat2 || undefined,

                // POO/POH & Seragam
                pointOfOriginal: formData.pointOfOriginal || undefined,
                pointOfHire: formData.pointOfHire || undefined,
                ukuranSeragamKerja: formData.ukuranSeragamKerja || undefined,
                ukuranSepatuKerja: formData.ukuranSepatuKerja || undefined,

                // Pergerakan Karyawan
                lokasiSebelumnyaId: formData.lokasiSebelumnyaId || undefined,
                tanggalMutasi: formData.tanggalMutasi || undefined,

                // Costing
                siklusPembayaranGaji: formData.siklusPembayaranGaji || undefined,
                costing: formData.costing || undefined,
                assign: formData.assign || undefined,
                actual: formData.actual || undefined,
            };

            await employeeService.updateEmployee(employee.id, updateData);
            setSaveSuccess(true);
            setIsEditing(false);
            onUpdate?.();
        } catch (err) {
            console.error('Error saving HR information:', err);
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

    return (
        <div className="space-y-6">
            {/* Header with Edit button */}
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Informasi HR
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

            {/* Section 1: Kepegawaian */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                    <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                        <span className="material-symbols-rounded text-primary">badge</span>
                        Kepegawaian
                    </h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <TextInput
                        label="NIK"
                        value={formData.nomorIndukKaryawan}
                        onChange={(e) => handleChange('nomorIndukKaryawan', e.target.value)}
                        disabled
                        helperText="Data dari header profil"
                    />
                    <SearchableSelect
                        label="Posisi Jabatan"
                        value={formData.posisiJabatanId}
                        onChange={(val) => handleChange('posisiJabatanId', val)}
                        options={posisiOptions}
                        loading={posisiLoading}
                        disabled
                    />
                    <SearchableSelect
                        label="Divisi"
                        value={formData.divisiId}
                        onChange={(val) => handleChange('divisiId', val)}
                        options={divisiOptions}
                        loading={divisiLoading}
                        disabled
                    />
                    <SearchableSelect
                        label="Department"
                        value={formData.departmentId}
                        onChange={(val) => handleChange('departmentId', val)}
                        options={departmentOptions}
                        loading={departmentLoading}
                        disabled
                    />
                    <TextInput
                        label="Email Perusahaan"
                        type="email"
                        value={formData.emailPerusahaan}
                        onChange={(e) => handleChange('emailPerusahaan', e.target.value)}
                        error={errors.emailPerusahaan}
                        disabled
                    />
                    <SearchableSelect
                        label="Manager"
                        value={formData.managerId || ''}
                        onChange={(val) => handleChange('managerId', val)}
                        options={employeeOptions}
                        loading={employeeListLoading}
                        disabled={!isEditing}
                    />
                    <SearchableSelect
                        label="Atasan Langsung"
                        value={formData.atasanLangsungId || ''}
                        onChange={(val) => handleChange('atasanLangsungId', val)}
                        options={employeeOptions}
                        loading={employeeListLoading}
                        disabled={!isEditing}
                    />
                </div>
            </div>

            {/* Section 2: Kontrak */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                    <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                        <span className="material-symbols-rounded text-primary">history_edu</span>
                        Kontrak
                    </h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <SearchableSelect
                        label="Jenis Hubungan Kerja"
                        value={formData.jenisHubunganKerjaId}
                        onChange={(val) => handleChange('jenisHubunganKerjaId', val)}
                        options={jenisHubunganOptions}
                        loading={jenisHubunganLoading}
                        disabled={!isEditing}
                    />
                    <DatePicker
                        label="Tanggal Masuk Group"
                        value={formData.tanggalMasukGroup}
                        onChange={(val) => handleChange('tanggalMasukGroup', val)}
                        disabled={!isEditing}
                    />
                    <DatePicker
                        label="Tanggal Masuk"
                        value={formData.tanggalMasuk}
                        onChange={(val) => handleChange('tanggalMasuk', val)}
                        disabled={!isEditing}
                    />
                    <DatePicker
                        label="Tanggal Permanent"
                        value={formData.tanggalPermanent}
                        onChange={(val) => handleChange('tanggalPermanent', val)}
                        disabled={!isEditing}
                    />
                    <DatePicker
                        label="Tanggal Kontrak"
                        value={formData.tanggalKontrak}
                        onChange={(val) => handleChange('tanggalKontrak', val)}
                        disabled={!isEditing}
                    />
                    <DatePicker
                        label="Tanggal Akhir Kontrak"
                        value={formData.tanggalAkhirKontrak}
                        onChange={(val) => handleChange('tanggalAkhirKontrak', val)}
                        error={errors.tanggalAkhirKontrak}
                        disabled={!isEditing}
                    />
                    <DatePicker
                        label="Tanggal Berhenti"
                        value={formData.tanggalBerhenti}
                        onChange={(val) => handleChange('tanggalBerhenti', val)}
                        disabled={!isEditing}
                    />
                </div>
            </div>

            {/* Section 3: Education */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                    <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                        <span className="material-symbols-rounded text-primary">school</span>
                        Pendidikan
                    </h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                        label="Tingkat Pendidikan"
                        value={formData.tingkatPendidikan}
                        onChange={(e) => handleChange('tingkatPendidikan', e.target.value)}
                        options={tingkatPendidikanOptions}
                        disabled={!isEditing}
                    />
                    <TextInput
                        label="Bidang Studi"
                        value={formData.bidangStudi}
                        onChange={(e) => handleChange('bidangStudi', e.target.value)}
                        disabled={!isEditing}
                    />
                    <TextInput
                        label="Nama Sekolah/Universitas"
                        value={formData.namaSekolah}
                        onChange={(e) => handleChange('namaSekolah', e.target.value)}
                        disabled={!isEditing}
                    />
                    <TextInput
                        label="Kota Sekolah"
                        value={formData.kotaSekolah}
                        onChange={(e) => handleChange('kotaSekolah', e.target.value)}
                        disabled={!isEditing}
                    />
                    <Select
                        label="Status Kelulusan"
                        value={formData.statusKelulusan}
                        onChange={(e) => handleChange('statusKelulusan', e.target.value)}
                        options={statusKelulusanOptions}
                        disabled={!isEditing}
                    />
                    <div className="md:col-span-2">
                        <TextArea
                            label="Keterangan Pendidikan"
                            value={formData.keteranganPendidikan}
                            onChange={(e) => handleChange('keteranganPendidikan', e.target.value)}
                            disabled={!isEditing}
                            rows={3}
                        />
                    </div>
                </div>
            </div>

            {/* Section 4: Pangkat dan Golongan */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                    <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                        <span className="material-symbols-rounded text-primary">military_tech</span>
                        Pangkat dan Golongan
                    </h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SearchableSelect
                        label="Kategori Pangkat"
                        value={formData.kategoriPangkatId}
                        onChange={(val) => handleChange('kategoriPangkatId', val)}
                        options={kategoriPangkatOptions}
                        loading={kategoriPangkatLoading}
                        disabled={!isEditing}
                    />
                    <SearchableSelect
                        label="Golongan Pangkat"
                        value={formData.golonganPangkatId}
                        onChange={(val) => handleChange('golonganPangkatId', val)}
                        options={golonganOptions}
                        loading={golonganLoading}
                        disabled={!isEditing}
                    />
                    <SearchableSelect
                        label="Sub Golongan Pangkat"
                        value={formData.subGolonganPangkatId}
                        onChange={(val) => handleChange('subGolonganPangkatId', val)}
                        options={subGolonganOptions}
                        loading={subGolonganLoading}
                        disabled={!isEditing}
                    />
                    <TextInput
                        label="No Dana Pensiun"
                        value={formData.noDanaPensiun}
                        onChange={(e) => handleChange('noDanaPensiun', e.target.value)}
                        disabled={!isEditing}
                    />
                </div>
            </div>

            {/* Section 5: Kontak Darurat */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                    <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                        <span className="material-symbols-rounded text-primary">contact_emergency</span>
                        Kontak Darurat
                    </h3>
                </div>
                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Emergency Contact 1 */}
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4">
                        <h4 className="font-medium text-gray-900 dark:text-white">Kontak Darurat 1</h4>
                        <TextInput
                            label="Nama"
                            value={formData.namaKontakDarurat1}
                            onChange={(e) => handleChange('namaKontakDarurat1', e.target.value)}
                            disabled={!isEditing}
                        />
                        <TextInput
                            label="Nomor Telepon"
                            type="tel"
                            value={formData.nomorTeleponKontakDarurat1}
                            onChange={(e) => handleChange('nomorTeleponKontakDarurat1', e.target.value)}
                            error={errors.nomorTeleponKontakDarurat1}
                            disabled={!isEditing}
                        />
                        <TextInput
                            label="Hubungan"
                            value={formData.hubunganKontakDarurat1}
                            onChange={(e) => handleChange('hubunganKontakDarurat1', e.target.value)}
                            disabled={!isEditing}
                        />
                        <TextArea
                            label="Alamat"
                            value={formData.alamatKontakDarurat1}
                            onChange={(e) => handleChange('alamatKontakDarurat1', e.target.value)}
                            disabled={!isEditing}
                            rows={2}
                        />
                    </div>

                    {/* Emergency Contact 2 */}
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4">
                        <h4 className="font-medium text-gray-900 dark:text-white">Kontak Darurat 2</h4>
                        <TextInput
                            label="Nama"
                            value={formData.namaKontakDarurat2}
                            onChange={(e) => handleChange('namaKontakDarurat2', e.target.value)}
                            disabled={!isEditing}
                        />
                        <TextInput
                            label="Nomor Telepon"
                            type="tel"
                            value={formData.nomorTeleponKontakDarurat2}
                            onChange={(e) => handleChange('nomorTeleponKontakDarurat2', e.target.value)}
                            error={errors.nomorTeleponKontakDarurat2}
                            disabled={!isEditing}
                        />
                        <TextInput
                            label="Hubungan"
                            value={formData.hubunganKontakDarurat2}
                            onChange={(e) => handleChange('hubunganKontakDarurat2', e.target.value)}
                            disabled={!isEditing}
                        />
                        <TextArea
                            label="Alamat"
                            value={formData.alamatKontakDarurat2}
                            onChange={(e) => handleChange('alamatKontakDarurat2', e.target.value)}
                            disabled={!isEditing}
                            rows={2}
                        />
                    </div>
                </div>
            </div>

            {/* Section 6: POO/POH & Seragam */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                    <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                        <span className="material-symbols-rounded text-primary">apparel</span>
                        POO/POH & Seragam
                    </h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextInput
                        label="Point of Original"
                        value={formData.pointOfOriginal}
                        onChange={(e) => handleChange('pointOfOriginal', e.target.value)}
                        disabled={!isEditing}
                    />
                    <TextInput
                        label="Point of Hire"
                        value={formData.pointOfHire}
                        onChange={(e) => handleChange('pointOfHire', e.target.value)}
                        disabled={!isEditing}
                    />
                    <TextInput
                        label="Ukuran Seragam Kerja"
                        value={formData.ukuranSeragamKerja}
                        onChange={(e) => handleChange('ukuranSeragamKerja', e.target.value)}
                        disabled={!isEditing}
                        placeholder="S/M/L/XL/XXL"
                    />
                    <TextInput
                        label="Ukuran Sepatu Kerja"
                        value={formData.ukuranSepatuKerja}
                        onChange={(e) => handleChange('ukuranSepatuKerja', e.target.value)}
                        disabled={!isEditing}
                        placeholder="38/39/40/41/42/43"
                    />
                </div>
            </div>

            {/* Section 7: Pergerakan Karyawan */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                    <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                        <span className="material-symbols-rounded text-primary">swap_horiz</span>
                        Pergerakan Karyawan
                    </h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SearchableSelect
                        label="Lokasi Sebelumnya"
                        value={formData.lokasiSebelumnyaId}
                        onChange={(val) => handleChange('lokasiSebelumnyaId', val)}
                        options={lokasiOptions}
                        loading={lokasiLoading}
                        disabled={!isEditing}
                    />
                    <DatePicker
                        label="Tanggal Mutasi"
                        value={formData.tanggalMutasi}
                        onChange={(val) => handleChange('tanggalMutasi', val)}
                        disabled={!isEditing}
                    />
                </div>
            </div>

            {/* Section 8: Costing */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                    <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                        <span className="material-symbols-rounded text-primary">payments</span>
                        Costing
                    </h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextInput
                        label="Siklus Pembayaran Gaji"
                        value={formData.siklusPembayaranGaji}
                        onChange={(e) => handleChange('siklusPembayaranGaji', e.target.value)}
                        disabled={!isEditing}
                    />
                    <TextInput
                        label="Costing"
                        value={formData.costing}
                        onChange={(e) => handleChange('costing', e.target.value)}
                        disabled={!isEditing}
                    />
                    <TextInput
                        label="Assign"
                        value={formData.assign}
                        onChange={(e) => handleChange('assign', e.target.value)}
                        disabled={!isEditing}
                    />
                    <TextInput
                        label="Actual"
                        value={formData.actual}
                        onChange={(e) => handleChange('actual', e.target.value)}
                        disabled={!isEditing}
                    />
                </div>
            </div>
        </div>
    );
};

export default HRInformationTab;
