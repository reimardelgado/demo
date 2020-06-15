import * as api from "../../api/apiService";

import { DiariosActionTypes } from './types'
import { Diario } from "../../models/Diario";

const diariosSuccess = (diarios: Diario[]) => ({
  type: DiariosActionTypes.FETCH_SUCCESS,
  payload: diarios
});

const diarioSelectSuccess = (diario: Diario) => ({
  type: DiariosActionTypes.SELECT_DIARIO,
  payload: diario
});

export const getDiarios = (personalId: number, perfilId: number) => async (dispatch: any) => {
  dispatch({ type: DiariosActionTypes.FETCH_REQUEST });

  try {
    const {
      data: { Data }
    } = await api.getDiarios(personalId, perfilId);

    dispatch(diariosSuccess(Data));
  } catch (e) {
    console.log(e);
    dispatch({ type: DiariosActionTypes.FETCH_ERROR });
  }
};

export const selectDiario = (diario: Diario) => (dispatch: any) => {
  dispatch(diarioSelectSuccess(diario));
};
