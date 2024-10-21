import axios from 'axios';

export interface Stock {
    name: string;
    last_price: number;
    sector_1: string;
    sector_2: string;
}

export interface StockData {
    name: string;
    date: string;
    price: number;
    volume: number;
    sector_1: string;
    sector_2: string;
}

const API_URL = 'http://127.0.0.1:8000';

// Fetch the list of all stocks
export const fetchAllStocks = async (): Promise<Stock[]> => {
    const response = await axios.get(`${API_URL}/stocks`);
    return response.data;
};

// Fetch the data for a specific asset
export const fetchDataByAsset = async (asset: string, start?: string, end?: string): Promise<StockData[]> => {
    const params = new URLSearchParams();
    if (start) params.append('start', start);
    if (end) params.append('end', end);

    const response = await axios.get(`${API_URL}/stocks/${asset}`, { params });
    return response.data;
};

export const fetchReturnsByAsset = async (asset: string, start?: string, end?: string): Promise<number> => {
    const params = new URLSearchParams();
    if (start) params.append('start', start);
    if (end) params.append('end', end);

    const response = await axios.get(`${API_URL}/stocks/${asset}/returns`, { params });
    return response.data;
};