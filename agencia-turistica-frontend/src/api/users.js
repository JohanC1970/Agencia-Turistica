import api from '../utils/api';

// Get current user profile
export const getCurrentUserProfileService = async () => {
    const response = await api.get('/clientes/me');
    return response.data;
};

// Update current user profile
export const updateUserProfileService = async (userData) => {
    const response = await api.put('/clientes/me', userData);
    return response.data;
};

// Change password
export const changePasswordService = async (passwordData) => {
    const response = await api.post('/auth/change-password', passwordData);
    return response.data;
};