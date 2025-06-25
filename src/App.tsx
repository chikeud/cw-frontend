import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import RiskPage from './pages/RiskAnalysis';
import CreditScore from './pages/SmartScoreAnalysis';
import TestCreds from "./pages/TestCreds";
import SmartFinance from "./pages/SmartFinance";
//import ScoringPage from './pages/Scoring';
//import IncomePage from './pages/Income';
//import IdentityPage from './pages/Identity';

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cc" element={<CreditScore />} />
            <Route path="/kyc" element={<Dashboard />} />
            <Route path="/risk" element={<RiskPage />} />
            <Route path="/data" element={<TestCreds />} />
            <Route path="/pfm" element={<SmartFinance />} />


        </Routes>
    );
};

export default App;
