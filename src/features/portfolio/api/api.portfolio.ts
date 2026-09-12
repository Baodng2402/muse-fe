import { httpClient } from '@/src/core/api/client';
import { API_ENDPOINTS } from '@/src/core/config/endpoints';
import type { UpdatePortfolioDTO } from '@/src/core/api/types';

export interface CreatePortfolioDTO {
  title: string;
  description?: string;
  specialty_id?: string;
}

export interface AddPortfolioImageDTO {
  image_url: string;
  type?: 'single' | 'before' | 'after';
  position?: number;
}

export const portfolioApi = {
  listByUser: async (userId: string) => {
    return httpClient.get<unknown[]>(API_ENDPOINTS.portfolio.userList(userId));
  },
  create: async (data: CreatePortfolioDTO) => {
    return httpClient.post<unknown>(API_ENDPOINTS.portfolio.create, data);
  },
  update: async (id: string, data: UpdatePortfolioDTO) => {
    return httpClient.put<unknown>(API_ENDPOINTS.portfolio.update(id), data);
  },
  delete: async (id: string) => {
    return httpClient.delete<{ message: string }>(API_ENDPOINTS.portfolio.delete(id));
  },
  addImage: async (id: string, data: AddPortfolioImageDTO) => {
    return httpClient.post<unknown>(API_ENDPOINTS.portfolio.addImage(id), data);
  },
  like: async (id: string) => {
    return httpClient.post<{ message: string }>(API_ENDPOINTS.portfolio.like(id), {});
  },
  unlike: async (id: string) => {
    return httpClient.delete<{ message: string }>(API_ENDPOINTS.portfolio.unlike(id));
  },
};
