import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPackagesService } from '../api/packages';
import toast from 'react-hot-toast';

const PackagesPage = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        ciudad: '',
        precioMaximo: '',
        duracionMaxima: '',
        fecha: ''
    });

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async (appliedFilters = {}) => {
        try {
            setLoading(true);
            const data = await getAllPackagesService(appliedFilters);
            setPackages(data);
        } catch (error) {
            console.error('Error fetching packages:', error);
            toast.error('Error al cargar los paquetes turísticos');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        fetchPackages(filters);
    };

    const handleResetFilters = () => {
        setFilters({
            ciudad: '',
            precioMaximo: '',
            duracionMaxima: '',
            fecha: ''
        });
        fetchPackages({});
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1 className="text-center mb-4">Paquetes Turísticos</h1>

            {/* Filters */}
            <div className="card mb-4">
                <div className="card-body">
                    <h3 className="mb-3">Filtros</h3>

                    <form onSubmit={handleFilterSubmit}>
                        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="ciudad">Ciudad</label>
                                <input
                                    id="ciudad"
                                    name="ciudad"
                                    type="text"
                                    className="form-input"
                                    placeholder="Ej. Cartagena"
                                    value={filters.ciudad}
                                    onChange={handleFilterChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="precioMaximo">Precio Máximo</label>
                                <input
                                    id="precioMaximo"
                                    name="precioMaximo"
                                    type="number"
                                    className="form-input"
                                    placeholder="Ej. 2000000"
                                    value={filters.precioMaximo}
                                    onChange={handleFilterChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="duracionMaxima">Duración Máxima (días)</label>
                                <input
                                    id="duracionMaxima"
                                    name="duracionMaxima"
                                    type="number"
                                    className="form-input"
                                    placeholder="Ej. 7"
                                    value={filters.duracionMaxima}
                                    onChange={handleFilterChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="fecha">Fecha</label>
                                <input
                                    id="fecha"
                                    name="fecha"
                                    type="date"
                                    className="form-input"
                                    value={filters.fecha}
                                    onChange={handleFilterChange}
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                            <button type="submit" className="btn btn-primary">
                                Aplicar Filtros
                            </button>

                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={handleResetFilters}
                            >
                                Limpiar Filtros
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Packages */}
            {loading ? (
                <div className="text-center">
                    <p>Cargando paquetes turísticos...</p>
                </div>
            ) : packages.length === 0 ? (
                <div className="card">
                    <div className="card-body text-center">
                        <h3>No se encontraron paquetes turísticos</h3>
                        <p>Intenta con otros filtros o vuelve más tarde.</p>
                    </div>
                </div>
            ) : (
                <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {packages.map((pkg) => (
                        <div key={pkg.id} className="card">
                            <img
                                src={pkg.imagen || `https://source.unsplash.com/random/300x200/?travel,${pkg.nombre}`}
                                alt={pkg.nombre}
                                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                            />
                            <div className="card-body">
                                <h3>{pkg.nombre}</h3>
                                <p>{pkg.descripcion && pkg.descripcion.length > 100
                                    ? pkg.descripcion.substring(0, 100) + '...'
                                    : pkg.descripcion}
                                </p>
                                <p><strong>Precio:</strong> ${pkg.precioBase?.toLocaleString() || 'Consultar'}</p>
                                <p><strong>Duración:</strong> {pkg.duracionDias} días</p>
                                <p><strong>Cupos disponibles:</strong> {pkg.cuposDisponibles}</p>
                                <Link to={`/packages/${pkg.id}`} className="btn btn-primary" style={{ marginTop: '1rem', display: 'block', textAlign: 'center' }}>
                                    Ver detalles
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PackagesPage;