import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const ForgotPasswordPage = () => {
    const [error, setError] = useState('');
    const { requestPasswordRecovery } = useAuth();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Email inválido')
                .required('El email es requerido'),
        }),
        onSubmit: async (values) => {
            setError('');

            try {
                const result = await requestPasswordRecovery(values.email);

                if (result.success) {
                    navigate('/reset-password', { state: { email: values.email } });
                } else {
                    setError(result.error || 'Error al solicitar la recuperación de contraseña');
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
                    <h2 className="text-center mb-4">Recuperar Contraseña</h2>

                    <p className="text-center mb-4">
                        Ingresa tu correo electrónico y te enviaremos un código para recuperar tu contraseña.
                    </p>

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

                        <div style={{ marginTop: '1.5rem' }}>
                            <button
                                type="submit"
                                className="btn btn-primary btn-full"
                                disabled={formik.isSubmitting}
                            >
                                {formik.isSubmitting ? 'Enviando...' : 'Enviar Código'}
                            </button>
                        </div>
                    </form>

                    <div className="text-center mt-4">
                        <Link to="/login" style={{ color: 'var(--color-primary)' }}>
                            Volver al inicio de sesión
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;