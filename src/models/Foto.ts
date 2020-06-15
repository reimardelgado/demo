import { ApiResponse } from "./ApiResponse";

export class FotosDiarioResponse extends ApiResponse<FotosDiarioData>() { }

export interface FotosDiarioData {
  Id?: number;
  LibroDiarioId?: number;
  Nombre?: string[];
  Foto?: string[];
  Longitud?: number;
  Latitud?: number;
  Fecha?: Date;
}