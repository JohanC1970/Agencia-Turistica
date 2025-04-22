import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const LoginPage = () => {
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Email inválido')
                .required('El email es requerido'),
            password: Yup.string()
                .required('La contraseña es requerida')
        }),
        onSubmit: async (values) => {
            setError('');

            try {
                const result = await login(values);

                if (result.success) {
                    navigate('/');
                } else {
                    setError(result.error || 'Error al iniciar sesión');
                }
            } catch (err) {
                setError('Ocurrió un error al procesar la solicitud');
                console.error(err);
            }
        },
    });

    return (
        <div className="container" style={{ maxWidth: '500px', padding: '2rem 1rem' }}>
            <div className="card">
                <div className="card-body">
                    <h2 className="text-center mb-4">Iniciar Sesión</h2>

                    {error && (
                        <div className="alert alert-error">{error}</div>
                    )}

                    <form onSubmit={formik.handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="email">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className="form-input"
                                placeholder="tu@email.com"
                                {...formik.getFieldProps('email')}
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <div className="form-error">{formik.errors.email}</div>
                            ) : null}
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="password">Contraseña</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                className="form-input"
                                placeholder="Tu contraseña"
                                {...formik.getFieldProps('password')}
                            />
                            {formik.touched.password && formik.errors.password ? (
                                <div className="form-error">{formik.errors.password}</div>
                            ) : null}
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                            <button
                                type="submit"
                                className="btn btn-primary btn-full"
                                disabled={formik.isSubmitting}
                            >
                                {formik.isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                            </button>
                        </div>
                    </form>

                    <div className="text-center mt-4">
                        <Link to="/forgot-password" style={{ color: 'var(--color-primary)', display: 'block', marginBottom: '0.5rem' }}>
                            ¿Olvidaste tu contraseña?
                        </Link>

                        <Link to="/verify" style={{ color: 'var(--color-primary)', display: 'block', marginBottom: '0.5rem' }}>
                            Verificar cuenta
                        </Link>

                        <div className="mt-2">
                            ¿No tienes una cuenta? <Link to="/register" style={{ color: 'var(--color-primary)' }}>Regístrate</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;