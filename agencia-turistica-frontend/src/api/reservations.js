import api from '../utils/api';

// Get user reservations
export const getUserReservationsService = async () => {
    const response = await api.get('/reservas/me');
    return response.data;
};

// Create reservation
export const createReservationService = async (reservationData) => {
    const response = await api.post('/reservas', reservationData);
    return response.data;
};

// Get reservation by ID
export const getReservationByIdService = async (id) => {
    const response = await api.get(`/reservas/${id}`);
    return response.data;
};

// Cancel reservation
export const cancelReservationService = async (id) => {
    const response = await api.put(`/reservas/${id}/cancelar`);
    return response.data;
};

// Get all reservations (admin/employee)
export const getAllReservationsService = async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.estado) params.append('estado', filters.estado);
    if (filters.fechaInicio) params.append('fechaInicio', filters.fechaInicio);
    if (filters.fechaFin) params.append('fechaFin', filters.fechaFin);

    const response = await api.get('/reservas', { params });
    return response.data;
};

// Update reservation status (admin/employee)
export const updateReservationStatusService = async (id, estado) => {
    const response = await api.put(`/reservas/${id}/estado`, { estado });
    return response.data;
};