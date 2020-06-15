import { ApiResponse } from "./ApiResponse";

export class HerramientaResponse extends ApiResponse<Herramienta>() { }

export interface Herramienta {
  Id?: number;
  HerramientaId?: number;
  LibroObraId?: number;
  Descripcion?: string;
  Estado?: string;
  Cantidad?: number;
  Unidad?: number;
  UniDescripcion?: string;
}

export class HerramientaListResponse extends ApiResponse<HerramientaList>() { }
export interface HerramientaList {
  Id?: number;
  Descripcion?: string;
}

export class HerramientaComentarioResponse extends ApiResponse<ComentarioHerramienta>() { }
export interface ComentarioHerramienta {
  LibroObraId?: number;
  Comentario?: string;
}
