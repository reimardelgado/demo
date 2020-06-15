import { ApiResponse } from "./ApiResponse";

export class ActividaResponse extends ApiResponse<Actividad>() { };

export interface Actividad {
  Id?: number;
  ActividadId?: number;
  LibroObraId?: number;
  Codigo?: string;
  Descripcion?: string;
  Unidad?: number;
  UniDescripcion?: string;
  Planificado?: number;
  Sobrante?: number;
  Detalle?: null;
  TipoActividadId?: number;
}


export class ActividadListResponse extends ApiResponse<ActividadList>() { }
export interface ActividadList {
  Id?: number;
  Codigo?: string;
  Descripcion?: string;
}

export class TipoActividadListResponse extends ApiResponse<TipoActividadList>() { }
export interface TipoActividadList {
  Id?: number;
  Descripcion?: string;
}