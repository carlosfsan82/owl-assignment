import React, { useState } from 'react';
import AssetList from './components/AssetList';
import AssetDetail from './components/AssetDetail';
import './App.css';

const App: React.FC = () => {
    const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);

    const maxEndDate = '2023-11-06'; // Last date in the stock dataset

    return (
        <div className="app">
            <h1>Stock Price Data</h1>
            <div className="content">
                <AssetList onSelectAsset={setSelectedAsset} />

                {selectedAsset && (
                    <div className="date-container">
                        <label>
                            Start Date: 
                            <input
                                type="date"
                                max={maxEndDate}
                                value={startDate || ''}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </label>
                        <label>
                            End Date: 
                            <input
                                type="date"
                                max={maxEndDate}
                                value={endDate || ''}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </label>
                    </div>
                )}

                {selectedAsset && (
                    <AssetDetail asset={selectedAsset} start={startDate || undefined} end={endDate || undefined} />
                )}
            </div>
        </div>
    );
};

export default App;
