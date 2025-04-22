import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Aquí importaríamos los servicios necesarios para gestionar paquetes turísticos

const PackagesPage = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Aquí haríamos un fetch a la API para obtener la lista de paquetes
        // Por ahora, simularemos la carga con datos de ejemplo

        setTimeout(() => {
            const mockPackages = [
                {
                    id: 1,
                    nombre: "Aventura en el Amazonas",
                    descripcion: "Explora la selva amazónica y descubre la biodiversidad única de esta región.",
                    precioBase: 1500000,
                    duracionDias: 5,
                    fechaInicio: "2025-06-15",
                    fechaFin: "2025-12-15",
                    cupoMaximo: 20,
                    cuposDisponibles: 15
                },
                {
                    id: 2,
                    nombre: "Playas del Caribe",
                    descripcion: "Disfruta del sol, la playa y la cultura caribeña en este increíble paquete.",
                    precioBase: 1200000,
                    duracionDias: 4,
                    fechaInicio: "2025-05-10",
                    fechaFin: "2025-11-10",
                    cupoMaximo: 30,
                    cuposDisponibles: 22
                },
                {
                    id: 3,
                    nombre: "Mágica Cartagena",
                    descripcion: "Conoce la ciudad amurallada y su rica historia colonial.",
                    precioBase: 900000,
                    duracionDias: 3,
                    fechaInicio: "2025-05-01",
                    fechaFin: "2025-10-30",
                    cupoMaximo: 25,
                    cuposDisponibles: 10
                },
                {
                    id: 4,
                    nombre: "Tour por los Cafetales",
                    descripcion: "Descubre el proceso del café colombiano desde la siembra hasta la taza.",
                    precioBase: 850000,
                    duracionDias: 4,
                    fechaInicio: "2025-07-01",
                    fechaFin: "2025-12-20",
                    cupoMaximo: 15,
                    cuposDisponibles: 8
                },
                {
                    id: 5,
                    nombre: "Sierra Nevada",
                    descripcion: "Naturaleza y cultura ancestral en la Sierra Nevada de Santa Marta.",
                    precioBase: 1300000,
                    duracionDias: 6,
                    fechaInicio: "2025-06-10",
                    fechaFin: "2025-11-15",
                    cupoMaximo: 12,
                    cuposDisponibles: 3
                }
            ];

            setPackages(mockPackages);
            setLoading(false);
        }, 1000);
    }, []);

    const handleDeletePackage = (id) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este paquete turístico?')) {
            return;
        }

        // Aquí implementaríamos la lógica para eliminar un paquete
        // Por ahora, actualizaremos el estado local
        setPackages(prev => prev.filter(pkg => pkg.id !== id));
        toast.success('Paquete eliminado exitosamente');
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1>Gestión de Paquetes Turísticos</h1>
                <Link to="/admin/packages/new" className="btn btn-primary">
                    Crear Nuevo Paquete
                </Link>
            </div>

            {/* Packages List */}
            {loading ? (
                <div className="text-center">
                    <p>Cargando paquetes...</p>
                </div>
            ) : packages.length === 0 ? (
                <div className="card">
                    <div className="card-body text-center">
                        <h3>No se encontraron paquetes turísticos</h3>
                        <p>Crea un nuevo paquete para comenzar.</p>
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
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--color-gray-300)' }}>Precio Base</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--color-gray-300)' }}>Duración</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--color-gray-300)' }}>Cupos</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--color-gray-300)' }}>Fecha Inicio</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--color-gray-300)' }}>Fecha Fin</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--color-gray-300)' }}>Acciones</th>
                                </tr>
                                </thead>
                                <tbody>
                                {packages.map(pkg => (
                                    <tr key={pkg.id}>
                                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-gray-200)' }}>{pkg.id}</td>
                                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-gray-200)' }}>{pkg.nombre}</td>
                                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-gray-200)' }}>${pkg.precioBase.toLocaleString()}</td>
                                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-gray-200)' }}>{pkg.duracionDias} días</td>
                                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-gray-200)' }}>
                                            {pkg.cuposDisponibles}/{pkg.cupoMaximo}
                                        </td>
                                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-gray-200)' }}>
                                            {new Date(pkg.fechaInicio).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-gray-200)' }}>
                                            {new Date(pkg.fechaFin).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-gray-200)' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <Link
                                                    to={`/admin/packages/${pkg.id}`}
                                                    className="btn btn-outline"
                                                    style={{
                                                        padding: '0.25rem 0.5rem',
                                                        fontSize: '0.875rem'
                                                    }}
                                                >
                                                    Editar
                                                </Link>

                                                <button
                                                    className="btn btn-outline"
                                                    style={{
                                                        padding: '0.25rem 0.5rem',
                                                        fontSize: '0.875rem',
                                                        color: 'var(--color-error)',
                                                        borderColor: 'var(--color-error)'
                                                    }}
                                                    onClick={() => handleDeletePackage(pkg.id)}
                                                >
                                                    Eliminar
                                                </button>

                                                <Link
                                                    to={`/packages/${pkg.id}`}
                                                    className="btn btn-outline"
                                                    style={{
                                                        padding: '0.25rem 0.5rem',
                                                        fontSize: '0.875rem'
                                                    }}
                                                    target="_blank"
                                                >
                                                    Ver
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

export default PackagesPage;