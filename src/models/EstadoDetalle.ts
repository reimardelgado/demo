import { ApiResponse } from "./ApiResponse";

export class EstadoDetalleResponse extends ApiResponse<EstadoDetalle>() { };
export interface EstadoDetalle {
  Id?: number;
  Estado?: string;
}
