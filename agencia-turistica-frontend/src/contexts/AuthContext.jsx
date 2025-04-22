import { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';
import {
    loginService,
    registerService,
    verifyAccountService,
    requestPasswordRecoveryService,
    verifyRecoveryCodeService,
    resetPasswordService
} from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    // Load user from token if exists
    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    // Decode token to get user info
                    const decodedToken = jwtDecode(token);

                    // Check if token is expired
                    const currentTime = Date.now() / 1000;
                    if (decodedToken.exp < currentTime) {
                        logout();
                        return;
                    }

                    setUser({
                        id: decodedToken.sub,
                        email: decodedToken.email,
                        role: decodedToken.rol,
                        name: decodedToken.nombre || ''
                    });
                } catch (error) {
                    console.error('Error decoding token:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        loadUser();
    }, [token]);

    // Login function
    const login = async (credentials) => {
        try {
            setLoading(true);
            const response = await loginService(credentials);
            const { token, nombreUsuario } = response;

            localStorage.setItem('token', token);
            setToken(token);

            // Decode token to get user info
            const decodedToken = jwtDecode(token);
            setUser({
                id: decodedToken.sub,
                email: credentials.email,
                role: decodedToken.rol,
                name: nombreUsuario || ''
            });

            toast.success('Inicio de sesión exitoso');
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data || 'Error al iniciar sesión');
            return { success: false, error: error.response?.data || 'Error al iniciar sesión' };
        } finally {
            setLoading(false);
        }
    };

    // Register function
    const register = async (userData) => {
        try {
            setLoading(true);
            await registerService(userData);
            toast.success('Registro exitoso! Por favor verifica tu correo electrónico');
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data || 'Error al registrarse');
            return { success: false, error: error.response?.data || 'Error al registrarse' };
        } finally {
            setLoading(false);
        }
    };

    // Verify account function
    const verifyAccount = async (email, code) => {
        try {
            setLoading(true);
            await verifyAccountService(email, code);
            toast.success('Cuenta verificada exitosamente');
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data || 'Error al verificar la cuenta');
            return { success: false, error: error.response?.data || 'Error al verificar la cuenta' };
        } finally {
            setLoading(false);
        }
    };

    // Request password recovery function
    const requestPasswordRecovery = async (email) => {
        try {
            setLoading(true);
            await requestPasswordRecoveryService(email);
            toast.success('Se ha enviado un código de recuperación a tu correo');
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data || 'Error al solicitar la recuperación de contraseña');
            return { success: false, error: error.response?.data || 'Error al solicitar la recuperación de contraseña' };
        } finally {
            setLoading(false);
        }
    };

    // Verify recovery code function
    const verifyRecoveryCode = async (email, code) => {
        try {
            setLoading(true);
            await verifyRecoveryCodeService(email, code);
            toast.success('Código verificado exitosamente');
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data || 'Error al verificar el código');
            return { success: false, error: error.response?.data || 'Error al verificar el código' };
        } finally {
            setLoading(false);
        }
    };

    // Reset password function
    const resetPassword = async (email, newPassword) => {
        try {
            setLoading(true);
            await resetPasswordService(email, newPassword);
            toast.success('Contraseña actualizada exitosamente');
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data || 'Error al actualizar la contraseña');
            return { success: false, error: error.response?.data || 'Error al actualizar la contraseña' };
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        toast.success('Sesión cerrada exitosamente');
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                verifyAccount,
                requestPasswordRecovery,
                verifyRecoveryCode,
                resetPassword,
                isAuthenticated: !!user,
                isAdmin: user?.role === 'ADMIN',
                isEmployee: user?.role === 'EMPLEADO'
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};