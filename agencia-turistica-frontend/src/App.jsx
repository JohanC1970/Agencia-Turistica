import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';

// Components
import Layout from './components/common/Layout';
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/common/AdminRoute';
import EmployeeRoute from './components/common/EmployeeRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerificationPage from './pages/VerificationPage';
import ProfilePage from './pages/ProfilePage';
import PackagesPage from './pages/PackagesPage';
import PackageDetailPage from './pages/PackageDetailPage';
import ReservationsPage from './pages/ReservationsPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin pages
import AdminDashboardPage from './pages/admin/DashboardPage';
import AdminUsersPage from './pages/admin/UsersPage';
import AdminEmployeesPage from './pages/admin/EmployeesPage';
import AdminPackagesPage from './pages/admin/PackagesPage';
import AdminReservationsPage from './pages/admin/ReservationsPage';

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route element={<Layout />}>
                    {/* Public routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/verify" element={<VerificationPage />} />
                    <Route path="/packages" element={<PackagesPage />} />
                    <Route path="/packages/:id" element={<PackageDetailPage />} />

                    {/* Protected routes */}
                    <Route path="/profile" element={
                        <PrivateRoute>
                            <ProfilePage />
                        </PrivateRoute>
                    } />
                    <Route path="/reservations" element={
                        <PrivateRoute>
                            <ReservationsPage />
                        </PrivateRoute>
                    } />

                    {/* Admin routes */}
                    <Route path="/admin/dashboard" element={
                        <AdminRoute>
                            <AdminDashboardPage />
                        </AdminRoute>
                    } />
                    <Route path="/admin/users" element={
                        <AdminRoute>
                            <AdminUsersPage />
                        </AdminRoute>
                    } />
                    <Route path="/admin/employees" element={
                        <AdminRoute>
                            <AdminEmployeesPage />
                        </AdminRoute>
                    } />
                    <Route path="/admin/packages" element={
                        <EmployeeRoute>
                            <AdminPackagesPage />
                        </EmployeeRoute>
                    } />
                    <Route path="/admin/reservations" element={
                        <EmployeeRoute>
                            <AdminReservationsPage />
                        </EmployeeRoute>
                    } />

                    {/* 404 Not Found */}
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
            <Toaster position="top-right" />
        </AuthProvider>
    );
}

export default App;