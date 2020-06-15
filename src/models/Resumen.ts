import { ApiResponse } from './ApiResponse'

export class ResumenResponse extends ApiResponse<Resumen>() { }

export interface Resumen {
  url?: string;
}
