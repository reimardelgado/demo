import { Diario } from '../../models/Diario'

export enum DiariosActionTypes {
  // REQUEST CONTROL ACTIONS
  FETCH_REQUEST = '@@diarios/FETCH_REQUEST',
  FETCH_SUCCESS = '@@diarios/FETCH_SUCCESS',
  FETCH_ERROR = '@@diarios/FETCH_ERROR',

  SELECT_DIARIO = '@@diarios/SELECT_DIARIO',
  SELECTED = '@@diarios/SELECTED',
}

export interface DiariosState {
  readonly loading: boolean,
  readonly diarios: Diario[],
  readonly diarioActual: Diario
}