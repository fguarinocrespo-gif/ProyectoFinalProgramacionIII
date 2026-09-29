export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'inspector' | 'administrativo';
}

export interface LoginResponse {
  message: string;
  token: string;
  usuario: Usuario;
}

export interface Titular {
  _id: string;
  dni: string;
  nombre: string;
  apellido: string;
  domicilio: string;
  telefono: string;
  email: string;
  createdAt: string;
}

export interface Vehiculo {
  _id: string;
  patente: string;
  marca: string;
  modelo: string;
  anio: number;
  titularId: Titular | string;
  createdAt: string;
}

export interface TipoInfraccion {
  _id: string;
  codigo: string;
  descripcion: string;
  montoBase: number;
  activo: boolean;
  createdAt: string;
}

export type EstadoActa = 'pendiente' | 'notificada' | 'pagada' | 'en_descargo' | 'anulada';

export interface ActaInfraccion {
  _id: string;
  numeroActa: number;
  vehiculoId: Vehiculo | string;
  tipoInfraccionId: TipoInfraccion | string;
  inspectorId: Usuario | string;
  lugar: string;
  fechaHora: string;
  monto: number;
  estado: EstadoActa;
  observaciones: string;
  createdAt: string;
}

export interface Pago {
  _id: string;
  actaId: ActaInfraccion | string;
  registradoPorId: Usuario | string;
  monto: number;
  medioPago: 'contado' | 'tarjeta';
  fechaPago: string;
  comprobante: string;
  createdAt: string;
}

export interface Descargo {
  _id: string;
  actaId: ActaInfraccion | string;
  registradoPorId: Usuario | string;
  motivo: string;
  documentacionAdjunta: string;
  estado: 'presentado' | 'aceptado' | 'rechazado';
  fechaPresentacion: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DashboardResumen {
  actasPorEstado: Array<{
    _id: EstadoActa;
    cantidad: number;
    montoTotal: number;
  }>;
  totalActas: number;
  recaudacion: {
    totalRecaudado: number;
    cantidadPagos: number;
  };
  recaudacionPorMedio: Array<{
    _id: string;
    total: number;
    cantidad: number;
  }>;
}

export interface DeudaTitular {
  titular: Titular;
  cantidadVehiculos: number;
  cantidadActasPendientes: number;
  deudaTotal: number;
}

export interface DeudaVehiculo {
  vehiculo: Vehiculo;
  cantidadActasPendientes: number;
  deudaTotal: number;
}
