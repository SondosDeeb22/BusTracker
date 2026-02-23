// ======================================================================================
//? Importing
// ======================================================================================

import { useCallback, useEffect, useState } from 'react';

import { apiClient } from '../services/apiClient';
import type { ScheduleResponseRow } from '../types/schedule';

// ======================================================================================
//? Hook
// ======================================================================================

type UseScheduleDataResult = {
  schedules: ScheduleResponseRow[];
  loading: boolean;
  error: string | null;
  refreshSchedules: () => Promise<void>;
};

export const useScheduleData = (endpoint: string, errorMessage: string): UseScheduleDataResult => {
  const [schedules, setSchedules] = useState<ScheduleResponseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSchedules = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.get(endpoint);
      const rows: ScheduleResponseRow[] = Array.isArray(res.data?.data) ? res.data.data : [];
      setSchedules(rows);
    } catch {
      setError(errorMessage);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint, errorMessage]);

  useEffect(() => {
    void refreshSchedules();
  }, [refreshSchedules]);

  return { schedules, loading, error, refreshSchedules };
};
