import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="container text-center" style={{ padding: '4rem 1rem' }}>
            <h1>404</h1>
            <h2>Página no encontrada</h2>
            <p className="mt-3">La página que estás buscando no existe o ha sido removida.</p>
            <Link to="/" className="btn btn-primary mt-3">Volver al inicio</Link>
        </div>
    );
};

export default NotFoundPage;