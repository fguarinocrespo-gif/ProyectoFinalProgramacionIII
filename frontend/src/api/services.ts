import api from './axios';
import type {
  LoginResponse,
  Titular,
  Vehiculo,
  TipoInfraccion,
  ActaInfraccion,
  Pago,
  Descargo,
  PaginatedResponse,
  DashboardResumen,
  DeudaTitular,
  DeudaVehiculo,
  Usuario,
} from '../types';

// ========== AUTH ==========
export const authService = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { email, password }),
  register: (data: { nombre: string; apellido: string; email: string; password: string; rol: string }) =>
    api.post('/auth/register', data),
  getMe: () => api.get<Usuario>('/auth/me'),
};

// ========== TITULARES ==========
export const titularesService = {
  listar: () => api.get<Titular[]>('/titulares'),
  obtener: (id: string) => api.get<Titular>(`/titulares/${id}`),
  crear: (data: Partial<Titular>) => api.post<Titular>('/titulares', data),
  actualizar: (id: string, data: Partial<Titular>) => api.put<Titular>(`/titulares/${id}`, data),
  eliminar: (id: string) => api.delete(`/titulares/${id}`),
  obtenerDeuda: (id: string) => api.get<DeudaTitular>(`/titulares/${id}/deuda`),
};

// ========== VEHÍCULOS ==========
export const vehiculosService = {
  listar: () => api.get<Vehiculo[]>('/vehiculos'),
  obtener: (id: string) => api.get<Vehiculo>(`/vehiculos/${id}`),
  crear: (data: Partial<Vehiculo>) => api.post<Vehiculo>('/vehiculos', data),
  actualizar: (id: string, data: Partial<Vehiculo>) => api.put<Vehiculo>(`/vehiculos/${id}`, data),
  eliminar: (id: string) => api.delete(`/vehiculos/${id}`),
  obtenerDeuda: (id: string) => api.get<DeudaVehiculo>(`/vehiculos/${id}/deuda`),
};

// ========== TIPOS DE INFRACCIÓN ==========
export const tiposInfraccionService = {
  listar: () => api.get<TipoInfraccion[]>('/tipos-infraccion'),
  crear: (data: Partial<TipoInfraccion>) => api.post<TipoInfraccion>('/tipos-infraccion', data),
  actualizar: (id: string, data: Partial<TipoInfraccion>) =>
    api.put<TipoInfraccion>(`/tipos-infraccion/${id}`, data),
};

// ========== ACTAS ==========
export const actasService = {
  listar: (params?: {
    page?: number;
    limit?: number;
    estado?: string;
    desde?: string;
    hasta?: string;
    patente?: string;
  }) => api.get<PaginatedResponse<ActaInfraccion>>('/actas', { params }),
  obtener: (id: string) => api.get<ActaInfraccion>(`/actas/${id}`),
  crear: (data: {
    vehiculoId: string;
    tipoInfraccionId: string;
    lugar: string;
    fechaHora?: string;
    observaciones?: string;
  }) => api.post<ActaInfraccion>('/actas', data),
  cambiarEstado: (id: string, estado: string) =>
    api.patch<ActaInfraccion>(`/actas/${id}/estado`, { estado }),
};

// ========== PAGOS ==========
export const pagosService = {
  registrar: (data: { actaId: string; monto: number; medioPago: string; comprobante?: string }) =>
    api.post<Pago>('/pagos', data),
  listar: (actaId?: string) => api.get<Pago[]>('/pagos', { params: actaId ? { actaId } : {} }),
};

// ========== DESCARGOS ==========
export const descargosService = {
  registrar: (data: { actaId: string; motivo: string; documentacionAdjunta?: string }) =>
    api.post<Descargo>('/descargos', data),
  listar: (actaId?: string) =>
    api.get<Descargo[]>('/descargos', { params: actaId ? { actaId } : {} }),
  cambiarEstado: (id: string, estado: string) =>
    api.patch<Descargo>(`/descargos/${id}/estado`, { estado }),
};

// ========== DASHBOARD ==========
export const dashboardService = {
  obtenerResumen: (desde?: string, hasta?: string) =>
    api.get<DashboardResumen>('/dashboard/resumen', { params: { desde, hasta } }),
};
