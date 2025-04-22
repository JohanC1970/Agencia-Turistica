import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

// Normalmente importaríamos servicios para obtener estadísticas
// Por simplicidad, usaremos datos de ejemplo por ahora

const DashboardPage = () => {
    const [stats, setStats] = useState({
        reservations: {
            total: 0,
            pending: 0,
            confirmed: 0,
            completed: 0,
            canceled: 0
        },
        packages: {
            total: 0,
            active: 0
        },
        users: {
            total: 0,
            clients: 0,
            employees: 0,
            admins: 0
        },
        revenue: {
            total: 0,
            thisMonth: 0,
            lastMonth: 0
        }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Aquí normalmente haríamos un fetch a una API de estadísticas
        // Por ahora, simularemos la carga con datos de ejemplo

        setTimeout(() => {
            setStats({
                reservations: {
                    total: 152,
                    pending: 23,
                    confirmed: 45,
                    completed: 72,
                    canceled: 12
                },
                packages: {
                    total: 28,
                    active: 15
                },
                users: {
                    total: 450,
                    clients: 425,
                    employees: 20,
                    admins: 5
                },
                revenue: {
                    total: 78500000,
                    thisMonth: 12300000,
                    lastMonth: 10800000
                }
            });
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) {
        return (
            <div className="container" style={{ padding: '2rem 1rem' }}>
                <div className="text-center">
                    <p>Cargando estadísticas...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1 className="mb-4">Dashboard de Administración</h1>

            {/* Quick Stats */}
            <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
                    <div className="card-body text-center">
                        <h3 style={{ color: 'white' }}>Reservas Totales</h3>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{stats.reservations.total}</div>
                        <div style={{ marginTop: '0.5rem' }}>
                            <Link to="/admin/reservations" style={{ color: 'white', textDecoration: 'underline' }}>Ver detalles</Link>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}>
                    <div className="card-body text-center">
                        <h3 style={{ color: 'white' }}>Paquetes Activos</h3>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{stats.packages.active}</div>
                        <div style={{ marginTop: '0.5rem' }}>
                            <Link to="/admin/packages" style={{ color: 'white', textDecoration: 'underline' }}>Ver detalles</Link>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ backgroundColor: 'var(--color-success)', color: 'white' }}>
                    <div className="card-body text-center">
                        <h3 style={{ color: 'white' }}>Ingresos del Mes</h3>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>${(stats.revenue.thisMonth/1000000).toFixed(1)}M</div>
                        <div style={{ marginTop: '0.5rem' }}>
                            {stats.revenue.thisMonth > stats.revenue.lastMonth ?
                                <span>↑ {((stats.revenue.thisMonth - stats.revenue.lastMonth) / stats.revenue.lastMonth * 100).toFixed(1)}%</span> :
                                <span>↓ {((stats.revenue.lastMonth - stats.revenue.thisMonth) / stats.revenue.lastMonth * 100).toFixed(1)}%</span>
                            }
                        </div>
                    </div>
                </div>

                <div className="card" style={{ backgroundColor: 'var(--color-secondary)', color: 'white' }}>
                    <div className="card-body text-center">
                        <h3 style={{ color: 'white' }}>Usuarios Totales</h3>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{stats.users.total}</div>
                        <div style={{ marginTop: '0.5rem' }}>
                            <Link to="/admin/users" style={{ color: 'white', textDecoration: 'underline' }}>Ver detalles</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reservation Stats */}
            <div className="card mb-4">
                <div className="card-body">
                    <h2 className="mb-3">Estado de Reservas</h2>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ flex: '1 1 auto', minWidth: '200px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>Pendientes</span>
                                <span>{stats.reservations.pending}</span>
                            </div>
                            <div style={{ height: '10px', backgroundColor: 'var(--color-gray-200)', borderRadius: '5px', overflow: 'hidden' }}>
                                <div
                                    style={{
                                        height: '100%',
                                        width: `${(stats.reservations.pending / stats.reservations.total * 100)}%`,
                                        backgroundColor: 'var(--color-warning)',
                                        borderRadius: '5px'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ flex: '1 1 auto', minWidth: '200px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>Confirmadas</span>
                                <span>{stats.reservations.confirmed}</span>
                            </div>
                            <div style={{ height: '10px', backgroundColor: 'var(--color-gray-200)', borderRadius: '5px', overflow: 'hidden' }}>
                                <div
                                    style={{
                                        height: '100%',
                                        width: `${(stats.reservations.confirmed / stats.reservations.total * 100)}%`,
                                        backgroundColor: 'var(--color-info)',
                                        borderRadius: '5px'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ flex: '1 1 auto', minWidth: '200px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>Completadas</span>
                                <span>{stats.reservations.completed}</span>
                            </div>
                            <div style={{ height: '10px', backgroundColor: 'var(--color-gray-200)', borderRadius: '5px', overflow: 'hidden' }}>
                                <div
                                    style={{
                                        height: '100%',
                                        width: `${(stats.reservations.completed / stats.reservations.total * 100)}%`,
                                        backgroundColor: 'var(--color-success)',
                                        borderRadius: '5px'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ flex: '1 1 auto', minWidth: '200px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>Canceladas</span>
                                <span>{stats.reservations.canceled}</span>
                            </div>
                            <div style={{ height: '10px', backgroundColor: 'var(--color-gray-200)', borderRadius: '5px', overflow: 'hidden' }}>
                                <div
                                    style={{
                                        height: '100%',
                                        width: `${(stats.reservations.canceled / stats.reservations.total * 100)}%`,
                                        backgroundColor: 'var(--color-error)',
                                        borderRadius: '5px'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* User Distribution */}
            <div className="card mb-4">
                <div className="card-body">
                    <h2 className="mb-3">Distribución de Usuarios</h2>

                    <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        <div className="text-center">
                            <div style={{ fontSize: '3rem', color: 'var(--color-primary)' }}>{stats.users.clients}</div>
                            <div>Clientes</div>
                        </div>

                        <div className="text-center">
                            <div style={{ fontSize: '3rem', color: 'var(--color-accent)' }}>{stats.users.employees}</div>
                            <div>Empleados</div>
                        </div>

                        <div className="text-center">
                            <div style={{ fontSize: '3rem', color: 'var(--color-secondary)' }}>{stats.users.admins}</div>
                            <div>Administradores</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            <div className="card">
                <div className="card-body">
                    <h2 className="mb-3">Acciones Rápidas</h2>

                    <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                        <Link to="/admin/packages/new" className="btn btn-primary">Crear Nuevo Paquete</Link>
                        <Link to="/admin/employees/new" className="btn btn-primary">Registrar Empleado</Link>
                        <Link to="/admin/reports" className="btn btn-primary">Generar Reportes</Link>
                        <Link to="/admin/reservations" className="btn btn-primary">Gestionar Reservas</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;