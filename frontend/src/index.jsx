import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import PaymentForm from './PaymentForm.jsx';
import PinPage from './PinPage.jsx';
import Result from './Result.jsx';
import MobileOtp from './MobileOtp.jsx';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/payment" element={<PaymentForm />} />
      <Route path="/pin" element={<PinPage />} />
      <Route path="/result" element={<Result />} />
      <Route path="/otp" element={<MobileOtp />} />
    </Routes>
  </Router>
);

