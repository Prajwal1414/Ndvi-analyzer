import axios from "axios";
import { NDVIResultDTO } from "../types/types";

const API_BASE_URL = '/api/ndvi';

const api = axios.create({
    baseURL: API_BASE_URL
})

export const processImages = async (formData: FormData): Promise<NDVIResultDTO> => {
    try {
        const response = await api.post('/process', formData);
        return response.data;
    } catch (error) {
        console.error('Error processing images:', error);
        throw error;
    }
}

export const getResults = async (): Promise<NDVIResultDTO[]> => {

    try {
        const response = await api.get('/results')

        console.log("API responded with this: ", response.data)

        return response.data

    } catch (error) {
        console.error('Error fetching results:', error);
        throw error;
    }
}

export const getResultById = async (resultId: string): Promise<NDVIResultDTO> => {
    try {
        const response = await api.get(`/results/${resultId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching result with resultId ${resultId}:`, error);
        throw error;
    }
}

export default api;