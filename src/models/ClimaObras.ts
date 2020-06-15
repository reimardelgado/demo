import { ApiResponse } from './ApiResponse'

export class ClimaResponse extends ApiResponse<Clima>() { }

export interface Clima {
  Id?: number;
  LibroDiarioId?: number;
  Manana?: number;
  Tarde?: number;
  Noche?: number;

}
