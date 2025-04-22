import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

// Aquí importaríamos los servicios necesarios para gestionar usuarios

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Aquí haríamos un fetch a la API para obtener la lista de usuarios
        // Por ahora, simularemos la carga con datos de ejemplo

        setTimeout(() => {
            const mockUsers = [
                { id: '1001', nombre: 'Ana García', email: 'ana@example.com', rol: 'CLIENTE', estado: true },
                { id: '1002', nombre: 'Carlos Pérez', email: 'carlos@example.com', rol: 'CLIENTE', estado: true },
                { id: '1003', nombre: 'María López', email: 'maria@example.com', rol: 'EMPLEADO', estado: true },
                { id: '1004', nombre: 'Juan Rodríguez', email: 'juan@example.com', rol: 'ADMIN', estado: true },
                { id: '1005', nombre: 'Laura Martínez', email: 'laura@example.com', rol: 'CLIENTE', estado: false },
                { id: '1006', nombre: 'Pedro Sánchez', email: 'pedro@example.com', rol: 'EMPLEADO', estado: true },
                { id: '1007', nombre: 'Sofía Díaz', email: 'sofia@example.com', rol: 'CLIENTE', estado: true },
                { id: '1008', nombre: 'Miguel Torres', email: 'miguel@example.com', rol: 'CLIENTE', estado: true },
                { id: '1009', nombre: 'Lucía Castro', email: 'lucia@example.com', rol: 'CLIENTE', estado: false },
                { id: '1010', nombre: 'David Fernández', email: 'david@example.com', rol: 'CLIENTE', estado: true },
            ];

            setUsers(mockUsers);
            setLoading(false);
        }, 1000);
    }, []);

    const handleToggleStatus = (id) => {
        // Aquí implementaríamos la lógica para activar/desactivar un usuario
        // Por ahora, actualizaremos el estado local
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === id ? { ...user, estado: !user.estado } : user
            )
        );

        toast.success('Estado del usuario actualizado');
    };

    const filteredUsers = users
        .filter(user => {
            if (filter === 'ALL') return true;
            return user.rol === filter;
        })
        .filter(user => {
            if (!searchTerm) return true;
            return (
                user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.id.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1>Gestión de Usuarios</h1>
            </div>

            {/* Filters */}
            <div className="card mb-4">
                <div className="card-body">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                        <div>
                            <label className="form-label" htmlFor="filter">Filtrar por rol:</label>
                            <select
                                id="filter"
                                className="form-input"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                style={{ minWidth: '150px' }}
                            >
                                <option value="ALL">Todos</option>
                                <option value="CLIENTE">Clientes</option>
                                <option value="EMPLEADO">Empleados</option>
                                <option value="ADMIN">Administradores</option>
                            </select>
                        </div>

                        <div style={{ flex: '1 1 auto' }}>
                            <label className="form-label" htmlFor="search">Buscar:</label>
                            <input
                                id="search"
                                type="text"
                                className="form-input"
                                placeholder="Buscar por nombre, email o ID"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Users List */}
            {loading ? (
                <div className="text-center">
                    <p>Cargando usuarios...</p>
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="card">
                    <div className="card-body text-center">
                        <h3>No se encontraron usuarios</h3>
                        <p>Intenta con otros filtros o busca de nuevo.</p>
                    </div>
                </div>
            ) : (
                <div className="card">
                    <div className="card-body">
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                <tr>
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--color-gray-300)' }}>ID</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--color-gray-300)' }}>Nombre</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--color-gray-300)' }}>Email</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--color-gray-300)' }}>Rol</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--color-gray-300)' }}>Estado</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--color-gray-300)' }}>Acciones</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user.id}>
                                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-gray-200)' }}>{user.id}</td>
                                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-gray-200)' }}>{user.nombre}</td>
                                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-gray-200)' }}>{user.email}</td>
                                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-gray-200)' }}>
                        <span style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.5rem',
                            borderRadius: 'var(--border-radius)',
                            backgroundColor:
                                user.rol === 'ADMIN' ? 'var(--color-primary)' :
                                    user.rol === 'EMPLEADO' ? 'var(--color-accent)' :
                                        'var(--color-info)',
                            color: 'white'
                        }}>
                          {user.rol}
                        </span>
                                        </td>
                                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-gray-200)' }}>
                        <span style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.5rem',
                            borderRadius: 'var(--border-radius)',
                            backgroundColor: user.estado ? 'var(--color-success)' : 'var(--color-error)',
                            color: 'white'
                        }}>
                          {user.estado ? 'Activo' : 'Inactivo'}
                        </span>
                                        </td>
                                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-gray-200)' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    className="btn btn-outline"
                                                    style={{
                                                        padding: '0.25rem 0.5rem',
                                                        fontSize: '0.875rem'
                                                    }}
                                                    onClick={() => handleToggleStatus(user.id)}
                                                >
                                                    {user.estado ? 'Desactivar' : 'Activar'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersPage;