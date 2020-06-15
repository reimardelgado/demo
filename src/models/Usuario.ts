import { Perfil } from "./Perfil";
import { ApiSingleObjectResponse } from "./ApiResponse";

export class UsuarioResponse extends ApiSingleObjectResponse<Usuario>() {
}

export interface Usuario {
  Email?: string;
  UserPass?: string;
  Mensaje?: string;
  NombreCompleto?: string;
  UserId?: number;
  EstadoLogin?: boolean;
  Perfiles?: Perfil[];
  firmaCargada: boolean;
}
