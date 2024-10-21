from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from typing import List, Optional
from pydantic import BaseModel

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load stock data file
data = pd.read_csv('stock-data.csv')


class Stock_Data(BaseModel):
    name: str
    date: str
    price: float
    volume: int
    sector_1: str
    sector_2: str


class Stock(BaseModel):
    name: str
    last_price: float = 0.0
    sector_1: str
    sector_2: str


def get_stock_data(stock_name: str = None):
    stock_list = []
    for index, row in data.iterrows():
        if stock_name is not None and row['name'] != stock_name:
            continue
        stock = Stock_Data(name=row['name'], date=row['asof'], price=row['close_usd'],
                            volume=row['volume'], sector_1=row['sector_level1'], sector_2=row['sector_level2'])
        stock_list.append(stock.dict())
    return stock_list


def get_all_stocks():
    stock_list = []
    last_entries = data.groupby('name').last().reset_index()
    for index, row in last_entries.iterrows():
        stock = Stock(name=row['name'], last_price=row['close_usd'], sector_1=row['sector_level1'], sector_2=row['sector_level2'])
        stock_list.append(stock.dict())
    return stock_list



@app.get("/stocks", response_model=List[Stock])
def get_stocks():
    stock_data = get_all_stocks()
    return stock_data


@app.get("/stocks/{asset}", response_model=List[Stock_Data])
def get_data_by_asset(
    asset: str,                    
    start: Optional[str] = Query(None, description="Start date in YYYY-MM-DD format"),
    end: Optional[str] = Query(None, description="End date in YYYY-MM-DD format")
):
    stock_data = get_stock_data(asset)
    if not start:
        start = stock_data[0]['date']
    if not end:
        end = stock_data[-1]['date']
    asset_data = [s for s in stock_data if (start <= s['date'] <= end)]

    if not asset_data:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset_data


@app.get("/stocks/{asset}/returns", response_model=float)
def get_cumulative_returns(
    asset: str,
    start: Optional[str] = Query(None, description="Start date in YYYY-MM-DD format"),
    end: Optional[str] = Query(None, description="End date in YYYY-MM-DD format")
):
    stock_data = get_stock_data(asset)
    if not start:
        start = stock_data[0]['date']
    if not end:
        end = stock_data[-1]['date']
    asset_data = [s for s in stock_data if (start <= s['date'] <= end)]

    if not asset_data:
        raise HTTPException(status_code=404, detail="No data for the given date range or asset.")
    
    initial_price = float(asset_data[0]['price'])
    final_price = float(asset_data[-1]['price'])
    cumulative_return = (final_price - initial_price) / initial_price * 100
    
    return cumulative_return


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
