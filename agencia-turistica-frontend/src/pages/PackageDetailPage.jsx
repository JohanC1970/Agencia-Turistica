import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPackageByIdService } from '../api/packages';
import { createReservationService } from '../api/reservations';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const PackageDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [packageData, setPackageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showReservationForm, setShowReservationForm] = useState(false);
    const [reservationData, setReservationData] = useState({
        fechaInicio: '',
        fechaFin: '',
        cantidadPersonas: 1,
        formaPago: 'TARJETA_CREDITO'
    });

    useEffect(() => {
        fetchPackageDetails();
    }, [id]);

    const fetchPackageDetails = async () => {
        try {
            setLoading(true);
            const data = await getPackageByIdService(id);
            setPackageData(data);
        } catch (error) {
            console.error('Error fetching package details:', error);
            toast.error('Error al cargar los detalles del paquete');
        } finally {
            setLoading(false);
        }
    };

    const handleReservationChange = (e) => {
        const { name, value } = e.target;
        setReservationData(prev => ({ ...prev, [name]: value }));
    };

    const handleReservationSubmit = async (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            toast.error('Debes iniciar sesión para hacer una reserva');
            navigate('/login');
            return;
        }

        try {
            const reservationRequest = {
                ...reservationData,
                paqueteId: id,
                cantidadPersonas: parseInt(reservationData.cantidadPersonas)
            };

            await createReservationService(reservationRequest);
            toast.success('Reserva creada exitosamente');
            navigate('/reservations');
        } catch (error) {
            console.error('Error creating reservation:', error);
            toast.error('Error al crear la reserva');
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ padding: '2rem 1rem' }}>
                <div className="text-center">
                    <p>Cargando detalles del paquete...</p>
                </div>
            </div>
        );
    }

    if (!packageData) {
        return (
            <div className="container" style={{ padding: '2rem 1rem' }}>
                <div className="card">
                    <div className="card-body text-center">
                        <h3>Paquete no encontrado</h3>
                        <p>El paquete que estás buscando no existe o ha sido eliminado.</p>
                        <Link to="/packages" className="btn btn-primary mt-3">
                            Ver todos los paquetes
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <div className="card mb-4">
                <img
                    src={packageData.imagen || `https://source.unsplash.com/random/1200x400/?travel,${packageData.nombre}`}
                    alt={packageData.nombre}
                    style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                />
                <div className="card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                        <h1>{packageData.nombre}</h1>
                        <div>
              <span className="badge" style={{
                  backgroundColor: packageData.cuposDisponibles > 0 ? 'var(--color-success)' : 'var(--color-error)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--border-radius)',
                  marginRight: '1rem'
              }}>
                {packageData.cuposDisponibles > 0 ? 'Disponible' : 'Agotado'}
              </span>
                            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                ${packageData.precioBase?.toLocaleString() || 'Consultar'}
              </span>
                        </div>
                    </div>

                    <div className="grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem',
                        margin: '1rem 0'
                    }}>
                        <div>
                            <strong>Duración:</strong> {packageData.duracionDias} días
                        </div>
                        <div>
                            <strong>Fecha inicio:</strong> {new Date(packageData.fechaInicio).toLocaleDateString()}
                        </div>
                        <div>
                            <strong>Fecha fin:</strong> {new Date(packageData.fechaFin).toLocaleDateString()}
                        </div>
                        <div>
                            <strong>Cupos disponibles:</strong> {packageData.cuposDisponibles}/{packageData.cupoMaximo}
                        </div>
                    </div>

                    <div className="mt-4">
                        <h3>Descripción</h3>
                        <p style={{ whiteSpace: 'pre-line' }}>{packageData.descripcion}</p>
                    </div>

                    {packageData.actividades && packageData.actividades.length > 0 && (
                        <div className="mt-4">
                            <h3>Actividades incluidas</h3>
                            <ul>
                                {packageData.actividades.map(actividad => (
                                    <li key={actividad.id}>{actividad.nombre} - {actividad.descripcion}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {packageData.hospedajes && packageData.hospedajes.length > 0 && (
                        <div className="mt-4">
                            <h3>Hospedajes incluidos</h3>
                            <ul>
                                {packageData.hospedajes.map(hospedaje => (
                                    <li key={hospedaje.id}>{hospedaje.nombre} - {hospedaje.ubicacion}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="mt-4">
                        {packageData.cuposDisponibles > 0 ? (
                            <button
                                className="btn btn-primary btn-full"
                                onClick={() => setShowReservationForm(!showReservationForm)}
                            >
                                {showReservationForm ? 'Cancelar' : 'Reservar ahora'}
                            </button>
                        ) : (
                            <button className="btn btn-outline btn-full" disabled>
                                No hay cupos disponibles
                            </button>
                        )}
                    </div>

                    {showReservationForm && (
                        <div className="mt-4">
                            <h3>Formulario de Reserva</h3>
                            <form onSubmit={handleReservationSubmit}>
                                <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="fechaInicio">Fecha de Inicio</label>
                                        <input
                                            id="fechaInicio"
                                            name="fechaInicio"
                                            type="date"
                                            className="form-input"
                                            min={new Date(packageData.fechaInicio).toISOString().split('T')[0]}
                                            max={new Date(packageData.fechaFin).toISOString().split('T')[0]}
                                            value={reservationData.fechaInicio}
                                            onChange={handleReservationChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="fechaFin">Fecha de Fin</label>
                                        <input
                                            id="fechaFin"
                                            name="fechaFin"
                                            type="date"
                                            className="form-input"
                                            min={reservationData.fechaInicio || new Date(packageData.fechaInicio).toISOString().split('T')[0]}
                                            max={new Date(packageData.fechaFin).toISOString().split('T')[0]}
                                            value={reservationData.fechaFin}
                                            onChange={handleReservationChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="cantidadPersonas">Cantidad de Personas</label>
                                        <input
                                            id="cantidadPersonas"
                                            name="cantidadPersonas"
                                            type="number"
                                            className="form-input"
                                            min="1"
                                            max={packageData.cuposDisponibles}
                                            value={reservationData.cantidadPersonas}
                                            onChange={handleReservationChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="formaPago">Forma de Pago</label>
                                        <select
                                            id="formaPago"
                                            name="formaPago"
                                            className="form-input"
                                            value={reservationData.formaPago}
                                            onChange={handleReservationChange}
                                            required
                                        >
                                            <option value="EFECTIVO">Efectivo</option>
                                            <option value="TARJETA_CREDITO">Tarjeta de Crédito</option>
                                            <option value="TARJETA_DEBITO">Tarjeta de Débito</option>
                                            <option value="TRANSFERENCIA">Transferencia Bancaria</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <button type="submit" className="btn btn-primary btn-full">
                                        Confirmar Reserva
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            <div className="text-center">
                <Link to="/packages" className="btn btn-outline">
                    Volver a paquetes
                </Link>
            </div>
        </div>
    );
};

export default PackageDetailPage;