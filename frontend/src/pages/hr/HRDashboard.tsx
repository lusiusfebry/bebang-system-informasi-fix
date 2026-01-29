/**
 * HR Dashboard Component
 * Landing page untuk HR Module dengan card shortcuts ke master data
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as hrMasterService from '../../services/hr-master.service';
import type { HRMasterEntityType } from '../../types/hr-master.types';

interface MasterDataCard {
    id: HRMasterEntityType;
    title: string;
    description: string;
    icon: React.ReactNode;
    path: string;
    color: string;
}

const masterDataCards: MasterDataCard[] = [
    {
        id: 'karyawan' as any, // Not a master entity type, but compatible for UI
        title: 'Data Karyawan',
        description: 'Kelola data seluruh karyawan',
        path: '/hr/employees',
        color: 'from-blue-600 to-indigo-700',
        icon: (
            <span className="material-symbols-rounded text-3xl">badge</span>
        ),
    },
    {
        id: 'resignation' as any,
        title: 'Resign & Terminasi',
        description: 'Kelola pengunduran diri dan pemutusan hubungan kerja',
        path: '/hr/resignations',
        color: 'from-red-600 to-pink-700',
        icon: (
            <span className="material-symbols-rounded text-3xl">logout</span>
        ),
    },
    {
        id: 'divisi',
        title: 'Divisi',
        description: 'Kelola data divisi organisasi',
        path: '/hr/master-data/divisi',
        color: 'from-blue-500 to-blue-600',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        ),
    },
    {
        id: 'department',
        title: 'Department',
        description: 'Kelola data department',
        path: '/hr/master-data/department',
        color: 'from-indigo-500 to-indigo-600',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
    },
    {
        id: 'posisi-jabatan',
        title: 'Posisi Jabatan',
        description: 'Kelola data posisi jabatan',
        path: '/hr/master-data/posisi-jabatan',
        color: 'from-purple-500 to-purple-600',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        id: 'kategori-pangkat',
        title: 'Kategori Pangkat',
        description: 'Kelola data kategori pangkat',
        path: '/hr/master-data/kategori-pangkat',
        color: 'from-amber-500 to-amber-600',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
        ),
    },
    {
        id: 'golongan',
        title: 'Golongan',
        description: 'Kelola data golongan',
        path: '/hr/master-data/golongan',
        color: 'from-green-500 to-green-600',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
        ),
    },
    {
        id: 'sub-golongan',
        title: 'Sub Golongan',
        description: 'Kelola data sub golongan',
        path: '/hr/master-data/sub-golongan',
        color: 'from-teal-500 to-teal-600',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
        ),
    },
    {
        id: 'jenis-hubungan-kerja',
        title: 'Jenis Hubungan Kerja',
        description: 'Kelola jenis hubungan kerja',
        path: '/hr/master-data/jenis-hubungan-kerja',
        color: 'from-orange-500 to-orange-600',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
    },
    {
        id: 'tag',
        title: 'Tag',
        description: 'Kelola tag untuk kategorisasi',
        path: '/hr/master-data/tag',
        color: 'from-pink-500 to-pink-600',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
        ),
    },
    {
        id: 'lokasi-kerja',
        title: 'Lokasi Kerja',
        description: 'Kelola data lokasi kerja',
        path: '/hr/master-data/lokasi-kerja',
        color: 'from-cyan-500 to-cyan-600',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
    {
        id: 'status-karyawan',
        title: 'Status Karyawan',
        description: 'Kelola data status karyawan',
        path: '/hr/master-data/status-karyawan',
        color: 'from-red-500 to-red-600',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
    },
];

export const HRDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [counts, setCounts] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);

    // Fetch counts for each entity
    useEffect(() => {
        const fetchCounts = async () => {
            setLoading(true);
            const newCounts: Record<string, number> = {};

            await Promise.all(
                masterDataCards.map(async (card) => {
                    try {
                        const response = await hrMasterService.getAll(card.id, { limit: 1 });
                        if (response.success && response.meta) {
                            newCounts[card.id] = response.meta.total;
                        }
                    } catch (error) {
                        console.error(`Failed to fetch count for ${card.id}:`, error);
                        newCounts[card.id] = 0;
                    }
                })
            );

            setCounts(newCounts);
            setLoading(false);
        };

        fetchCounts();
    }, []);

    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Human Resources
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Kelola master data HR untuk kebutuhan organisasi
                </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {masterDataCards.map((card) => (
                    <button
                        key={card.id}
                        onClick={() => navigate(card.path)}
                        className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 
                            shadow-sm hover:shadow-lg border border-gray-200 dark:border-gray-700
                            transition-all duration-300 hover:-translate-y-1 text-left"
                    >
                        {/* Gradient Background Overlay */}
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 
                            bg-gradient-to-br ${card.color} transition-opacity duration-300`}
                        />

                        <div className="relative p-6">
                            {/* Icon */}
                            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${card.color} 
                                text-white shadow-lg shadow-${card.color.split('-')[1]}-500/30`}>
                                {card.icon}
                            </div>

                            {/* Content */}
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white 
                                    group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {card.title}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    {card.description}
                                </p>
                            </div>

                            {/* Count */}
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Total Data
                                </div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {loading ? (
                                        <div className="w-8 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                    ) : (
                                        counts[card.id] ?? 0
                                    )}
                                </div>
                            </div>

                            {/* Arrow */}
                            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 
                                transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default HRDashboard;
