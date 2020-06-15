import Axios from "axios";
import momenttz from "moment-timezone";
import moment from "moment";
import getEnvVars from '../../environment'

import { UsuarioResponse } from "../models/Usuario";
import {
  MaterialesResponse,
  MaterialListResponse,
  Material
} from "../models/Material";
import {
  ActividaResponse,
  ActividadListResponse,
  Actividad
} from "../models/Actividad";
import {
  HerramientaResponse,
  HerramientaListResponse,
  Herramienta,
  HerramientaComentarioResponse
} from "../models/Herramienta";
import { CalidadResponse, Calidad } from "../models/Calidad";
import { DiarioResponse, MotivoRechazoResponse } from "../models/Diario";
import {
  PersonalResponse,
  PersonalListResponse,
  PersonalDetalleResponse,
  PersonaDetalle,
  PersonalNuevo
} from "../models/Personal";
import {
  RegistroResponse,
  TipoTrabajoListResponse,
  Registro
} from "../models/Registro";
import { ClimaResponse, Clima } from "../models/ClimaObras";
import { FuncionResponse } from "../models/FuncionDetalle";
import { FotosDiarioResponse, FotosDiarioData } from "../models/Foto";
import { UnidadResponse } from "../models/UnidadDetalle";
import { FirmaDetalle } from "../models/FirmaDetalle";
import { EstadoDetalleResponse } from "../models/EstadoDetalle";

const { apiUrl } = getEnvVars();

export const BASE_URL = apiUrl;
export const RESOURCE_URL = `${BASE_URL}Content/images/fotos/`;

const instance = Axios.create();
instance.defaults.baseURL = BASE_URL;
instance.defaults.timeout = 20000;

// Usuarios

export const getDiarios = (personalId: number, perfil: number) => {
  console.log(`GET: getDiarios ${personalId}, ${perfil}`);
  return instance.get<DiarioResponse>(
    `api/Diario/v1/GetDiarios?personalId=${personalId}&perfil=${perfil}`
  );
};

export const login = (username: string, password: string | number[]) => {
  console.log(`POST: login ${username}, ${password}`);
  return instance.post<UsuarioResponse>("api/Diario/v1/Login", {
    user: username,
    pass: password
  });
};

export const getUsuario = (userId: number) => {
  console.log(`POST: getUsuario ${userId}`);
  return instance.post<UsuarioResponse>(
    `api/Diario/v1/GetUsuario?userId=${userId}`
  );
};

export const recuperarContrasena = (username: string) => {
  console.log(`POST: recuperarContraseña ${username}`);
  return instance.post(`api/Diario/v1/RecuperarClave`, {
    user: username
  });
};

// END: Usuarios

// Diarios

export const getPersonalDeDiario = (diarioId: number) => {
  console.log(`GET: getPersonalDeDiario ${diarioId}`);
  return instance.get<PersonalResponse>(
    `api/Diario/v1/GetPersonal?diarioId=${diarioId}`
  );
};

export const getActividadesDeDiario = (diarioId: number) => {
  console.log(`GET: getActividadesDeDiario ${diarioId}`);
  return instance.get<ActividaResponse>(
    `api/Diario/v1/GetActividades?diarioId=${diarioId}`
  );
};

export const getActividadDetalle = (diarioId: number, actividadId: number) => {
  console.log(`GET: getActividadDetalle ${diarioId} - ${actividadId}`);
  return instance.get<ActividaResponse>(
    `api/Diario/v1/GetActividadDetalle?diarioId=${diarioId}&actividadId=${actividadId}`
  );
};

export const getHerramientasDeDiario = (diarioId: number) => {
  console.log(`GET: getHerramientasDeDiario ${diarioId}`);
  return instance.get<HerramientaResponse>(
    `api/Diario/v1/GetHerramientas?diarioId=${diarioId}`
  );
};

export const getHerramientaDetalle = (diarioId: number, herramientaId: number) => {
  console.log(`GET: getHerramientaDetalle ${diarioId} - ${herramientaId}`);
  return instance.get<HerramientaResponse>(
    `api/Diario/v1/GetHerramientaDetalle?diarioId=${diarioId}&herramientaId=${herramientaId}`
  );
};

export const getMaterialesDeDiario = (diarioId: number) => {
  console.log(`GET: getMaterialesDeDiario ${diarioId}`);
  return instance.get<MaterialesResponse>(
    `api/Diario/v1/GetEquipos?diarioId=${diarioId}`
  );
};

export const getMaterialDetalle = (diarioId: number, materialId: number) => {
  console.log(`GET: getMaterialDetalle ${diarioId} - ${materialId}`);
  return instance.get<MaterialesResponse>(
    `api/Diario/v1/getMaterialDetalle?diarioId=${diarioId}&materialId=${materialId}`
  );
};

export const getCalidadDeDiario = (diarioId: number) => {
  console.log(`GET: getCalidadDeDiario ${diarioId}`);
  return instance.get<CalidadResponse>(
    `api/Diario/v1/GetCalidadDetalle?diarioId=${diarioId}`
  );
};

export const getRegistroDeDiario = (diarioId: number) => {
  console.log(`GET: getRegistroDeDiario ${diarioId}`);
  return instance
    .get<RegistroResponse>(
      `api/Diario/v1/GetRegistroTrabajo?diarioId=${diarioId}`
    )
    .then(response => {
      const {
        data: { Data }
      } = response;
      // Se obtienen los datos de la base sin
      // la información del timezone. Entonces se fuerza
      // utilizar la hora Ecuatoriana
      const registro: Registro = {
        ...Data,
        HoraInicio: new Date(
          momenttz.tz(Data.HoraInicio, "America/Guayaquil").format()
        ),
        HoraFin: new Date(
          momenttz.tz(Data.HoraFin, "America/Guayaquil").format()
        ),
        HoraLlegada: new Date(
          momenttz.tz(Data.HoraLlegada, "America/Guayaquil").format()
        )
      };
      return registro;
    });
};

export const getClimaDeDiario = (diarioId: number) => {
  console.log(`GET: getClimaDeDiario ${diarioId}`);
  return instance.get<ClimaResponse>(
    `api/Diario/v1/GetClimaDetalle?diarioId=${diarioId}`
  );
};

export const getTipoTrabajoList = () => {
  console.log(`GET: getTipoTrabajoList`);
  return instance.get<TipoTrabajoListResponse>(
    `api/Diario/v1/GetTipoTrabajoList`
  );
};

export const getPersonalDetalleDiario = (
  diarioId: number,
  personalId: number
) => {
  console.log(`GET: getPersonalDetalleDiario ${diarioId} - ${personalId}`);
  return instance.get<PersonalDetalleResponse>(
    `api/Diario/v1/GetPersonalDetalle?diarioId=${diarioId}&personalId=${personalId}`
  );
};

export const getPersonalList = () => {
  console.log(`GET: getPersonalList`);
  return instance.get<PersonalListResponse>(`api/Diario/v1/getPersonalList`);
};

export const getFuncionList = () => {
  console.log(`GET: getFuncionList`);
  return instance.get<FuncionResponse>(`api/Diario/v1/GetFunciones`);
};

export const getFotosDiario = (diarioId: number) => {
  console.log(`GET: getFotosDiario: `, diarioId);
  return instance.get<FotosDiarioResponse>(
    `api/Diario/v1/GetFotos?diarioId=${diarioId}`
  );
};

export const getHerramientaList = () => {
  console.log(`GET: getHerramientaList`);
  return instance.get<HerramientaListResponse>(
    `api/Diario/v1/GetHerramientasList`
  );
};

export const saveFotosDiario = (data: FotosDiarioData) => {
  console.log(`GET: saveFotosDiario: `, data.LibroDiarioId);
  return instance.post<{ Error: number; Data: boolean; Msg: string }>(
    `api/Diario/v1/SaveFotos`,
    data
  );
};

export const eliminarFotosDiario = (diarioId: number, fotos: string[]) => {
  console.log(`GET: eliminarFotosDiario: `, diarioId, fotos);
  return instance.post(`api/Diario/v1/DeleteFotos`, {
    diarioId,
    fotos
  });
};

export const getUnidadesList = () => {
  console.log(`GET: getUnidadesList`);
  return instance.get<UnidadResponse>(`api/Diario/v1/GetUnidades`);
};

export const getMaterialList = () => {
  console.log(`GET: getMaterialList`);
  return instance.get<MaterialListResponse>(`api/Diario/v1/GetMaterialesList`);
};

export const getActividadList = (diarioId: number) => {
  console.log(`GET: getActividadList`);
  return instance.get<ActividadListResponse>(
    `api/Diario/v1/GetActividadesList?diarioId=${diarioId}`
  );
};

export const getTipoActividadList = () => {
  console.log(`GET: getTipoActividadList`);
  return instance.get<TipoTrabajoListResponse>(
    `api/Diario/v1/GetTipoActividadesList`
  );
};

//POST

export const saveDetallePersona = (data: PersonaDetalle) => {
  console.log(`GET: saveDetallePersona: `, data.PersonalId);
  const persona = {
    ...data,
    HoraInicio: moment(data.HoraInicio).format("YYYY-MM-DD HH:mm:ss"),
    HoraFin: moment(data.HoraFin).format("YYYY-MM-DD HH:mm:ss")
  };
  return instance.post<{ Error: number; Data: boolean; Msg: string }>(
    `api/Diario/v1/SaveDetallePersona`,
    persona
  );
};

export const saveNuevaPersona = (data: PersonalNuevo) => {
  console.log(`GET: saveNuevaPersona: `, data.LibroObraId);
  return instance.post<{ Error: number; Data: boolean; Msg: string }>(
    `api/Diario/v1/SaveNuevaPersona`,
    data
  );
};

export const saveClimaObra = (data: Clima) => {
  console.log(`GET: saveClimaObra: `, data.LibroDiarioId);
  return instance.post<{ Error: number; Data: boolean; Msg: string }>(
    `api/Diario/v1/SaveClimaObra`,
    data
  );
};

export const saveDetalleHerramienta = (data: Herramienta) => {
  console.log(`GET: saveDetalleHerramienta: `, data);
  return instance.post<{ Error: number; Data: boolean; Msg: string }>(
    `api/Diario/v1/SaveDetalleHerramienta`,
    data
  );
};

export const saveRegistroTrabajo = (data: Registro) => {
  // Se quita el timezone de las fechas porque
  // se almacenan en un tipo de dato sin timezone
  // en base de datos
  const registro = {
    ...data,
    HoraInicio: moment(data.HoraInicio).format("YYYY-MM-DD HH:mm:ss"),
    HoraFin: moment(data.HoraFin).format("YYYY-MM-DD HH:mm:ss"),
    HoraLlegada: moment(data.HoraLlegada).format("YYYY-MM-DD HH:mm:ss")
  };
  console.log(`GET: saveRegistroTrabajo: `, registro);
  return instance.post<{ Error: number; Data: boolean; Msg: string }>(
    `api/Diario/v1/SaveRegistroTrabajo`,
    registro
  );
};

export const saveActividad = (data: Actividad) => {
  console.log(`GET: saveActividad: `, data);
  return instance.post<{ Error: number; Data: boolean; Msg: string }>(
    `api/Diario/v1/SaveActividad`,
    data
  );
};

export const saveMaterial = (data: Material) => {
  console.log(`GET: saveMaterial: `, data);
  return instance.post<{ Error: number; Data: boolean; Msg: string }>(
    `api/Diario/v1/SaveMaterial`,
    data
  );
};

export const saveCalidad = (data: Calidad) => {
  console.log(`GET: saveCalidad: `, data.LibroDiarioId);
  return instance.post<{ Error: number; Data: boolean; Msg: string }>(
    `api/Diario/v1/SaveCalidad`,
    data
  );
};

export const saveDetalleFirma = (data: FirmaDetalle) => {
  console.log(`GET: saveDetalleFirma: `, data.LibroDiarioId);
  return instance.post<{ Error: number; Data: boolean; Msg: string }>(
    `api/Diario/v1/SaveDetalleFirma`,
    data
  );
};

export const changeEstadoDiario = (
  diarioId: number,
  estado: string,
  personalId: number
) => {
  console.log(`GET: changeEstadoDiario ${diarioId} - ${estado} - ${personalId}`);
  return instance.get<EstadoDetalleResponse>(
    `api/Diario/v1/ChangeEstadoDiario?diarioId=${diarioId}&estado=${estado}&personaId=${personalId}`
  );
};

export const saveComentario = (
  diarioId: number,
  comentario: string,
  tipo: number
) => {
  console.log(`GET: saveComentario`);
  return instance.get<HerramientaComentarioResponse>(
    `api/Diario/v1/SaveComentario?diarioId=${diarioId}&comentario=${comentario}&tipo=${tipo}`
  );
};

export const getMotivo = (diarioId: number) => {
  console.log(`GET: getMotivo`);
  return instance.get<MotivoRechazoResponse>(
    `api/Diario/v1/GetMotivoRechazo?id=${diarioId}`
  );
};

export const saveMotivo = (
  diarioId: number,
  motivo: string,
  perfil: number,
  personalId: number
) => {
  console.log(`GET: saveMotivo`, diarioId);
  console.log(`GET: saveMotivo`, motivo);
  console.log(`GET: saveMotivo`, perfil);
  console.log(`GET: saveMotivo`, personalId);
  return instance.get<MotivoRechazoResponse>(
    `api/Diario/v1/SaveMotivo?diarioId=${diarioId}&motivo=${motivo}&perfil=${perfil}&personaId=${personalId}`
  );
};

export const saveFirmas = (data: FirmaDetalle) => {
  console.log(`POST: saveFirmas`, data.LibroDiarioId);
  return instance.post("/api/Diario/v1/SaveFirma", data);
};
export const eliminarPersona = (id: number) => {
  console.log(`POST: eliminarPersona: `, id);
  return instance.post(`api/Diario/v1/DeletePersona?id=${id}`);
};

export const eliminarHerramienta = (id: number) => {
  console.log(`POST: eliminarHerramienta: `, id);
  return instance.post(`api/Diario/v1/DeleteHerramienta?id=${id}`);
};

export const eliminarMaterial = (id: number) => {
  console.log(`POST: eliminarMaterial: `, id);
  return instance.post(`api/Diario/v1/DeleteMaterial?id=${id}`);
};

export const eliminarActividad = (id: number) => {
  console.log(`POST: eliminarActividad: `, id);
  return instance.post(`api/Diario/v1/DeleteActividad?id=${id}`);
};

//END POST

// END: Diarios
