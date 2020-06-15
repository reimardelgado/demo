import { Reducer, AnyAction } from 'redux'
import { UsuarioState, UsuarioActionTypes, PerfilActionTypes } from './types'

export const initialState: UsuarioState = {
  loading: false,
  user: null,
  perfil: null,
  errors: null
}

class UsuarioReducer {
  static reduce: Reducer<UsuarioState> = (state = initialState, action) => {
    if (UsuarioReducer[action.type]) {
      return UsuarioReducer[action.type](state, action);
    }
    return state;
  }

  // Usuario
  static [UsuarioActionTypes.FETCH_REQUEST](state: UsuarioState, action: AnyAction) {
    return { ...state, loading: true };
  }

  static [UsuarioActionTypes.FETCH_SUCCESS](state: UsuarioState, action: AnyAction) {
    return { ...state, loading: false, user: action.payload };
  }

  static [UsuarioActionTypes.FETCH_ERROR](state: UsuarioState, action: AnyAction) {
    return { ...state, loading: false, user: null };
  }

  static [UsuarioActionTypes.SELECT_USER](state: UsuarioState, action: AnyAction) {
    return { ...state, loading: false, user: action.payload };
  }

  // Perfil
  static [PerfilActionTypes.FETCH_REQUEST](state: UsuarioState, action: AnyAction) {
    return { ...state, loading: true };
  }

  static [PerfilActionTypes.FETCH_SUCCESS](state: UsuarioState, action: AnyAction) {
    return { ...state, loading: false, perfil: action.payload };
  }

  static [PerfilActionTypes.FETCH_ERROR](state: UsuarioState, action: AnyAction) {
    return { ...state, loading: false, perfil: null };
  }

  static [PerfilActionTypes.SELECT_PERFIL](state: UsuarioState, action: AnyAction) {
    return { ...state, loading: false, perfil: action.payload };
  }
}

export default UsuarioReducer.reduce;