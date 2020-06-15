import { ApiResponse, ApiSingleObjectResponse } from "./ApiResponse";

export class PersonalResponse extends ApiResponse<Personal>() { }

export interface Personal {
  Id?: number;
  PersonaId?: number;
  LibroObraId?: number;
  NombreCompleto?: string;
  Identificacion?: string;
  Telefono?: string;
  CorreoElectronico?: string;
  CargoId?: number;
  CargoDescripcion?: string;
  Funcion?: string;
  HoraInicio?: Date;
  HoraFin?: Date;
}

export class PersonalDetalleResponse extends ApiSingleObjectResponse<PersonaDetalle>() { }

export interface PersonaDetalle {
  Id?: number;
  PersonalId?: number;
  LibroObraId?: number;
  Funcion?: number;
  Casco?: boolean;
  Guantes?: boolean;
  Botas?: boolean;
  Camiseta?: boolean;
  Gafas?: boolean;
  Chaleco?: boolean;
  Tarjeta?: boolean;
  HoraInicio?: Date;
  HoraFin?: Date;
  Observaciones?: string;

}

export class PersonalNuevoResponse extends ApiResponse<PersonalNuevo>() { }
export interface PersonalNuevo {
  Id?: number;
  PersonalId?:number;
  LibroObraId?: number;
  Funcion?:number;


}

export class PersonalListResponse extends ApiResponse<PersonalList>() { }
export interface PersonalList {
  Id?: number;
  Descripcion?: string;


}
