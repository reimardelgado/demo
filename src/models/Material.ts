import { ApiResponse } from "./ApiResponse";

export class MaterialesResponse extends ApiResponse<Material>() { }

export interface Material {
  Id?: number;
  MaterialId?: number;
  LibroObraId?: number;
  Descripcion?: string;
  Unidad?: number;
  UniDescripcion?: string;
  Planificado?: number;
  Sobrante?: number;
  Detalle?: string;
  Km?: number;
}


export class MaterialListResponse extends ApiResponse<MaterialList>() { }
export interface MaterialList {
  Id?: number;
  Descripcion?: string;
}