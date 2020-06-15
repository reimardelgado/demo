// To parse this data:
//
//   import { Convert, PerfilesResponse } from "./file";
//
//   const perfilesResponse = Convert.toPerfilesResponse(json);

export interface PerfilesResponse {
  Error?: number;
  Data?: Perfil[];
  Msg?: string;
}

export interface Perfil {
  Id?: number;
  Descripcion?: string;
  prefix?: string
}

// Converts JSON strings to/from your types
export class Convert {
  public static toPerfilesResponse(json: string): PerfilesResponse {
    return JSON.parse(json);
  }

  public static perfilesResponseToJson(value: PerfilesResponse): string {
    return JSON.stringify(value);
  }
}
