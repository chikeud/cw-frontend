import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import RiskPage from './pages/RiskAnalysis';
//import ScoringPage from './pages/Scoring';
//import IncomePage from './pages/Income';
//import IdentityPage from './pages/Identity';

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/kyc" element={<Dashboard />} />
            <Route path="/risk" element={<RiskPage />} />

        </Routes>
    );
};

export default App;
