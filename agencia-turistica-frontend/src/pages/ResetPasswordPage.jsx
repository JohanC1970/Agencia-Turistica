import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const ResetPasswordPage = () => {
    const [error, setError] = useState('');
    const [step, setStep] = useState(1); // 1: Verificar código, 2: Nueva contraseña
    const [emailFromState, setEmailFromState] = useState('');
    const { verifyRecoveryCode, resetPassword } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.email) {
            setEmailFromState(location.state.email);
        }
    }, [location]);

    const verifyCodeFormik = useFormik({
        initialValues: {
            email: emailFromState || '',
            codigo: '',
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Email inválido')
                .required('El email es requerido'),
            codigo: Yup.string()
                .required('El código es requerido')
                .matches(/^\d{6}$/, 'El código debe tener 6 dígitos')
        }),
        onSubmit: async (values) => {
            setError('');

            try {
                const result = await verifyRecoveryCode(values.email, values.codigo);

                if (result.success) {
                    setStep(2);
                } else {
                    setError(result.error || 'Error al verificar el código');
                }
            } catch (err) {
                setError('Ocurrió un error al procesar la solicitud');
                console.error(err);
            }
        },
    });

    const resetPasswordFormik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .min(6, 'La contraseña debe tener al menos 6 caracteres')
                .required('La contraseña es requerida'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
                .required('Confirma tu contraseña')
        }),
        onSubmit: async (values) => {
            setError('');

            try {
                const result = await resetPassword(verifyCodeFormik.values.email, values.password);

                if (result.success) {
                    navigate('/login');
                } else {
                    setError(result.error || 'Error al cambiar la contraseña');
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
                    {step === 1 ? (
                        <>
                            <h2 className="text-center mb-4">Verificar Código</h2>

                            <p className="text-center mb-4">
                                Ingresa el código de recuperación que enviamos a tu correo electrónico.
                            </p>

                            {error && (
                                <div className="alert alert-error">{error}</div>
                            )}

                            <form onSubmit={verifyCodeFormik.handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="email">Email</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        className="form-input"
                                        placeholder="tu@email.com"
                                        {...verifyCodeFormik.getFieldProps('email')}
                                    />
                                    {verifyCodeFormik.touched.email && verifyCodeFormik.errors.email ? (
                                        <div className="form-error">{verifyCodeFormik.errors.email}</div>
                                    ) : null}
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="codigo">Código de Recuperación</label>
                                    <input
                                        id="codigo"
                                        name="codigo"
                                        type="text"
                                        className="form-input"
                                        placeholder="Ingresa el código de 6 dígitos"
                                        {...verifyCodeFormik.getFieldProps('codigo')}
                                        maxLength={6}
                                    />
                                    {verifyCodeFormik.touched.codigo && verifyCodeFormik.errors.codigo ? (
                                        <div className="form-error">{verifyCodeFormik.errors.codigo}</div>
                                    ) : null}
                                </div>

                                <div style={{ marginTop: '1.5rem' }}>
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-full"
                                        disabled={verifyCodeFormik.isSubmitting}
                                    >
                                        {verifyCodeFormik.isSubmitting ? 'Verificando...' : 'Verificar Código'}
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <>
                            <h2 className="text-center mb-4">Nueva Contraseña</h2>

                            <p className="text-center mb-4">
                                Ingresa tu nueva contraseña.
                            </p>

                            {error && (
                                <div className="alert alert-error">{error}</div>
                            )}

                            <form onSubmit={resetPasswordFormik.handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="password">Nueva Contraseña</label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        className="form-input"
                                        placeholder="Tu nueva contraseña"
                                        {...resetPasswordFormik.getFieldProps('password')}
                                    />
                                    {resetPasswordFormik.touched.password && resetPasswordFormik.errors.password ? (
                                        <div className="form-error">{resetPasswordFormik.errors.password}</div>
                                    ) : null}
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="confirmPassword">Confirmar Contraseña</label>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        className="form-input"
                                        placeholder="Confirma tu nueva contraseña"
                                        {...resetPasswordFormik.getFieldProps('confirmPassword')}
                                    />
                                    {resetPasswordFormik.touched.confirmPassword && resetPasswordFormik.errors.confirmPassword ? (
                                        <div className="form-error">{resetPasswordFormik.errors.confirmPassword}</div>
                                    ) : null}
                                </div>

                                <div style={{ marginTop: '1.5rem' }}>
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-full"
                                        disabled={resetPasswordFormik.isSubmitting}
                                    >
                                        {resetPasswordFormik.isSubmitting ? 'Cambiando contraseña...' : 'Cambiar Contraseña'}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}

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

export default ResetPasswordPage;