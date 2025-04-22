import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
    return (
        <div className="app-container">
            <Header />
            <main className="main-content" style={{ minHeight: 'calc(100vh - 220px)', padding: '20px 0' }}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;