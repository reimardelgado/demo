import { Reducer, AnyAction } from 'redux'
import { DiariosState, DiariosActionTypes } from './types'

export const initialState: DiariosState = {
  diarios: [],
  loading: false,
  diarioActual: {}
}

class DiariosReducer {
  static reduce: Reducer<DiariosState> = (state = initialState, action) => {
    if (DiariosReducer[action.type]) {
      return DiariosReducer[action.type](state, action);
    }
    return state;
  }

  static [DiariosActionTypes.FETCH_REQUEST](state: DiariosState, action: AnyAction) {
    return { ...state, loading: true };
  }

  static [DiariosActionTypes.FETCH_SUCCESS](state: DiariosState, action: AnyAction) {
    return { ...state, loading: false, diarios: action.payload };
  }

  static [DiariosActionTypes.FETCH_ERROR](state: DiariosState, action: AnyAction) {
    return { ...state, loading: false, diarios: [] };
  }

  static [DiariosActionTypes.SELECT_DIARIO](state: DiariosState, action: AnyAction) {
    return { ...state, loading: false, diarioActual: action.payload };
  }
}

export default DiariosReducer.reduce;