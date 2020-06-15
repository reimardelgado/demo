import { ApiResponse, ApiSingleObjectResponse } from './ApiResponse'

export class RegistroResponse extends ApiSingleObjectResponse<Registro>() { }

export interface Registro {
  Id?: number;
  LibroObraId?: number;
  TipoTrabajo?: number;
  HoraLlegada?: Date;
  HoraInicio?: Date;
  HoraFin?: Date;
  TiempoMuerto?: number;
  PorQue?: string;
  Observaciones?: string;
  CodigoDiario?: string;
  NombreCliente?: string;
  NombreProyecto?: string;
  NombreOrden?: string;
  Ciudad?: string;
  Lugar?: string;
}

export class TipoTrabajoListResponse extends ApiResponse<TipoTrabajoList>() { }

export interface TipoTrabajoList {
  Id?: number;
  Descripcion?: string;
}
