import { Usuario } from "../../models/Usuario";
import { Perfil } from "../../models/Perfil";

export enum PerfilActionTypes {
  // REQUEST CONTROL ACTIONS
  FETCH_REQUEST = '@@perfil/FETCH_REQUEST',
  FETCH_SUCCESS = '@@perfil/FETCH_SUCCESS',
  FETCH_ERROR = '@@perfil/FETCH_ERROR',

  SELECT_PERFIL = '@@perfil/SELECT_PERFIL',
  SELECTED = '@@perfil/SELECTED'
}

export enum UsuarioActionTypes {
  // REQUEST CONTROL ACTIONS
  FETCH_REQUEST = '@@user/FETCH_REQUEST',
  FETCH_SUCCESS = '@@user/FETCH_SUCCESS',
  FETCH_ERROR = '@@user/FETCH_ERROR',

  SELECT_USER = '@@user/SELECT_USER',
  SELECTED = '@@user/SELECTED',
  LOGOUT = '@@user/LOGOUT'
}

export interface UsuarioState {
  readonly loading: boolean
  readonly user: Usuario
  readonly perfil: Perfil
  readonly errors?: string
}