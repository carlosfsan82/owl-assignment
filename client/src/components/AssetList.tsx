import React, { useEffect, useState } from 'react';
import { fetchAllStocks, Stock } from '../services/stockService';

interface AssetListProps {
    onSelectAsset: (asset: string) => void;
}

const AssetList: React.FC<AssetListProps> = ({ onSelectAsset }) => {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchAllStocks()
            .then((data) => {
                setStocks(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching stock data:', error);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="asset-list">
            <h2>Assets</h2>
            <ul>
                {stocks.map((stock) => (
                    <li key={stock.name} onClick={() => onSelectAsset(stock.name)}>
                        <strong>{stock.name}</strong>: ${stock.last_price.toFixed(2)}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AssetList;
