import axios from 'axios';
import type { AxiosResponse } from 'axios';

const API_BASE_URL = process.env.API_BASE_URL ?? 'https://dummyjson.com';

class ApiClient {
    private readonly baseUrl: string;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    async get(endpoint: string): Promise<AxiosResponse> {
        return axios.get(`${this.baseUrl}${endpoint}`, {
            validateStatus: () => true
        });
    }

    async post(endpoint: string, data: unknown): Promise<AxiosResponse> {
        return axios.post(`${this.baseUrl}${endpoint}`, data, {
            headers: { 'Content-Type': 'application/json' },
            validateStatus: () => true
        });
    }

    async put(endpoint: string, data: unknown): Promise<AxiosResponse> {
        return axios.put(`${this.baseUrl}${endpoint}`, data, {
            headers: { 'Content-Type': 'application/json' },
            validateStatus: () => true
        });
    }

    async delete(endpoint: string): Promise<AxiosResponse> {
        return axios.delete(`${this.baseUrl}${endpoint}`, {
            validateStatus: () => true
        });
    }
}

export const apiClient = new ApiClient();
