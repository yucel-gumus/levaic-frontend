import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Layout
import MainLayout from './layouts/MainLayout';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';

// Pages
import Dashboard from './pages/Dashboard/Dashboard';
import ClinicList from './pages/Clinic/ClinicList';
import ClinicCreate from './pages/Clinic/ClinicCreate';
import ClinicEdit from './pages/Clinic/ClinicEdit';
import MembershipList from './pages/Membership/MembershipList';
import MembershipCreate from './pages/Membership/MembershipCreate';
import MembershipEdit from './pages/Membership/MembershipEdit';
import ConsultantList from './pages/Consultant/ConsultantList';
import ConsultantCreate from './pages/Consultant/ConsultantCreate';
import ConsultantEdit from './pages/Consultant/ConsultantEdit';
import Profile from './pages/Profile/Profile';
import ServiceList from './pages/Service/ServiceList';
import ServiceCreate from './pages/Service/ServiceCreate';
import ServiceEdit from './pages/Service/ServiceEdit';
import AppointmentList from './pages/Appointment/AppointmentList';
import AppointmentCreate from './pages/Appointment/AppointmentCreate';
import AppointmentEdit from './pages/Appointment/AppointmentEdit';
import BlogList from './pages/Blog/BlogList';
import BlogCreate from './pages/Blog/BlogCreate';
import BlogEdit from './pages/Blog/BlogEdit';
import BlogDetail from './pages/Blog/BlogDetail';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  // For demonstration purposes, we'll use localStorage to check authentication
  // In a real app, you would use a more secure approach like context API or Redux
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          {/* Protected Routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/klinik" element={
            <ProtectedRoute>
              <MainLayout>
                <ClinicList />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/klinik/create" element={
            <ProtectedRoute>
              <MainLayout>
                <ClinicCreate />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/klinik/edit/:id" element={
            <ProtectedRoute>
              <MainLayout>
                <ClinicEdit />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/uyelik" element={
            <ProtectedRoute>
              <MainLayout>
                <MembershipList />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/uyelik/yeni" element={
            <ProtectedRoute>
              <MainLayout>
                <MembershipCreate />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/uyelik/:id/duzenle" element={
            <ProtectedRoute>
              <MainLayout>
                <MembershipEdit />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/danisman" element={
            <ProtectedRoute>
              <MainLayout>
                <ConsultantList />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/danisman/yeni" element={
            <ProtectedRoute>
              <MainLayout>
                <ConsultantCreate />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/danisman/:id/duzenle" element={
            <ProtectedRoute>
              <MainLayout>
                <ConsultantEdit />
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* Service Routes */}
          <Route path="/hizmet" element={
            <ProtectedRoute>
              <MainLayout>
                <ServiceList />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/hizmet/ekle" element={
            <ProtectedRoute>
              <MainLayout>
                <ServiceCreate />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/hizmet/duzenle/:id" element={
            <ProtectedRoute>
              <MainLayout>
                <ServiceEdit />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          {/* Appointment Routes */}
          <Route path="/randevular" element={
            <ProtectedRoute>
              <MainLayout>
                <AppointmentList />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/randevu/ekle" element={
            <ProtectedRoute>
              <MainLayout>
                <AppointmentCreate />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/randevu/duzenle/:id" element={
            <ProtectedRoute>
              <MainLayout>
                <AppointmentEdit />
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* Blog Routes */}
          <Route path="/blog" element={
            <ProtectedRoute>
              <MainLayout>
                <BlogList />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/blog/ekle" element={
            <ProtectedRoute>
              <MainLayout>
                <BlogCreate />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/blog/duzenle/:id" element={
            <ProtectedRoute>
              <MainLayout>
                <BlogEdit />
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/blog/:id" element={
            <ProtectedRoute>
              <MainLayout>
                <BlogDetail />
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* Catch all redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 5000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
