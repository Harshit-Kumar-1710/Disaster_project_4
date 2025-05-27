import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AlertProvider } from './context/AlertContext';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import AddLocation from './pages/AddLocation';
import CheckSafety from './pages/CheckSafety';
import SOSRoute from './pages/SOSRoute';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Alerts from './components/Alerts';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AlertProvider>
          <LocationProvider>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Navbar />
              <Alerts />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route 
                    path="/dashboard" 
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/add-location" 
                    element={
                      <PrivateRoute>
                        <AddLocation />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/check-safety" 
                    element={
                      <PrivateRoute>
                        <CheckSafety />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/sos" 
                    element={
                      <PrivateRoute>
                        <SOSRoute />
                      </PrivateRoute>
                    } 
                  />
                </Routes>
              </main>
            </div>
          </LocationProvider>
        </AlertProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;