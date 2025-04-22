import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserReservationsService, cancelReservationService } from '../api/reservations';
import toast from 'react-hot-toast';

const ReservationsPage = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            setLoading(true);
            const data = await getUserReservationsService();
            setReservations(data);
        } catch (error) {
            console.error('Error fetching reservations:', error);
            toast.error('Error al cargar las reservas');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelReservation = async (id) => {
        if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
            return;
        }

        try {
            await cancelReservationService(id);
            toast.success('Reserva cancelada exitosamente');
            fetchReservations();
        } catch (error) {
            console.error('Error canceling reservation:', error);
            toast.error('Error al cancelar la reserva');
        }
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

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1 className="text-center mb-4">Mis Reservas</h1>

            {loading ? (
                <div className="text-center">
                    <p>Cargando reservas...</p>
                </div>
            ) : reservations.length === 0 ? (
                <div className="card">
                    <div className="card-body text-center">
                        <h3>No tienes reservas</h3>
                        <p>Explora nuestros paquetes turísticos y realiza tu primera reserva.</p>
                        <Link to="/packages" className="btn btn-primary mt-3">
                            Ver paquetes turísticos
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid" style={{ display: 'grid', gap: '1.5rem' }}>
                    {reservations.map((reservation) => (
                        <div key={reservation.id} className="card">
                            <div className="card-body">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                                    <div>
                                        <h3>{reservation.paquete.nombre}</h3>
                                        <div className="mb-2">
                      <span style={getStatusBadge(reservation.estado)}>
                        {reservation.estado}
                      </span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                      ${reservation.precioTotal?.toLocaleString() || 'N/A'}
                    </span>
                                        <div className="text-muted" style={{ fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
                                            Código: {reservation.codigo}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid" style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                    gap: '1rem',
                                    margin: '1rem 0'
                                }}>
                                    <div>
                                        <strong>Fecha de reserva:</strong><br />
                                        {new Date(reservation.fechaReserva).toLocaleDateString()}
                                    </div>
                                    <div>
                                        <strong>Fecha inicio:</strong><br />
                                        {new Date(reservation.fechaInicio).toLocaleDateString()}
                                    </div>
                                    <div>
                                        <strong>Fecha fin:</strong><br />
                                        {new Date(reservation.fechaFin).toLocaleDateString()}
                                    </div>
                                    <div>
                                        <strong>Forma de pago:</strong><br />
                                        {reservation.formaPago}
                                    </div>
                                </div>

                                <div className="mt-3" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                    <Link to={`/packages/${reservation.paquete.id}`} className="btn btn-outline">
                                        Ver paquete
                                    </Link>

                                    {(reservation.estado === 'PENDIENTE' || reservation.estado === 'CONFIRMADA') && (
                                        <button
                                            className="btn btn-outline"
                                            style={{ color: 'var(--color-error)', borderColor: 'var(--color-error)' }}
                                            onClick={() => handleCancelReservation(reservation.id)}
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReservationsPage;