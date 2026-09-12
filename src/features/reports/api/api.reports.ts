import { httpClient } from '@/src/core/api/client';
import { API_ENDPOINTS } from '@/src/core/config/endpoints';
import type { Report, CreateReportDTO } from '@/src/core/api/types';

export const reportsApi = {
  create: async (data: CreateReportDTO): Promise<Report> => {
    return httpClient.post<Report>(API_ENDPOINTS.reports.create, data);
  },
  list: async (status?: string): Promise<Report[]> => {
    return httpClient.get<Report[]>(API_ENDPOINTS.reports.list, {
      params: status ? { status } : undefined,
    });
  },
};
