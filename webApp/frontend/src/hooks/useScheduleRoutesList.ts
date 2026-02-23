// ======================================================================================
//? Importing
// ======================================================================================

import { useCallback, useEffect, useState } from 'react';

import { apiClient } from '../services/apiClient';
import type { ScheduleRouteRow } from '../types/schedule';

// ======================================================================================
//? Hook
// ======================================================================================

type UseScheduleRoutesListResult = {
  routesList: ScheduleRouteRow[];
  refreshRoutes: () => Promise<void>;
};

export const useScheduleRoutesList = (): UseScheduleRoutesListResult => {
  const [routesList, setRoutesList] = useState<ScheduleRouteRow[]>([]);

  const refreshRoutes = useCallback(async () => {
    try {
      const res = await apiClient.get('/api/user/routes/all');
      const rows: ScheduleRouteRow[] = Array.isArray(res.data?.data) ? res.data.data : [];
      setRoutesList(rows);
    } catch {
      setRoutesList([]);
    }
  }, []);

  useEffect(() => {
    void refreshRoutes();
  }, [refreshRoutes]);

  return { routesList, refreshRoutes };
};
