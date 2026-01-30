/**
 * Family Information Tab Component
 * Displays and edits employee family information (Spouse, Children, Siblings, Parents-in-law)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { TextInput, TextArea, Select, DatePicker } from '../../common/form';
import type { SelectOption } from '../../common/form';
import {
    Employee,
    Anak,
    SaudaraKandung,
    JenisKelamin,
    CreateAnakDTO,
    CreateSaudaraKandungDTO,
    UpdateEmployeeDTO,
} from '../../../types/employee.types';
import { employeeService } from '../../../services/employee.service';

interface FamilyInformationTabProps {
    employee: Employee;
    onUpdate?: () => void;
}

interface FamilyInformationFormData {
    // Pasangan
    namaPasangan: string;
    tanggalLahirPasangan: string;
    pendidikanTerakhirPasangan: string;
    pekerjaanPasangan: string;
    jumlahAnak: number | '';
    keteranganPasangan: string;

    // Saudara Kandung Summary
    anakKe: number | '';
    jumlahSaudaraKandung: number | '';

    // Orang Tua Mertua
    namaAyahMertua: string;
    tanggalLahirAyahMertua: string;
    pendidikanTerakhirAyahMertua: string;
    keteranganAyahMertua: string;
    namaIbuMertua: string;
    tanggalLahirIbuMertua: string;
    pendidikanTerakhirIbuMertua: string;
    keteranganIbuMertua: string;
}

// Select options
const jenisKelaminOptions: SelectOption[] = [
    { value: 'LAKI_LAKI', label: 'Laki-laki' },
    { value: 'PEREMPUAN', label: 'Perempuan' },
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

const createInitialFormData = (employee: Employee): FamilyInformationFormData => ({
    // Pasangan
    namaPasangan: employee.namaPasangan || '',
    tanggalLahirPasangan: formatDateForInput(employee.tanggalLahirPasangan),
    pendidikanTerakhirPasangan: employee.pendidikanTerakhirPasangan || '',
    pekerjaanPasangan: employee.pekerjaanPasangan || '',
    jumlahAnak: employee.jumlahAnak ?? '',
    keteranganPasangan: employee.keteranganPasangan || '',

    // Saudara Kandung Summary
    anakKe: employee.anakKe ?? '',
    jumlahSaudaraKandung: employee.jumlahSaudaraKandung ?? '',

    // Orang Tua Mertua
    namaAyahMertua: employee.namaAyahMertua || '',
    tanggalLahirAyahMertua: formatDateForInput(employee.tanggalLahirAyahMertua),
    pendidikanTerakhirAyahMertua: employee.pendidikanTerakhirAyahMertua || '',
    keteranganAyahMertua: employee.keteranganAyahMertua || '',
    namaIbuMertua: employee.namaIbuMertua || '',
    tanggalLahirIbuMertua: formatDateForInput(employee.tanggalLahirIbuMertua),
    pendidikanTerakhirIbuMertua: employee.pendidikanTerakhirIbuMertua || '',
    keteranganIbuMertua: employee.keteranganIbuMertua || '',
});

export const FamilyInformationTab: React.FC<FamilyInformationTabProps> = ({
    employee,
    onUpdate,
}) => {
    // Main Form State
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<FamilyInformationFormData>(() => createInitialFormData(employee));
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Child & Sibling Data State
    const [anakList, setAnakList] = useState<Anak[]>(employee.anak || []);
    const [saudaraList, setSaudaraList] = useState<SaudaraKandung[]>(employee.saudaraKandung || []);

    // Child Form State
    const [showAnakForm, setShowAnakForm] = useState(false);
    const [editingAnakId, setEditingAnakId] = useState<string | null>(null);
    const [anakFormData, setAnakFormData] = useState<CreateAnakDTO>({
        urutanAnak: 1,
        namaAnak: '',
        jenisKelamin: JenisKelamin.LAKI_LAKI,
        tanggalLahir: '',
        keterangan: '',
    });

    // Sibling Form State
    const [showSaudaraForm, setShowSaudaraForm] = useState(false);
    const [editingSaudaraId, setEditingSaudaraId] = useState<string | null>(null);
    const [saudaraFormData, setSaudaraFormData] = useState<CreateSaudaraKandungDTO>({
        urutanSaudara: 1,
        namaSaudaraKandung: '',
        jenisKelamin: JenisKelamin.LAKI_LAKI,
        tanggalLahir: '',
        pendidikanTerakhir: '',
        pekerjaan: '',
    });

    // Reset form when employee changes
    useEffect(() => {
        setFormData(createInitialFormData(employee));
        setAnakList(employee.anak || []);
        setSaudaraList(employee.saudaraKandung || []);
        setErrors({});
        setSaveError(null);
        setSaveSuccess(false);
    }, [employee]);

    // Update anakList when loading from props/API results isn't enough (e.g. need to fetch separately? 
    // Usually employee detail includes these. Assuming employee object is updated)

    // Handle field change
    const handleChange = useCallback((field: keyof FamilyInformationFormData, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear specific error if needed
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    }, [errors]);

    // Validation
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Helper to validate date is not in future
        const isFutureDate = (dateStr: string) => {
            if (!dateStr) return false;
            return new Date(dateStr) > new Date();
        };

        // Pasangan
        if (formData.tanggalLahirPasangan && isFutureDate(formData.tanggalLahirPasangan)) {
            newErrors.tanggalLahirPasangan = 'Tanggal lahir tidak boleh di masa depan';
        }

        // Parent In Laws
        if (formData.tanggalLahirAyahMertua && isFutureDate(formData.tanggalLahirAyahMertua)) {
            newErrors.tanggalLahirAyahMertua = 'Tanggal lahir tidak boleh di masa depan';
        }
        if (formData.tanggalLahirIbuMertua && isFutureDate(formData.tanggalLahirIbuMertua)) {
            newErrors.tanggalLahirIbuMertua = 'Tanggal lahir tidak boleh di masa depan';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Main Save Handler
    const handleSave = async () => {
        if (!validateForm()) return;

        setIsSaving(true);
        setSaveError(null);

        try {
            const updateData: UpdateEmployeeDTO = {
                // Pasangan
                namaPasangan: formData.namaPasangan || undefined,
                tanggalLahirPasangan: formData.tanggalLahirPasangan || undefined,
                pendidikanTerakhirPasangan: formData.pendidikanTerakhirPasangan || undefined,
                pekerjaanPasangan: formData.pekerjaanPasangan || undefined,
                jumlahAnak: formData.jumlahAnak === '' ? undefined : Number(formData.jumlahAnak),
                keteranganPasangan: formData.keteranganPasangan || undefined,

                // Saudara Summary
                anakKe: formData.anakKe === '' ? undefined : Number(formData.anakKe),
                jumlahSaudaraKandung: saudaraList.length, // Auto-sync logic

                // Orang Tua Mertua
                namaAyahMertua: formData.namaAyahMertua || undefined,
                tanggalLahirAyahMertua: formData.tanggalLahirAyahMertua || undefined,
                pendidikanTerakhirAyahMertua: formData.pendidikanTerakhirAyahMertua || undefined,
                keteranganAyahMertua: formData.keteranganAyahMertua || undefined,
                namaIbuMertua: formData.namaIbuMertua || undefined,
                tanggalLahirIbuMertua: formData.tanggalLahirIbuMertua || undefined,
                pendidikanTerakhirIbuMertua: formData.pendidikanTerakhirIbuMertua || undefined,
                keteranganIbuMertua: formData.keteranganIbuMertua || undefined,
            };

            await employeeService.updateEmployee(employee.id, updateData);
            setSaveSuccess(true);
            setIsEditing(false);
            onUpdate?.();
        } catch (err) {
            console.error('Error saving family info:', err);
            setSaveError('Gagal menyimpan data keluarga.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData(createInitialFormData(employee));
        setIsEditing(false);
        setErrors({});
        setSaveError(null);
    };

    return (
        <div className="space-y-6">
            {/* Header with Edit Button */}
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Informasi Keluarga
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

            {/* Messages */}
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

            {/* Section 1: Pasangan */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                    <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                        <span className="material-symbols-rounded text-primary">family_history</span>
                        Pasangan
                    </h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextInput
                        label="Nama Pasangan"
                        value={formData.namaPasangan}
                        onChange={(e) => handleChange('namaPasangan', e.target.value)}
                        disabled={!isEditing}
                    />
                    <DatePicker
                        label="Tanggal Lahir Pasangan"
                        value={formData.tanggalLahirPasangan}
                        onChange={(val) => handleChange('tanggalLahirPasangan', val)}
                        disabled={!isEditing}
                    />
                    <TextInput
                        label="Pendidikan Terakhir"
                        value={formData.pendidikanTerakhirPasangan}
                        onChange={(e) => handleChange('pendidikanTerakhirPasangan', e.target.value)}
                        disabled={!isEditing}
                    />
                    <TextInput
                        label="Pekerjaan"
                        value={formData.pekerjaanPasangan}
                        onChange={(e) => handleChange('pekerjaanPasangan', e.target.value)}
                        disabled={!isEditing}
                    />
                    <TextInput
                        label="Jumlah Anak"
                        type="number"
                        value={anakList.length} // Auto-sync
                        onChange={() => { }} // Read-only
                        disabled={true}
                        helperText="Otomatis dari jumlah data anak"
                    />
                    <div className="md:col-span-2">
                        <TextArea
                            label="Keterangan Pasangan"
                            value={formData.keteranganPasangan}
                            onChange={(e) => handleChange('keteranganPasangan', e.target.value)}
                            disabled={!isEditing}
                            rows={2}
                        />
                    </div>
                </div>
            </div>

            {/* Section 2: Identitas Anak */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 flex justify-between items-center">
                    <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                        <span className="material-symbols-rounded text-primary">child_care</span>
                        Identitas Anak
                    </h3>
                    <button
                        onClick={() => {
                            setAnakFormData({
                                urutanAnak: anakList.length + 1,
                                namaAnak: '',
                                jenisKelamin: JenisKelamin.LAKI_LAKI,
                                tanggalLahir: '',
                                keterangan: '',
                            });
                            setEditingAnakId(null);
                            setShowAnakForm(true);
                        }}
                        className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1"
                    >
                        <span className="material-symbols-rounded">add</span>
                        Tambah Anak
                    </button>
                </div>

                {/* Anak List */}
                {!showAnakForm && (
                    <div className="p-6">
                        {anakList.length === 0 ? (
                            <p className="text-gray-500 text-center italic py-4">Belum ada data anak</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {anakList.map((anak) => (
                                    <div key={anak.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className={`material-symbols-rounded p-2 rounded-full ${anak.jenisKelamin === 'LAKI_LAKI' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                                                    {anak.jenisKelamin === 'LAKI_LAKI' ? 'boy' : 'girl'}
                                                </span>
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-white">{anak.namaAnak}</h4>
                                                    <p className="text-xs text-gray-500">Anak ke-{anak.urutanAnak}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => {
                                                        setAnakFormData({
                                                            urutanAnak: anak.urutanAnak,
                                                            namaAnak: anak.namaAnak,
                                                            jenisKelamin: anak.jenisKelamin,
                                                            tanggalLahir: formatDateForInput(anak.tanggalLahir),
                                                            keterangan: anak.keterangan || '',
                                                        });
                                                        setEditingAnakId(anak.id);
                                                        setShowAnakForm(true);
                                                    }}
                                                    className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                                                >
                                                    <span className="material-symbols-rounded text-lg">edit</span>
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        if (confirm('Yakin ingin menghapus data anak ini?')) {
                                                            try {
                                                                await employeeService.deleteAnak(employee.id, anak.id);
                                                                setAnakList(prev => prev.filter(a => a.id !== anak.id));
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    jumlahAnak: prev.jumlahAnak === '' ? 0 : (Number(prev.jumlahAnak) - 1)
                                                                }));
                                                            } catch {
                                                                alert('Gagal menghapus data anak');
                                                            }
                                                        }
                                                    }}
                                                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <span className="material-symbols-rounded text-lg">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400 ml-11">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-rounded text-base text-gray-400">cake</span>
                                                <span>{anak.tanggalLahir ? new Date(anak.tanggalLahir).toLocaleDateString('id-ID') : '-'}</span>
                                            </div>
                                            {anak.keterangan && (
                                                <p className="italic mt-2 text-xs">"{anak.keterangan}"</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Anak Form (Inline) */}
                {showAnakForm && (
                    <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                            {editingAnakId ? 'Edit Data Anak' : 'Tambah Anak Baru'}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <TextInput
                                label="Nama Anak"
                                value={anakFormData.namaAnak}
                                onChange={(e) => setAnakFormData(prev => ({ ...prev, namaAnak: e.target.value }))}
                                required
                            />
                            <Select
                                label="Jenis Kelamin"
                                value={anakFormData.jenisKelamin}
                                onChange={(e) => setAnakFormData(prev => ({ ...prev, jenisKelamin: e.target.value as JenisKelamin }))}
                                options={jenisKelaminOptions}
                                required
                            />
                            <DatePicker
                                label="Tanggal Lahir"
                                value={anakFormData.tanggalLahir || ''}
                                onChange={(val) => setAnakFormData(prev => ({ ...prev, tanggalLahir: val || '' }))}
                                required
                            />
                            <TextInput
                                label="Urutan Anak"
                                type="number"
                                value={anakFormData.urutanAnak}
                                onChange={(e) => setAnakFormData(prev => ({ ...prev, urutanAnak: Number(e.target.value) }))}
                                required
                            />
                            <div className="md:col-span-2">
                                <TextArea
                                    label="Keterangan"
                                    value={anakFormData.keterangan}
                                    onChange={(e) => setAnakFormData(prev => ({ ...prev, keterangan: e.target.value }))}
                                    rows={2}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowAnakForm(false)}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium"
                            >
                                Batal
                            </button>
                            <button
                                onClick={async () => {
                                    if (!anakFormData.namaAnak || !anakFormData.tanggalLahir) {
                                        alert('Nama dan Tanggal Lahir wajib diisi');
                                        return;
                                    }
                                    try {
                                        if (editingAnakId) {
                                            const updated = await employeeService.updateAnak(employee.id, editingAnakId, anakFormData);
                                            setAnakList(prev => prev.map(a => a.id === editingAnakId ? updated : a));
                                        } else {
                                            const created = await employeeService.createAnak(employee.id, anakFormData);
                                            setAnakList(prev => [...prev, created]);
                                            setFormData(prev => ({
                                                ...prev,
                                                jumlahAnak: prev.jumlahAnak === '' ? 1 : (Number(prev.jumlahAnak) + 1)
                                            }));
                                        }
                                        setShowAnakForm(false);
                                    } catch {
                                        alert('Gagal menyimpan data anak');
                                    }
                                }}
                                className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark font-medium"
                            >
                                Simpan Anak
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Section 3: Saudara Kandung */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                    <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                        <span className="material-symbols-rounded text-primary">groups</span>
                        Saudara Kandung
                    </h3>
                </div>
                <div className="p-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <TextInput
                            label="Anak Ke-"
                            type="number"
                            value={formData.anakKe}
                            onChange={(e) => handleChange('anakKe', e.target.value)}
                            disabled={!isEditing}
                        />
                        <TextInput
                            label="Jumlah Saudara Kandung"
                            type="number"
                            value={saudaraList.length} // Auto-sync
                            onChange={() => { }} // Read-only
                            disabled={true}
                            helperText="Otomatis dari jumlah data saudara"
                        />
                    </div>

                    {/* Saudara List */}
                    <div className="mb-4 flex justify-between items-center">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Daftar Saudara</h4>
                        <button
                            onClick={() => {
                                if (saudaraList.length >= 5) {
                                    alert('Maksimal 5 saudara kandung');
                                    return;
                                }
                                setSaudaraFormData({
                                    urutanSaudara: saudaraList.length + 1,
                                    namaSaudaraKandung: '',
                                    jenisKelamin: JenisKelamin.LAKI_LAKI,
                                    tanggalLahir: '',
                                    pendidikanTerakhir: '',
                                    pekerjaan: '',
                                });
                                setEditingSaudaraId(null);
                                setShowSaudaraForm(true);
                            }}
                            className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1"
                        >
                            <span className="material-symbols-rounded">add</span>
                            Tambah Saudara
                        </button>
                    </div>

                    {/* Saudara Form (Inline) */}
                    {showSaudaraForm && (
                        <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                                {editingSaudaraId ? 'Edit Data Saudara' : 'Tambah Saudara Baru'}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <TextInput
                                    label="Nama Saudara"
                                    value={saudaraFormData.namaSaudaraKandung}
                                    onChange={(e) => setSaudaraFormData(prev => ({ ...prev, namaSaudaraKandung: e.target.value }))}
                                    required
                                />
                                <Select
                                    label="Jenis Kelamin"
                                    value={saudaraFormData.jenisKelamin}
                                    onChange={(e) => setSaudaraFormData(prev => ({ ...prev, jenisKelamin: e.target.value as JenisKelamin }))}
                                    options={jenisKelaminOptions}
                                    required
                                />
                                <DatePicker
                                    label="Tanggal Lahir"
                                    value={saudaraFormData.tanggalLahir || ''}
                                    onChange={(val) => setSaudaraFormData(prev => ({ ...prev, tanggalLahir: val || '' }))}
                                    required
                                />
                                <TextInput
                                    label="Urutan Saudara"
                                    type="number"
                                    value={saudaraFormData.urutanSaudara}
                                    onChange={(e) => setSaudaraFormData(prev => ({ ...prev, urutanSaudara: Number(e.target.value) }))}
                                    required
                                />
                                <TextInput
                                    label="Pendidikan Terakhir"
                                    value={saudaraFormData.pendidikanTerakhir}
                                    onChange={(e) => setSaudaraFormData(prev => ({ ...prev, pendidikanTerakhir: e.target.value }))}
                                />
                                <TextInput
                                    label="Pekerjaan"
                                    value={saudaraFormData.pekerjaan}
                                    onChange={(e) => setSaudaraFormData(prev => ({ ...prev, pekerjaan: e.target.value }))}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setShowSaudaraForm(false)}
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={async () => {
                                        if (!saudaraFormData.namaSaudaraKandung || !saudaraFormData.tanggalLahir) {
                                            alert('Nama dan Tanggal Lahir wajib diisi');
                                            return;
                                        }
                                        try {
                                            if (editingSaudaraId) {
                                                const updated = await employeeService.updateSaudaraKandung(employee.id, editingSaudaraId, saudaraFormData);
                                                setSaudaraList(prev => prev.map(s => s.id === editingSaudaraId ? updated : s));
                                            } else {
                                                const created = await employeeService.createSaudaraKandung(employee.id, saudaraFormData);
                                                setSaudaraList(prev => [...prev, created]);
                                                setFormData(prev => ({
                                                    ...prev,
                                                    jumlahSaudaraKandung: prev.jumlahSaudaraKandung === '' ? 1 : (Number(prev.jumlahSaudaraKandung) + 1)
                                                }));
                                            }
                                            setShowSaudaraForm(false);
                                        } catch {
                                            alert('Gagal menyimpan data saudara');
                                        }
                                    }}
                                    className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark font-medium"
                                >
                                    Simpan Saudara
                                </button>
                            </div>
                        </div>
                    )}

                    {saudaraList.length === 0 ? (
                        <div className="text-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                            <p className="text-gray-500">Belum ada data saudara kandung</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 font-medium">
                                    <tr>
                                        <th className="px-4 py-3">Nama</th>
                                        <th className="px-4 py-3">TTL</th>
                                        <th className="px-4 py-3">Pekerjaan</th>
                                        <th className="px-4 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {saudaraList.map((saudara) => (
                                        <tr key={saudara.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-gray-900 dark:text-white">{saudara.namaSaudaraKandung}</div>
                                                <div className="text-xs text-gray-500">{saudara.jenisKelamin}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                {saudara.tanggalLahir ? new Date(saudara.tanggalLahir).toLocaleDateString('id-ID') : '-'}
                                            </td>
                                            <td className="px-4 py-3">{saudara.pekerjaan || '-'}</td>
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    onClick={() => {
                                                        setSaudaraFormData({
                                                            urutanSaudara: saudara.urutanSaudara,
                                                            namaSaudaraKandung: saudara.namaSaudaraKandung,
                                                            jenisKelamin: saudara.jenisKelamin,
                                                            tanggalLahir: formatDateForInput(saudara.tanggalLahir),
                                                            pendidikanTerakhir: saudara.pendidikanTerakhir || '',
                                                            pekerjaan: saudara.pekerjaan || '',
                                                        });
                                                        setEditingSaudaraId(saudara.id);
                                                        setShowSaudaraForm(true);
                                                    }}
                                                    className="text-gray-400 hover:text-blue-500 transition-colors mr-2"
                                                >
                                                    <span className="material-symbols-rounded">edit</span>
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        if (confirm('Yakin ingin menghapus data saudara ini?')) {
                                                            try {
                                                                await employeeService.deleteSaudaraKandung(employee.id, saudara.id);
                                                                setSaudaraList(prev => prev.filter(s => s.id !== saudara.id));
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    jumlahSaudaraKandung: prev.jumlahSaudaraKandung === '' ? 0 : (Number(prev.jumlahSaudaraKandung) - 1)
                                                                }));
                                                            } catch {
                                                                alert('Gagal menghapus data saudara');
                                                            }
                                                        }
                                                    }}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <span className="material-symbols-rounded">delete</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Section 4: Orang Tua Mertua */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
                    <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                        <span className="material-symbols-rounded text-primary">home_mini</span>
                        Orang Tua Mertua
                    </h3>
                </div>
                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Ayah Mertua */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 dark:text-white pb-2 border-b border-gray-100 dark:border-gray-700">Ayah Mertua</h4>
                        <TextInput
                            label="Nama Ayah Mertua"
                            value={formData.namaAyahMertua}
                            onChange={(e) => handleChange('namaAyahMertua', e.target.value)}
                            disabled={!isEditing}
                        />
                        <DatePicker
                            label="Tanggal Lahir"
                            value={formData.tanggalLahirAyahMertua}
                            onChange={(val) => handleChange('tanggalLahirAyahMertua', val)}
                            disabled={!isEditing}
                        />
                        <TextInput
                            label="Pendidikan Terakhir"
                            value={formData.pendidikanTerakhirAyahMertua}
                            onChange={(e) => handleChange('pendidikanTerakhirAyahMertua', e.target.value)}
                            disabled={!isEditing}
                        />
                        <TextArea
                            label="Keterangan"
                            value={formData.keteranganAyahMertua}
                            onChange={(e) => handleChange('keteranganAyahMertua', e.target.value)}
                            disabled={!isEditing}
                            rows={2}
                        />
                    </div>

                    {/* Ibu Mertua */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 dark:text-white pb-2 border-b border-gray-100 dark:border-gray-700">Ibu Mertua</h4>
                        <TextInput
                            label="Nama Ibu Mertua"
                            value={formData.namaIbuMertua}
                            onChange={(e) => handleChange('namaIbuMertua', e.target.value)}
                            disabled={!isEditing}
                        />
                        <DatePicker
                            label="Tanggal Lahir"
                            value={formData.tanggalLahirIbuMertua}
                            onChange={(val) => handleChange('tanggalLahirIbuMertua', val)}
                            disabled={!isEditing}
                        />
                        <TextInput
                            label="Pendidikan Terakhir"
                            value={formData.pendidikanTerakhirIbuMertua}
                            onChange={(e) => handleChange('pendidikanTerakhirIbuMertua', e.target.value)}
                            disabled={!isEditing}
                        />
                        <TextArea
                            label="Keterangan"
                            value={formData.keteranganIbuMertua}
                            onChange={(e) => handleChange('keteranganIbuMertua', e.target.value)}
                            disabled={!isEditing}
                            rows={2}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FamilyInformationTab;
