/**
 * useHRMasterData Hook
 * Generic hook untuk CRUD operations pada HR Master Data entities
 */

import { useState, useEffect, useCallback } from 'react';
import * as hrMasterService from '../services/hr-master.service';
import type {
    HRMasterEntityType,
    MasterDataQueryParams,
    PaginationMeta,
    HRMasterData,
} from '../types/hr-master.types';

interface UseHRMasterDataOptions {
    autoFetch?: boolean;
    initialParams?: MasterDataQueryParams;
}

interface UseHRMasterDataReturn<T> {
    data: T[];
    loading: boolean;
    error: string | null;
    meta: PaginationMeta | null;
    fetchData: (params?: MasterDataQueryParams) => Promise<void>;
    createItem: (data: unknown) => Promise<T | null>;
    updateItem: (id: string, data: unknown) => Promise<T | null>;
    deleteItem: (id: string) => Promise<boolean>;
    refetch: () => Promise<void>;
    setError: (error: string | null) => void;
}

export function useHRMasterData<T extends HRMasterData>(
    entityType: HRMasterEntityType,
    options: UseHRMasterDataOptions = {}
): UseHRMasterDataReturn<T> {
    const { autoFetch = true, initialParams = {} } = options;

    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [currentParams, setCurrentParams] = useState<MasterDataQueryParams>(initialParams);

    // Fetch data with pagination and filters
    const fetchData = useCallback(async (params?: MasterDataQueryParams) => {
        setLoading(true);
        setError(null);

        const queryParams = params || currentParams;
        if (params) {
            setCurrentParams(params);
        }

        try {
            const response = await hrMasterService.getAll<T>(entityType, queryParams);
            if (response.success) {
                setData(response.data);
                setMeta(response.meta);
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat mengambil data';
            setError(message);
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [entityType, currentParams]);

    // Create new item
    const createItem = useCallback(async (createData: unknown): Promise<T | null> => {
        setLoading(true);
        setError(null);

        try {
            const response = await hrMasterService.create<T, unknown>(entityType, createData);
            if (response.success) {
                return response.data;
            }
            throw new Error('Failed to create item');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat membuat data';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, [entityType]);

    // Update existing item
    const updateItem = useCallback(async (id: string, updateData: unknown): Promise<T | null> => {
        setLoading(true);
        setError(null);

        try {
            const response = await hrMasterService.update<T, unknown>(entityType, id, updateData);
            if (response.success) {
                return response.data;
            }
            throw new Error('Failed to update item');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat memperbarui data';
            setError(message);
            return null;
        } finally {
            setLoading(false);
        }
    }, [entityType]);

    // Delete item (soft delete)
    const deleteItem = useCallback(async (id: string): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const response = await hrMasterService.remove<T>(entityType, id);
            return response.success;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat menghapus data';
            setError(message);
            return false;
        } finally {
            setLoading(false);
        }
    }, [entityType]);

    // Refetch with current params
    const refetch = useCallback(async () => {
        await fetchData(currentParams);
    }, [fetchData, currentParams]);

    // Auto fetch on mount if enabled
    useEffect(() => {
        if (autoFetch) {
            fetchData(initialParams);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        data,
        loading,
        error,
        meta,
        fetchData,
        createItem,
        updateItem,
        deleteItem,
        refetch,
        setError,
    };
}

export default useHRMasterData;
