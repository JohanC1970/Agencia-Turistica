import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { resendVerificationCodeService } from '../api/auth';
import toast from 'react-hot-toast';

const VerificationPage = () => {
    const [error, setError] = useState('');
    const [emailFromState, setEmailFromState] = useState('');
    const { verifyAccount } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.email) {
            setEmailFromState(location.state.email);
        }
    }, [location]);

    const formik = useFormik({
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
                const result = await verifyAccount(values.email, values.codigo);

                if (result.success) {
                    navigate('/login');
                } else {
                    setError(result.error || 'Error al verificar la cuenta');
                }
            } catch (err) {
                setError('Ocurrió un error al procesar la solicitud');
                console.error(err);
            }
        },
    });

    const handleResendCode = async () => {
        if (!formik.values.email || formik.errors.email) {
            setError('Ingresa un email válido para reenviar el código');
            return;
        }

        try {
            await resendVerificationCodeService(formik.values.email);
            toast.success('Se ha enviado un nuevo código a tu correo');
        } catch (error) {
            toast.error('Error al reenviar el código');
            console.error(error);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '500px', padding: '2rem 1rem' }}>
            <div className="card">
                <div className="card-body">
                    <h2 className="text-center mb-4">Verificar Cuenta</h2>

                    <p className="text-center mb-4">
                        Ingresa el código de verificación que enviamos a tu correo electrónico.
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

                        <div className="form-group">
                            <label className="form-label" htmlFor="codigo">Código de Verificación</label>
                            <input
                                id="codigo"
                                name="codigo"
                                type="text"
                                className="form-input"
                                placeholder="Ingresa el código de 6 dígitos"
                                {...formik.getFieldProps('codigo')}
                                maxLength={6}
                            />
                            {formik.touched.codigo && formik.errors.codigo ? (
                                <div className="form-error">{formik.errors.codigo}</div>
                            ) : null}
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                            <button
                                type="submit"
                                className="btn btn-primary btn-full"
                                disabled={formik.isSubmitting}
                            >
                                {formik.isSubmitting ? 'Verificando...' : 'Verificar Cuenta'}
                            </button>
                        </div>
                    </form>

                    <div className="text-center mt-4">
                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={handleResendCode}
                        >
                            Reenviar código
                        </button>

                        <div className="mt-2">
                            <Link to="/login" style={{ color: 'var(--color-primary)' }}>
                                Volver al inicio de sesión
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerificationPage;