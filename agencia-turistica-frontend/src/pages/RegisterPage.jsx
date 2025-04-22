import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const RegisterPage = () => {
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            id: '',
            nombre: '',
            apellidos: '',
            email: '',
            password: '',
            confirmPassword: '',
            telefono: '',
            fechaNacimiento: '',
        },
        validationSchema: Yup.object({
            id: Yup.string()
                .required('La identificación es requerida'),
            nombre: Yup.string()
                .required('El nombre es requerido'),
            apellidos: Yup.string()
                .required('Los apellidos son requeridos'),
            email: Yup.string()
                .email('Email inválido')
                .required('El email es requerido'),
            password: Yup.string()
                .min(6, 'La contraseña debe tener al menos 6 caracteres')
                .required('La contraseña es requerida'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
                .required('Confirma tu contraseña'),
            telefono: Yup.string()
                .required('El teléfono es requerido'),
            fechaNacimiento: Yup.date()
                .required('La fecha de nacimiento es requerida')
                .max(new Date(new Date().setFullYear(new Date().getFullYear() - 18)), 'Debes ser mayor de 18 años')
        }),
        onSubmit: async (values) => {
            setError('');

            try {
                // Transformar los datos para que coincidan con el formato esperado por el API
                const userData = {
                    id: values.id,
                    nombre: values.nombre,
                    apellidos: values.apellidos,
                    email: values.email,
                    password: values.password,
                    telefono: values.telefono,
                    fechaNacimiento: values.fechaNacimiento
                };

                const result = await register(userData);

                if (result.success) {
                    navigate('/verify', { state: { email: values.email } });
                } else {
                    setError(result.error || 'Error al registrarse');
                }
            } catch (err) {
                setError('Ocurrió un error al procesar la solicitud');
                console.error(err);
            }
        },
    });

    return (
        <div className="container" style={{ maxWidth: '600px', padding: '2rem 1rem' }}>
            <div className="card">
                <div className="card-body">
                    <h2 className="text-center mb-4">Crear Cuenta</h2>

                    {error && (
                        <div className="alert alert-error">{error}</div>
                    )}

                    <form onSubmit={formik.handleSubmit}>
                        <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="id">Identificación</label>
                                <input
                                    id="id"
                                    name="id"
                                    type="text"
                                    className="form-input"
                                    placeholder="Tu número de identificación"
                                    {...formik.getFieldProps('id')}
                                />
                                {formik.touched.id && formik.errors.id ? (
                                    <div className="form-error">{formik.errors.id}</div>
                                ) : null}
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="telefono">Teléfono</label>
                                <input
                                    id="telefono"
                                    name="telefono"
                                    type="tel"
                                    className="form-input"
                                    placeholder="Tu número de teléfono"
                                    {...formik.getFieldProps('telefono')}
                                />
                                {formik.touched.telefono && formik.errors.telefono ? (
                                    <div className="form-error">{formik.errors.telefono}</div>
                                ) : null}
                            </div>
                        </div>

                        <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="nombre">Nombre</label>
                                <input
                                    id="nombre"
                                    name="nombre"
                                    type="text"
                                    className="form-input"
                                    placeholder="Tu nombre"
                                    {...formik.getFieldProps('nombre')}
                                />
                                {formik.touched.nombre && formik.errors.nombre ? (
                                    <div className="form-error">{formik.errors.nombre}</div>
                                ) : null}
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="apellidos">Apellidos</label>
                                <input
                                    id="apellidos"
                                    name="apellidos"
                                    type="text"
                                    className="form-input"
                                    placeholder="Tus apellidos"
                                    {...formik.getFieldProps('apellidos')}
                                />
                                {formik.touched.apellidos && formik.errors.apellidos ? (
                                    <div className="form-error">{formik.errors.apellidos}</div>
                                ) : null}
                            </div>
                        </div>

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
                            <label className="form-label" htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
                            <input
                                id="fechaNacimiento"
                                name="fechaNacimiento"
                                type="date"
                                className="form-input"
                                {...formik.getFieldProps('fechaNacimiento')}
                            />
                            {formik.touched.fechaNacimiento && formik.errors.fechaNacimiento ? (
                                <div className="form-error">{formik.errors.fechaNacimiento}</div>
                            ) : null}
                        </div>

                        <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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

                            <div className="form-group">
                                <label className="form-label" htmlFor="confirmPassword">Confirmar Contraseña</label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    className="form-input"
                                    placeholder="Confirma tu contraseña"
                                    {...formik.getFieldProps('confirmPassword')}
                                />
                                {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                    <div className="form-error">{formik.errors.confirmPassword}</div>
                                ) : null}
                            </div>
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                            <button
                                type="submit"
                                className="btn btn-primary btn-full"
                                disabled={formik.isSubmitting}
                            >
                                {formik.isSubmitting ? 'Registrando...' : 'Registrarse'}
                            </button>
                        </div>
                    </form>

                    <div className="text-center mt-4">
                        ¿Ya tienes una cuenta? <Link to="/login" style={{ color: 'var(--color-primary)' }}>Iniciar Sesión</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;