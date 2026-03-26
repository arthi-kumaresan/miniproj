import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages - Assuming these exist or will be refined
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DocumentList from './pages/DocumentList';
import Register from './pages/Register';
import ApprovalPanel from './pages/ApprovalPanel';
import ExpiringDocuments from './pages/ExpiringDocuments';
import AuditReports from './pages/AuditReports';
import UserManagement from './pages/UserManagement';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// Components
import Layout from './components/layout/Layout';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return user ? <Layout /> : <Navigate to="/login" replace />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen transition-colors duration-300">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route element={<ProtectedRoute />}>
                            <Route index element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/documents" element={<DocumentList />} />
                            <Route path="/approvals" element={<ApprovalPanel />} />
                            <Route path="/expiring" element={<ExpiringDocuments />} />
                            <Route path="/reports" element={<AuditReports />} />
                            <Route path="/users" element={<UserManagement />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/settings" element={<Settings />} />
                        </Route>

                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </div>
                <ToastContainer theme="dark" position="bottom-right" />
            </Router>
        </AuthProvider>
    );
}

export default App;
