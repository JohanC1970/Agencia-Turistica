import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getCurrentUserProfileService, updateUserProfileService, changePasswordService } from '../api/users';
import toast from 'react-hot-toast';

const ProfilePage = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const { user } = useAuth();

    const profileFormik = useFormik({
        initialValues: {
            nombre: '',
            apellidos: '',
            email: '',
            telefono: '',
            fechaNacimiento: '',
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                .required('El nombre es requerido'),
            apellidos: Yup.string()
                .required('Los apellidos son requeridos'),
            email: Yup.string()
                .email('Email inválido')
                .required('El email es requerido'),
            telefono: Yup.string()
                .required('El teléfono es requerido'),
            fechaNacimiento: Yup.date()
                .required('La fecha de nacimiento es requerida')
        }),
        onSubmit: async (values) => {
            setError('');

            try {
                await updateUserProfileService(values);
                toast.success('Perfil actualizado exitosamente');
            } catch (err) {
                setError('Ocurrió un error al actualizar el perfil');
                console.error(err);
            }
        },
    });

    const passwordFormik = useFormik({
        initialValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            currentPassword: Yup.string()
                .required('La contraseña actual es requerida'),
            newPassword: Yup.string()
                .min(6, 'La contraseña debe tener al menos 6 caracteres')
                .required('La nueva contraseña es requerida'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('newPassword'), null], 'Las contraseñas deben coincidir')
                .required('Confirma tu nueva contraseña')
        }),
        onSubmit: async (values) => {
            setError('');

            try {
                await changePasswordService({
                    email: profileFormik.values.email,
                    currentPassword: values.currentPassword,
                    newPassword: values.newPassword
                });

                toast.success('Contraseña actualizada exitosamente');
                setShowPasswordForm(false);
                passwordFormik.resetForm();
            } catch (err) {
                setError('Ocurrió un error al actualizar la contraseña');
                console.error(err);
            }
        },
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const userData = await getCurrentUserProfileService();

                profileFormik.setValues({
                    nombre: userData.nombre || '',
                    apellidos: userData.apellidos || '',
                    email: userData.email || user.email || '',
                    telefono: userData.telefono || '',
                    fechaNacimiento: userData.fechaNacimiento ? new Date(userData.fechaNacimiento).toISOString().split('T')[0] : '',
                });
            } catch (error) {
                console.error('Error fetching user profile:', error);
                toast.error('Error al cargar los datos del perfil');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [user]);

    if (loading) {
        return (
            <div className="container" style={{ maxWidth: '800px', padding: '2rem 1rem' }}>
                <div className="card">
                    <div className="card-body text-center">
                        <p>Cargando perfil...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ maxWidth: '800px', padding: '2rem 1rem' }}>
            <div className="card">
                <div className="card-body">
                    <h2 className="text-center mb-4">Mi Perfil</h2>

                    {error && (
                        <div className="alert alert-error">{error}</div>
                    )}

                    <form onSubmit={profileFormik.handleSubmit}>
                        <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="nombre">Nombre</label>
                                <input
                                    id="nombre"
                                    name="nombre"
                                    type="text"
                                    className="form-input"
                                    {...profileFormik.getFieldProps('nombre')}
                                />
                                {profileFormik.touched.nombre && profileFormik.errors.nombre ? (
                                    <div className="form-error">{profileFormik.errors.nombre}</div>
                                ) : null}
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="apellidos">Apellidos</label>
                                <input
                                    id="apellidos"
                                    name="apellidos"
                                    type="text"
                                    className="form-input"
                                    {...profileFormik.getFieldProps('apellidos')}
                                />
                                {profileFormik.touched.apellidos && profileFormik.errors.apellidos ? (
                                    <div className="form-error">{profileFormik.errors.apellidos}</div>
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
                                {...profileFormik.getFieldProps('email')}
                                disabled
                            />
                            {profileFormik.touched.email && profileFormik.errors.email ? (
                                <div className="form-error">{profileFormik.errors.email}</div>
                            ) : null}
                        </div>

                        <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="telefono">Teléfono</label>
                                <input
                                    id="telefono"
                                    name="telefono"
                                    type="tel"
                                    className="form-input"
                                    {...profileFormik.getFieldProps('telefono')}
                                />
                                {profileFormik.touched.telefono && profileFormik.errors.telefono ? (
                                    <div className="form-error">{profileFormik.errors.telefono}</div>
                                ) : null}
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
                                <input
                                    id="fechaNacimiento"
                                    name="fechaNacimiento"
                                    type="date"
                                    className="form-input"
                                    {...profileFormik.getFieldProps('fechaNacimiento')}
                                />
                                {profileFormik.touched.fechaNacimiento && profileFormik.errors.fechaNacimiento ? (
                                    <div className="form-error">{profileFormik.errors.fechaNacimiento}</div>
                                ) : null}
                            </div>
                        </div>

                        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={profileFormik.isSubmitting}
                            >
                                {profileFormik.isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                            </button>

                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => setShowPasswordForm(!showPasswordForm)}
                            >
                                {showPasswordForm ? 'Cancelar' : 'Cambiar Contraseña'}
                            </button>
                        </div>
                    </form>

                    {showPasswordForm && (
                        <div className="mt-4">
                            <h3 className="mb-3">Cambiar Contraseña</h3>

                            <form onSubmit={passwordFormik.handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="currentPassword">Contraseña Actual</label>
                                    <input
                                        id="currentPassword"
                                        name="currentPassword"
                                        type="password"
                                        className="form-input"
                                        {...passwordFormik.getFieldProps('currentPassword')}
                                    />
                                    {passwordFormik.touched.currentPassword && passwordFormik.errors.currentPassword ? (
                                        <div className="form-error">{passwordFormik.errors.currentPassword}</div>
                                    ) : null}
                                </div>

                                <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="newPassword">Nueva Contraseña</label>
                                        <input
                                            id="newPassword"
                                            name="newPassword"
                                            type="password"
                                            className="form-input"
                                            {...passwordFormik.getFieldProps('newPassword')}
                                        />
                                        {passwordFormik.touched.newPassword && passwordFormik.errors.newPassword ? (
                                            <div className="form-error">{passwordFormik.errors.newPassword}</div>
                                        ) : null}
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="confirmPassword">Confirmar Contraseña</label>
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            className="form-input"
                                            {...passwordFormik.getFieldProps('confirmPassword')}
                                        />
                                        {passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword ? (
                                            <div className="form-error">{passwordFormik.errors.confirmPassword}</div>
                                        ) : null}
                                    </div>
                                </div>

                                <div style={{ marginTop: '1.5rem' }}>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={passwordFormik.isSubmitting}
                                    >
                                        {passwordFormik.isSubmitting ? 'Cambiando contraseña...' : 'Actualizar Contraseña'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;