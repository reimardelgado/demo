import { ApiResponse } from './ApiResponse'

export class UnidadResponse extends ApiResponse<UnidadDetalle>() { }

export interface UnidadDetalle {
  Id?: number;
  Descripcion?: string;
}
