# Here is how I would define the database models
class Trade(Base):
    __tablename__ = 'trades'
    id = Column(Integer, primary_key=True)
    name = Column(String, ForeignKey('stocks.name'))
    date = Column(String)
    price = Column(Float)
    volume = Column(Integer)
    sector_1 = Column(String)
    sector_2 = Column(String)
    stock_id = Column(Integer, ForeignKey('stocks.id'))

class Stock(Base):
    __tablename__ = 'stocks'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    sector_1 = Column(String)
    sector_2 = Column(String)
    trades = relationship('Trade', backref='stock')

