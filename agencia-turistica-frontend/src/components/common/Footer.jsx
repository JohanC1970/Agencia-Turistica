const Footer = () => {
    return (
        <footer className="footer" style={{
            backgroundColor: 'var(--color-gray-800)',
            color: 'white',
            padding: '2rem 0',
            marginTop: '2rem'
        }}>
            <div className="container">
                <div className="grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '2rem'
                }}>
                    <div>
                        <h3 style={{ color: 'white' }}>Agencia Turística</h3>
                        <p>Descubre los mejores destinos y paquetes turísticos para tus vacaciones.</p>
                    </div>

                    <div>
                        <h4 style={{ color: 'white' }}>Enlaces Rápidos</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li><a href="/" style={{ color: 'var(--color-gray-300)' }}>Inicio</a></li>
                            <li><a href="/packages" style={{ color: 'var(--color-gray-300)' }}>Paquetes Turísticos</a></li>
                            <li><a href="/login" style={{ color: 'var(--color-gray-300)' }}>Iniciar Sesión</a></li>
                            <li><a href="/register" style={{ color: 'var(--color-gray-300)' }}>Registrarse</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ color: 'white' }}>Contacto</h4>
                        <p>Email: contacto@agenciaturistica.com</p>
                        <p>Teléfono: +57 123 456 7890</p>
                        <p>Dirección: Calle Principal #123, Ciudad</p>
                    </div>
                </div>

                <div className="text-center mt-4" style={{ borderTop: '1px solid var(--color-gray-700)', paddingTop: '1rem' }}>
                    <p>&copy; {new Date().getFullYear()} Agencia Turística. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;