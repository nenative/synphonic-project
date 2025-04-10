import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import MarketplaceListing from './components/MarketplaceListing';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<MarketplaceListing />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App; 