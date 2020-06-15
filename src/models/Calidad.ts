import { ApiResponse } from "./ApiResponse";

export class CalidadResponse extends ApiResponse<Calidad>() { }

export interface Calidad {
  Id?: number;
  LibroDiarioId?: number;
  CorrectaOrganizacion?: boolean;
  PlanesObra?: boolean;
  CorrectaUbicacion?: boolean;
  ExistenCruces?: boolean;
  CorrectoEtiquetado?: boolean;
  PruebasContinuidad?: boolean;
  BuenaCalidad?: boolean;
  TransporteAdecuado?: boolean;
  BuenTratoDelCliente?: boolean;
  CorrectaSujecion?: boolean;
  EmpalmeFusion01?: boolean;
  EmpalmeFusion02?: boolean;
  ConectorMecanico?: boolean;
  CorrectoArmado?: boolean;
  UbicacionSeno?: boolean;
  LimpiezaAdecuada?: boolean;
  QuedoBienInstalado?: boolean;
  CorrectaInstalacion?: boolean;
  Recomendacion?: string;
}

