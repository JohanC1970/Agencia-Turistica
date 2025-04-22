import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';

const Header = () => {
    const { user, isAuthenticated, isAdmin, isEmployee, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="container flex justify-between align-center" style={{ padding: '1rem 0' }}>
                <Link to="/" className="logo">
                    <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Agencia Turística</h1>
                </Link>

                <div className="desktop-menu" style={{ display: 'flex', gap: '1.5rem' }}>
                    <Link to="/packages">Paquetes</Link>

                    {isAuthenticated ? (
                        <>
                            <Link to="/reservations">Mis Reservas</Link>
                            <Link to="/profile">Perfil</Link>

                            {(isAdmin || isEmployee) && (
                                <div className="dropdown" style={{ position: 'relative' }}>
                                    <button
                                        onClick={() => setMenuOpen(!menuOpen)}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        Administración
                                    </button>

                                    {menuOpen && (
                                        <div className="dropdown-menu" style={{
                                            position: 'absolute',
                                            top: '100%',
                                            right: 0,
                                            background: 'white',
                                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                            borderRadius: '4px',
                                            padding: '0.5rem 0',
                                            minWidth: '200px',
                                            zIndex: 10
                                        }}>
                                            {isAdmin && (
                                                <>
                                                    <Link to="/admin/dashboard" style={{ display: 'block', padding: '0.5rem 1rem' }}>Dashboard</Link>
                                                    <Link to="/admin/users" style={{ display: 'block', padding: '0.5rem 1rem' }}>Usuarios</Link>
                                                    <Link to="/admin/employees" style={{ display: 'block', padding: '0.5rem 1rem' }}>Empleados</Link>
                                                </>
                                            )}
                                            <Link to="/admin/packages" style={{ display: 'block', padding: '0.5rem 1rem' }}>Paquetes</Link>
                                            <Link to="/admin/reservations" style={{ display: 'block', padding: '0.5rem 1rem' }}>Reservas</Link>
                                        </div>
                                    )}
                                </div>
                            )}

                            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.25rem 0.75rem' }}>
                                Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Iniciar Sesión</Link>
                            <Link to="/register" className="btn btn-primary" style={{ padding: '0.25rem 0.75rem' }}>
                                Registrarse
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;