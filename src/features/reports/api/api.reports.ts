import { httpClient } from '@/src/core/api/client';
import { API_ENDPOINTS } from '@/src/core/config/endpoints';
import type { Report, CreateReportDTO, ReportStatus } from '@/src/core/api/types';

export const reportsApi = {
  create: async (data: CreateReportDTO): Promise<Report> => {
    return httpClient.post<Report>(API_ENDPOINTS.reports.create, data);
  },
  list: async (status?: string): Promise<Report[]> => {
    return httpClient.get<Report[]>(API_ENDPOINTS.reports.list, {
      params: status ? { status } : undefined,
    });
  },
  updateStatus: async (id: string, status: ReportStatus): Promise<Report> => {
    return httpClient.patch<Report>(API_ENDPOINTS.reports.updateStatus(id), { status });
  },
  delete: async (id: string): Promise<void> => {
    return httpClient.delete<void>(API_ENDPOINTS.reports.delete(id));
  },
};
