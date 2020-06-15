import { ApiResponse } from "./ApiResponse";

export class FuncionResponse extends ApiResponse<FuncionDetalle>() { }

export default class FuncionDetalle {
  Id?: number;
  Descripcion?: string;
}
