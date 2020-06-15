import { ApiResponse } from "./ApiResponse";

export class DiarioResponse extends ApiResponse<Diario>() { }

export interface Diario {
  Id?: number;
  Codigo?: string;
  Fecharegistro?: Date;
  HoraInicio?: Date;
  HoraFin?: Date;
  ClienteId?: number;
  ClienteName?: string;
  ProyectoId?: number;
  ProyectoName?: string;
  Ciudad?: string;
  Edificio?: string;
  OrdenCompraId?: number;
  OrdenCompra?: string;
  PersonalId?: number;
  EstadoDiarioId?: number;
  EstadoDiarioName?: string;
  Descripcion?: string;
  Detalle?: string;
  TipoTrabajo?: string;
  Aprobador?: any;
}

export class MotivoRechazoResponse extends ApiResponse<MotivoRechazo>() { }
export interface MotivoRechazo {
  LibroObraId?: number;
  Motivo?: string;
}