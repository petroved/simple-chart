import './App.css';
import React from 'react';
import { StockChart } from './StockChart';

const App: React.FC = () => {
    return (
        <div className="App">
            <h1>Historical performance of Google(Alphabet Inc.) by GOOGL and GOOG stocks:</h1>
            <div className="chart">
                <StockChart symbol="GOOGL" key={1} />
            </div>

            <div className="chart">
                <StockChart symbol="GOOG" key={1} />
            </div>
        </div>
    );
};

export default App;
