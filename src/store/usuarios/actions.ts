import { AsyncStorage } from "react-native";
import md5 from "md5";

import * as api from '../../api/apiService'

import { UsuarioActionTypes, PerfilActionTypes } from './types'
import { Usuario } from "../../models/Usuario";
import { Perfil } from "../../models/Perfil";

const loginSuccess = (user: Usuario) => ({
  type: UsuarioActionTypes.FETCH_SUCCESS,
  payload: user
});

const doSetUsuario = (user: Usuario) => ({
  type: UsuarioActionTypes.SELECT_USER,
  payload: user
});

export const login = (user: string, password: string) => async (dispatch: any) => {
  dispatch({ type: UsuarioActionTypes.FETCH_REQUEST });

  try {
    const response = await api.login(user, md5(password));
    const { Data } = response.data;
    Data.firmaCargada = true;

    dispatch(loginSuccess(Data));
    await AsyncStorage.setItem("userToken", "token");
    await AsyncStorage.setItem("usuario", JSON.stringify(Data));
    return true;
  } catch (e) {
    console.log(`Exception: ${e}`);
    dispatch({ type: UsuarioActionTypes.FETCH_ERROR });
    return false;
  }
};

export const logout = () => async (dispatch: any) => {
  await AsyncStorage.removeItem("userToken");
  await AsyncStorage.removeItem("usuario");
  await AsyncStorage.removeItem("perfil");
  dispatch({ type: UsuarioActionTypes.LOGOUT });
};

export const setPerfil = (perfil: Perfil, persist = false) => async (dispatch: any) => {
  if (persist) await AsyncStorage.setItem("perfil", JSON.stringify(perfil));

  dispatch({
    type: PerfilActionTypes.SELECT_PERFIL,
    payload: perfil
  });
};

export const getUsuario = (UserId: number) => async (dispatch: any) => {
  try {
    const response = await api.getUsuario(UserId);
    const { Data } = response.data;
    Data.firmaCargada = true;

    dispatch(doSetUsuario(Data));
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const setUsuario = (usuario: Usuario, persist = false) => async (dispatch: any) => {
  if (persist) await AsyncStorage.setItem("usuario", JSON.stringify(usuario));
  dispatch(doSetUsuario(usuario));
  return true;
};
