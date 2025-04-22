import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

// Aquí importaríamos los servicios necesarios para gestionar reservas

const ReservationsPage = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Aquí haríamos un fetch a la API para obtener la lista de reservas
        // Por ahora, simularemos la carga con datos de ejemplo

        setTimeout(() => {
            const mockReservations = [
                {
                    id: 101,
                    codigo: 'RES-2025-001',
                    cliente: { id: '1001', nombre: 'Ana García', email: 'ana@example.com' },
                    paquete: { id: 1, nombre: 'Aventura en el Amazonas' },
                    fechaReserva: '2025-04-10',
                    fechaInicio: '2025-06-15',
                    fechaFin: '2025-06-20',
                    precioTotal: 1650000,
                    estado: 'PENDIENTE',
                    formaPago: 'TARJETA_CREDITO'
                },
                {
                    id: 102,
                    codigo: 'RES-2025-002',
                    cliente: { id: '1002', nombre: 'Carlos Pérez', email: 'carlos@example.com' },
                    paquete: { id: 2, nombre: 'Playas del Caribe' },
                    fechaReserva: '2025-04-05',
                    fechaInicio: '2025-05-20',
                    fechaFin: '2025-05-24',
                    precioTotal: 1320000,
                    estado: 'CONFIRMADA',
                    formaPago: 'TRANSFERENCIA'
                },
                {
                    id: 103,
                    codigo: 'RES-2025-003',
                    cliente: { id: '1003', nombre: 'Sofía Díaz', email: 'sofia@example.com' },
                    paquete: { id: 3, nombre: 'Mágica Cartagena' },
                    fechaReserva: '2025-03-15',
                    fechaInicio: '2025-05-05',
                    fechaFin: '2025-05-08',
                    precioTotal: 990000,
                    estado: 'EN_PROGRESO',
                    formaPago: 'TARJETA_DEBITO'
                },
                {
                    id: 104,
                    codigo: 'RES-2025-004',
                    cliente: { id: '1004', nombre: 'Miguel Torres', email: 'miguel@example.com' },
                    paquete: { id: 4, nombre: 'Tour por los Cafetales' },
                    fechaReserva: '2025-03-20',
                    fechaInicio: '2025-07-10',
                    fechaFin: '2025-07-14',
                    precioTotal: 935000,
                    estado: 'CONFIRMADA',
                    formaPago: 'EFECTIVO'
                },
                {
                    id: 105,
                    codigo: 'RES-2025-005',
                    cliente: { id: '1005', nombre: 'Laura Martínez', email: 'laura@example.com' },
                    paquete: { id: 5, nombre: 'Sierra Nevada' },
                    fechaReserva: '2025-02-25',
                    fechaInicio: '2025-06-15',
                    fechaFin: '2025-06-21',
                    precioTotal: 1430000,
                    estado: 'COMPLETADA',
                    formaPago: 'TARJETA_CREDITO'
                },
                {
                    id: 106,
                    codigo: 'RES-2025-006',
                    cliente: { id: '1006', nombre: 'David Fernández', email: 'david@example.com' },
                    paquete: { id: 1, nombre: 'Aventura en el Amazonas' },
                    fechaReserva: '2025-04-02',
                    fechaInicio: '2025-07-05',
                    fechaFin: '2025-07-10',
                    precioTotal: 1650000,
                    estado: 'CANCELADA',
                    formaPago: 'TRANSFERENCIA'
                }
            ];

            setReservations(mockReservations);
            setLoading(false);
        }, 1000);
    }, []);

    const handleUpdateStatus = (id, newStatus) => {
        // Aquí implementaríamos la lógica para actualizar el estado de una reserva
        // Por ahora, actualizaremos el estado local
        setReservations(prev =>
            prev.map(res =>
                res.id === id ? { ...res, estado: newStatus } : res
            )
        );

        toast.success(`Estado de la reserva actualizado a ${newStatus}`);
    };

    // Helper function to get status badge style
    const getStatusBadge = (status) => {
        let background;
        switch (status) {
            case 'PENDIENTE':
                background = 'var(--color-warning)';
                break;
            case 'CONFIRMADA':
                background = 'var(--color-info)';
                break;
            case 'EN_PROGRESO':
                background = 'var(--color-primary)';
                break;
            case 'COMPLETADA':
                background = 'var(--color-success)';
                break;
            case 'CANCELADA':
                background = 'var(--color-error)';
                break;
            default:
                background = 'var(--color-secondary)';
        }

        return {
            backgroundColor: background,
            color: 'white',
            padding: '0.25rem 0.5rem',
            borderRadius: 'var(--border-radius)',
            display: 'inline-block'
        };
    };

    const filteredReservations = reservations
        .filter(reservation => {
            if (filter === 'ALL') return true;
            return reservation.estado === filter;
        })
        .filter(reservation => {
            if (!searchTerm) return true;
            return (
                reservation.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                reservation.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                reservation.cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                reservation.paquete.nombre.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1 className="mb-4">Gestión de Reservas</h1>

            {/* Filters */}
            <div className="card mb-4">
                <div className="card-body">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                        <div>
                            <label className="form-label" htmlFor="filter">Filtrar por estado:</label>
                            <select
                                id="filter"
                                className="form-input"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                style={{ minWidth: '150px' }}
                            >
                                <option value="ALL">Todos</option>
                                <option value="PENDIENTE">Pendientes</option>
                                <option value="CONFIRMADA">Confirmadas</option>
                                <option value="EN_PROGRESO">En Progreso</option>
                                <option value="COMPLETADA">Completadas</option>
                                <option value="CANCELADA">Canceladas</option>
                            </select>
                        </div>

                        <div style={{ flex: '1 1 auto' }}>
                            <label className="form-label" htmlFor="search">Buscar:</label>
                            <input
                                id="search"
                                type="text"
                                className="form-input"
                                placeholder="Buscar por código, cliente o paquete"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Reservations List */}
            {loading ? (
                <div className="text-center">
                    <p>Cargando reservas...</p>
                </div>
            ) : filteredReservations.length === 0 ? (
                <div className="card">
                    <div className="card-body text-center">
                        <h3>No se encontraron reservas</h3>
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
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--color-gray-300)' }}>Código</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--color-gray-300)' }}>Cliente</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--color-gray-300)' }}>Paquete</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--color-gray-300)' }}>Fechas</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--color-gray-300)' }}>Monto</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--color-gray-300)' }}>Estado</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--color-gray-300)' }}>Acciones</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredReservations.map(reservation => (
                                    <tr key={reservation.id}>
                                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-gray-200)' }}>
                                            {reservation.codigo}
                                        </td>
                                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-gray-200)' }}>
                                            <div>{reservation.cliente.nombre}</div>
                                            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
                                                {reservation.cliente.email}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-gray-200)' }}>
                                            {reservation.paquete.nombre}
                                        </td>
                                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-gray-200)' }}>
                                            <div>Inicio: {new Date(reservation.fechaInicio).toLocaleDateString()}</div>
                                            <div>Fin: {new Date(reservation.fechaFin).toLocaleDateString()}</div>
                                        </td>
                                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-gray-200)' }}>
                                            <div>${reservation.precioTotal.toLocaleString()}</div>
                                            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
                                                {reservation.formaPago.replace('_', ' ')}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-gray-200)' }}>
                        <span style={getStatusBadge(reservation.estado)}>
                          {reservation.estado}
                        </span>
                                        </td>
                                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-gray-200)' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                {reservation.estado === 'PENDIENTE' && (
                                                    <button
                                                        className="btn btn-outline"
                                                        style={{
                                                            padding: '0.25rem 0.5rem',
                                                            fontSize: '0.875rem'
                                                        }}
                                                        onClick={() => handleUpdateStatus(reservation.id, 'CONFIRMADA')}
                                                    >
                                                        Confirmar
                                                    </button>
                                                )}

                                                {reservation.estado === 'CONFIRMADA' && (
                                                    <button
                                                        className="btn btn-outline"
                                                        style={{
                                                            padding: '0.25rem 0.5rem',
                                                            fontSize: '0.875rem'
                                                        }}
                                                        onClick={() => handleUpdateStatus(reservation.id, 'EN_PROGRESO')}
                                                    >
                                                        Iniciar
                                                    </button>
                                                )}

                                                {reservation.estado === 'EN_PROGRESO' && (
                                                    <button
                                                        className="btn btn-outline"
                                                        style={{
                                                            padding: '0.25rem 0.5rem',
                                                            fontSize: '0.875rem'
                                                        }}
                                                        onClick={() => handleUpdateStatus(reservation.id, 'COMPLETADA')}
                                                    >
                                                        Completar
                                                    </button>
                                                )}

                                                {(reservation.estado === 'PENDIENTE' || reservation.estado === 'CONFIRMADA') && (
                                                    <button
                                                        className="btn btn-outline"
                                                        style={{
                                                            padding: '0.25rem 0.5rem',
                                                            fontSize: '0.875rem',
                                                            color: 'var(--color-error)',
                                                            borderColor: 'var(--color-error)'
                                                        }}
                                                        onClick={() => handleUpdateStatus(reservation.id, 'CANCELADA')}
                                                    >
                                                        Cancelar
                                                    </button>
                                                )}

                                                <Link
                                                    to={`/admin/reservations/${reservation.id}`}
                                                    className="btn btn-outline"
                                                    style={{
                                                        padding: '0.25rem 0.5rem',
                                                        fontSize: '0.875rem',
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    Ver detalles
                                                </Link>
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

export default ReservationsPage;