import { combineReducers, applyMiddleware, createStore, Reducer } from 'redux'
import thunk from "redux-thunk";

import { UsuarioState, UsuarioActionTypes } from './usuarios/types';
import { DiariosState } from './diarios/types';

import UsuarioReducer from './usuarios/reducer';
import DiariosReducer from './diarios/reducer'

// The top-level state object
export interface ApplicationState {
  diarios: DiariosState,
  auth: UsuarioState
}

const appReducer = combineReducers({
  auth: UsuarioReducer,
  diarios: DiariosReducer
});

const rootReducer: Reducer<ApplicationState> = (state: ApplicationState, action) => {
  if (action.type === UsuarioActionTypes.LOGOUT) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default createStore(rootReducer, applyMiddleware(thunk));