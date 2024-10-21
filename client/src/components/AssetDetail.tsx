import React, { useEffect, useState } from 'react';
import { fetchDataByAsset, StockData } from '../services/stockService';

interface AssetDetailProps {
    asset: string;
    start?: string;
    end?: string;
}

const AssetDetail: React.FC<AssetDetailProps> = ({ asset, start, end }) => {
    const [stockData, setStockData] = useState<StockData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (start && end) {
            setLoading(true);
            setError(null);

            fetchDataByAsset(asset, start, end)
                .then((data) => {
                    setStockData(data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching stock details:', error);
                    setError('Error fetching stock details.');
                    setLoading(false);
                });
        }
    }, [asset, start, end]);

    if (loading) return <p>Loading...</p>;

    if (error) return <p>{error}</p>;

    return (
        <div className="asset-detail">
            <h2>Details for {asset}</h2>
            <ul>
                {stockData.map((data, index) => (
                    <li key={index}>
                        Date: {data.date}, Price: ${data.price.toFixed(2)}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AssetDetail;
