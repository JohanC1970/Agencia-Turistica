import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

// Aquí importaríamos los servicios necesarios para gestionar empleados

const EmployeesPage = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Aquí haríamos un fetch a la API para obtener la lista de empleados
        // Por ahora, simularemos la carga con datos de ejemplo

        setTimeout(() => {
            const mockEmployees = [
                { id: '2001', nombre: 'María López', apellidos: 'García', email: 'maria@example.com', telefono: '3001234567', fechaContratacion: '2022-10-15' },
                { id: '2002', nombre: 'Pedro Sánchez', apellidos: 'Martínez', email: 'pedro@example.com', telefono: '3009876543', fechaContratacion: '2023-01-20' },
                { id: '2003', nombre: 'Luisa Rodríguez', apellidos: 'Pérez', email: 'luisa@example.com', telefono: '3005551234', fechaContratacion: '2022-08-05' },
                { id: '2004', nombre: 'José Fernández', apellidos: 'Gómez', email: 'jose@example.com', telefono: '3004567890', fechaContratacion: '2023-03-10' },
                { id: '2005', nombre: 'Daniela Torres', apellidos: 'Ruiz', email: 'daniela@example.com', telefono: '3007894561', fechaContratacion: '2022-12-01' },
            ];

            setEmployees(mockEmployees);
            setLoading(false);
        }, 1000);
    }, []);

    const formik = useFormik({
        initialValues: {
            id: '',
            nombre: '',
            apellidos: '',
            email: '',
            telefono: '',
            password: '',
            confirmPassword: '',
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
            telefono: Yup.string()
                .required('El teléfono es requerido'),
            password: Yup.string()
                .min(6, 'La contraseña debe tener al menos 6 caracteres')
                .required('La contraseña es requerida'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
                .required('Confirma la contraseña')
        }),
        onSubmit: (values, { resetForm }) => {
            // Aquí implementaríamos la lógica para registrar un nuevo empleado
            // Por ahora, actualizaremos el estado local

            // Simulando una respuesta exitosa
            setTimeout(() => {
                const newEmployee = {
                    id: values.id,
                    nombre: values.nombre,
                    apellidos: values.apellidos,
                    email: values.email,
                    telefono: values.telefono,
                    fechaContratacion: new Date().toISOString().split('T')[0]
                };

                setEmployees(prev => [...prev, newEmployee]);
                toast.success('Empleado registrado exitosamente');
                setShowForm(false);
                resetForm();
            }, 1000);
        },
    });

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1>Gestión de Empleados</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancelar' : 'Registrar Empleado'}
                </button>
            </div>

            {/* Registration Form */}
            {showForm && (
                <div className="card mb-4">
                    <div className="card-body">
                        <h2 className="mb-3">Registrar Nuevo Empleado</h2>

                        <form onSubmit={formik.handleSubmit}>
                            <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="id">Identificación</label>
                                    <input
                                        id="id"
                                        name="id"
                                        type="text"
                                        className="form-input"
                                        {...formik.getFieldProps('id')}
                                    />
                                    {formik.touched.id && formik.errors.id ? (
                                        <div className="form-error">{formik.errors.id}</div>
                                    ) : null}
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="nombre">Nombre</label>
                                    <input
                                        id="nombre"
                                        name="nombre"
                                        type="text"
                                        className="form-input"
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
                                        {...formik.getFieldProps('apellidos')}
                                    />
                                    {formik.touched.apellidos && formik.errors.apellidos ? (
                                        <div className="form-error">{formik.errors.apellidos}</div>
                                    ) : null}
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="email">Email</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        className="form-input"
                                        {...formik.getFieldProps('email')}
                                    />
                                    {formik.touched.email && formik.errors.email ? (
                                        <div className="form-error">{formik.errors.email}</div>
                                    ) : null}
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="telefono">Teléfono</label>
                                    <input
                                        id="telefono"
                                        name="telefono"
                                        type="tel"
                                        className="form-input"
                                        {...formik.getFieldProps('telefono')}
                                    />
                                    {formik.touched.telefono && formik.errors.telefono ? (
                                        <div className="form-error">{formik.errors.telefono}</div>
                                    ) : null}
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="password">Contraseña</label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        className="form-input"
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
                                    className="btn btn-primary"
                                    disabled={formik.isSubmitting}
                                >
                                    {formik.isSubmitting ? 'Registrando...' : 'Registrar Empleado'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Employees List */}
            {loading ? (
                <div className="text-center">
                    <p>Cargando empleados...</p>
                </div>
            ) : employees.length === 0 ? (
                <div className="card">
                    <div className="card-body text-center">
                        <h3>No se encontraron empleados</h3>
                        <p>Registra un nuevo empleado para comenzar.</p>
                    </div>
                </div>
            ) : (
                <div className="card">
                    <div className="card-body">
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                <tr>
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--color-gray-300)' }}>ID</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--color-gray-300)' }}>Nombre</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--color-gray-300)' }}>Apellidos</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--color-gray-300)' }}>Email</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--color-gray-300)' }}>Teléfono</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--color-gray-300)' }}>Fecha Contratación</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--color-gray-300)' }}>Acciones</th>
                                </tr>
                                </thead>
                                <tbody>
                                {employees.map(employee => (
                                    <tr key={employee.id}>
                                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-gray-200)' }}>{employee.id}</td>
                                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-gray-200)' }}>{employee.nombre}</td>
                                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-gray-200)' }}>{employee.apellidos}</td>
                                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-gray-200)' }}>{employee.email}</td>
                                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-gray-200)' }}>{employee.telefono}</td>
                                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-gray-200)' }}>{new Date(employee.fechaContratacion).toLocaleDateString()}</td>
                                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-gray-200)' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <Link
                                                    to={`/admin/employees/${employee.id}`}
                                                    className="btn btn-outline"
                                                    style={{
                                                        padding: '0.25rem 0.5rem',
                                                        fontSize: '0.875rem'
                                                    }}
                                                >
                                                    Editar
                                                </Link>

                                                <button
                                                    className="btn btn-outline"
                                                    style={{
                                                        padding: '0.25rem 0.5rem',
                                                        fontSize: '0.875rem',
                                                        color: 'var(--color-error)',
                                                        borderColor: 'var(--color-error)'
                                                    }}
                                                    onClick={() => {
                                                        if (confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
                                                            // Implementar lógica para eliminar empleado
                                                            setEmployees(prev => prev.filter(emp => emp.id !== employee.id));
                                                            toast.success('Empleado eliminado exitosamente');
                                                        }
                                                    }}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeesPage;