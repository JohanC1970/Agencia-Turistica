import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const HomePage = () => {
    const [featuredPackages, setFeaturedPackages] = useState([]);
    const [loading, setLoading] = useState(true);

    // Simular carga de paquetes destacados
    useEffect(() => {
        // Aquí conectaríamos con el API real para obtener los paquetes destacados
        // De momento usamos datos de ejemplo
        const mockFeaturedPackages = [
            {
                id: 1,
                nombre: "Aventura en el Amazonas",
                descripcion: "Explora la selva amazónica y descubre la biodiversidad única de esta región.",
                precioBase: 1500000,
                duracionDias: 5,
                imagen: "https://source.unsplash.com/random/300x200/?amazon"
            },
            {
                id: 2,
                nombre: "Playas del Caribe",
                descripcion: "Disfruta del sol, la playa y la cultura caribeña en este increíble paquete.",
                precioBase: 1200000,
                duracionDias: 4,
                imagen: "https://source.unsplash.com/random/300x200/?caribbean"
            },
            {
                id: 3,
                nombre: "Mágica Cartagena",
                descripcion: "Conoce la ciudad amurallada y su rica historia colonial.",
                precioBase: 900000,
                duracionDias: 3,
                imagen: "https://source.unsplash.com/random/300x200/?cartagena"
            }
        ];

        setTimeout(() => {
            setFeaturedPackages(mockFeaturedPackages);
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <section className="hero" style={{
                backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://source.unsplash.com/random/1600x900/?travel)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: 'white',
                padding: '5rem 1rem',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'white' }}>Descubre tu próxima aventura</h1>
                    <p style={{ fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto 2rem' }}>
                        Explora nuestros paquetes turísticos cuidadosamente seleccionados para brindarte experiencias únicas e inolvidables.
                    </p>
                    <Link to="/packages" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1.1rem' }}>
                        Ver paquetes turísticos
                    </Link>
                </div>
            </section>

            {/* Featured Packages Section */}
            <section className="featured-packages" style={{ padding: '4rem 1rem' }}>
                <div className="container">
                    <h2 className="text-center mb-4">Paquetes Destacados</h2>

                    {loading ? (
                        <div className="text-center">Cargando paquetes destacados...</div>
                    ) : (
                        <div className="grid" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '2rem'
                        }}>
                            {featuredPackages.map(pkg => (
                                <div key={pkg.id} className="card">
                                    <img src={pkg.imagen} alt={pkg.nombre} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                                    <div className="card-body">
                                        <h3>{pkg.nombre}</h3>
                                        <p>{pkg.descripcion}</p>
                                        <p><strong>Precio:</strong> ${pkg.precioBase.toLocaleString()}</p>
                                        <p><strong>Duración:</strong> {pkg.duracionDias} días</p>
                                        <Link to={`/packages/${pkg.id}`} className="btn btn-outline" style={{ marginTop: '1rem' }}>
                                            Ver detalles
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="why-choose-us" style={{
                backgroundColor: 'var(--color-gray-100)',
                padding: '4rem 1rem'
            }}>
                <div className="container">
                    <h2 className="text-center mb-4">¿Por qué elegirnos?</h2>

                    <div className="grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                        gap: '2rem'
                    }}>
                        <div className="text-center">
                            <div style={{ fontSize: '3rem', color: 'var(--color-primary)' }}>🌟</div>
                            <h3>Calidad Premium</h3>
                            <p>Seleccionamos los mejores destinos y servicios para brindarte una experiencia de primera clase.</p>
                        </div>

                        <div className="text-center">
                            <div style={{ fontSize: '3rem', color: 'var(--color-primary)' }}>💰</div>
                            <h3>Precios Competitivos</h3>
                            <p>Ofrecemos paquetes turísticos con la mejor relación calidad-precio del mercado.</p>
                        </div>

                        <div className="text-center">
                            <div style={{ fontSize: '3rem', color: 'var(--color-primary)' }}>🔒</div>
                            <h3>Reservas Seguras</h3>
                            <p>Tu información y pagos están protegidos con los más altos estándares de seguridad.</p>
                        </div>

                        <div className="text-center">
                            <div style={{ fontSize: '3rem', color: 'var(--color-primary)' }}>🌐</div>
                            <h3>Soporte 24/7</h3>
                            <p>Nuestro equipo está siempre disponible para asistirte durante tu viaje.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta" style={{
                padding: '4rem 1rem',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h2>¿Listo para tu próxima aventura?</h2>
                    <p className="mt-2 mb-3">Registrate ahora y comienza a planificar tu viaje de ensueño.</p>
                    <Link to="/register" className="btn btn-primary">Crear Cuenta</Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;