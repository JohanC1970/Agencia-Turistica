import api from '../utils/api';

// Get all packages
export const getAllPackagesService = async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.ciudad) params.append('ciudad', filters.ciudad);
    if (filters.precioMaximo) params.append('precioMaximo', filters.precioMaximo);
    if (filters.duracionMaxima) params.append('duracionMaxima', filters.duracionMaxima);
    if (filters.fecha) params.append('fecha', filters.fecha);

    const response = await api.get('/paquetes', { params });
    return response.data;
};

// Get package by ID
export const getPackageByIdService = async (id) => {
    const response = await api.get(`/paquetes/${id}`);
    return response.data;
};

// Create a new package (admin/employee)
export const createPackageService = async (packageData) => {
    const response = await api.post('/paquetes', packageData);
    return response.data;
};

// Update a package (admin/employee)
export const updatePackageService = async (id, packageData) => {
    const response = await api.put(`/paquetes/${id}`, packageData);
    return response.data;
};

// Delete a package (admin/employee)
export const deletePackageService = async (id) => {
    const response = await api.delete(`/paquetes/${id}`);
    return response.data;
};

// Add an activity to a package
export const addActivityToPackageService = async (packageId, activityId) => {
    const response = await api.post(`/paquetes/${packageId}/actividades/${activityId}`);
    return response.data;
};

// Remove an activity from a package
export const removeActivityFromPackageService = async (packageId, activityId) => {
    const response = await api.delete(`/paquetes/${packageId}/actividades/${activityId}`);
    return response.data;
};

// Add a lodging to a package
export const addLodgingToPackageService = async (packageId, lodgingId) => {
    const response = await api.post(`/paquetes/${packageId}/hospedajes/${lodgingId}`);
    return response.data;
};

// Remove a lodging from a package
export const removeLodgingFromPackageService = async (packageId, lodgingId) => {
    const response = await api.delete(`/paquetes/${packageId}/hospedajes/${lodgingId}`);
    return response.data;
};