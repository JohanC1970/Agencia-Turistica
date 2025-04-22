import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const EmployeeRoute = ({ children }) => {
    const { isAuthenticated, isAdmin, isEmployee, loading } = useAuth();

    if (loading) {
        return <div className="container text-center mt-4">Cargando...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (!isAdmin && !isEmployee) {
        return <Navigate to="/" />;
    }

    return children;
};

export default EmployeeRoute;