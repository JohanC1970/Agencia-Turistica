import api from '../utils/api';

// Login service
export const loginService = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

// Register service
export const registerService = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

// Verify account service
export const verifyAccountService = async (email, codigo) => {
    const response = await api.post('/auth/verify', { email, codigo });
    return response.data;
};

// Request password recovery service
export const requestPasswordRecoveryService = async (email) => {
    const response = await api.post('/auth/recover', { email });
    return response.data;
};

// Verify recovery code service
export const verifyRecoveryCodeService = async (email, codigo) => {
    const response = await api.post('/auth/verify-recovery-code', { email, codigo });
    return response.data;
};

// Reset password service
export const resetPasswordService = async (email, nuevaPassword) => {
    const response = await api.post('/auth/change-password', { email, nuevaPassword });
    return response.data;
};

// Resend verification code service
export const resendVerificationCodeService = async (email) => {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
};