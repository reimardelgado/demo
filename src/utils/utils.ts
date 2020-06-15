import * as Permissions from "expo-permissions";

import { colors as nativeColors } from "react-native-elements";
import { documentDirectory } from 'expo-file-system';
import colors from '../styles/color'

export const PHOTOS_DIR = documentDirectory + 'photos';

interface RutaPerfil {
  ruta: string,
  prefix: string
}

export const RUTAS: Record<string, RutaPerfil> = {
  "Administrador": { ruta: "Administrador", prefix: "ADM" },
  "Líder Técnico": { ruta: "LiderTecnico", prefix: "LTC" },
  "Fiscalizador": { ruta: "Fiscalizador", prefix: "FCL" },
  "Jefe de Obra": { ruta: "JefeDeObra", prefix: "JDO" },
  "Soporte": { ruta: "Soporte", prefix: "SPT" },
  "Supervisor": { ruta: "Supervisor", prefix: "SUP" }
};

export const getRandomColor = (seed = null): string => {
  const choices = [
    nativeColors.primary,
    nativeColors.secondary,
    nativeColors.success,
    nativeColors.error,
    nativeColors.warning,
  ];

  const appColors = choices.concat(Object.values<string>(colors))

  const index = seed
    ? seed % appColors.length
    : Math.floor(Math.random() * appColors.length);
  return appColors[index];
};

export const getRouteFromProfileName = (perfilDescripcion: string): string => {
  return RUTAS[perfilDescripcion].ruta || "Auth";
};

// Promesas cancelables
// ver: https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
export interface Cancellable<T = any> {
  promise: Promise<T>,
  cancel(): void
}

export function makeCancellable<T = any>(promise: Promise<T>): Cancellable<T> {
  let _hasCanceled = false;

  const wrappedPromise = new Promise<T>((resolve, reject) => {
    promise.then(
      val => (_hasCanceled ? reject({ isCanceled: true }) : resolve(val)),
      error => (_hasCanceled ? reject({ isCanceled: true }) : reject(error))
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      _hasCanceled = true;
    }
  };
};

export async function requestPermissionAsync(...types: Permissions.PermissionType[]) {
  const { status } = await Permissions.askAsync(...types);
  return status === 'granted';
}

/**
 * Fast UUID generator, RFC4122 version 4 compliant.
 * @author Jeff Ward (jcward.com).
 * @license MIT license
 * @link http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
 **/
//https://stackoverflow.com/a/2117523/4047926
export const UUIDv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}