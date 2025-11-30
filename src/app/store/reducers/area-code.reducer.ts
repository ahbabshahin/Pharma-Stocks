import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { AreaCode } from '../models/area-code.model';
import { createReducer, on } from '@ngrx/store';
import * as areaCodeActions from '../actions/area-code.action';
export interface AreaCodeState extends EntityState<AreaCode> {
  loader: boolean;
  loaded: boolean;
  subLoader: boolean;
  addLoader: boolean;
  updateLoader: boolean;
  deleteLoader: boolean;
  total: number;
  error: string;
}

const defaultAreaCodeState: AreaCodeState = {
  ids: [],
  entities: {},
  loader: false,
  loaded: false,
  subLoader: false,
  addLoader: false,
  updateLoader: false,
  deleteLoader: false,
  total: 0,
  error: '',
};

export const areaCodeAdapter: EntityAdapter<AreaCode> =
  createEntityAdapter<AreaCode>({
	selectId: (areaCode: AreaCode) => areaCode._id as string,
  });

export const initialState: AreaCodeState =
  areaCodeAdapter.getInitialState(defaultAreaCodeState);

const { selectAll } = areaCodeAdapter.getSelectors();

export const areaCodeReducer = createReducer(
  initialState,
  on(areaCodeActions.loadAreaCodes, (state) => ({
    ...state,
    loader: true,
  })),
  on(areaCodeActions.loadAreaCodesSuccess, (state, { res }) => {
    return areaCodeAdapter.setAll(res, {
      ...state,
      loader: false,
      loaded: true,
      total: res?.length,
    });
  }),
  on(areaCodeActions.loadAreaCodesFail, (state, action) => ({
    ...state,
    error: action.error,
    loader: false,
    loaded: false,
  })),
  on(areaCodeActions.addAreaCode, (state, action) => ({
    ...state,
    addLoader: true,
  })),
  on(areaCodeActions.addAreaCodeSuccess, (state, action) => {
    return areaCodeAdapter.addOne(action.res, state);
  }),
  on(areaCodeActions.addAreaCodeFail, (state, action) => ({
    ...state,
    error: action.error,
    addLoader: false,
  })),
  on(areaCodeActions.updateAreaCode, (state, action) => ({
    ...state,
    updateLoader: true,
  })),
  on(areaCodeActions.updateAreaCodeSuccess, (state, action) => {
    return areaCodeAdapter.updateOne(action.res, state);
  }),
  on(areaCodeActions.updateAreaCodeFail, (state, action) => ({
    ...state,
    error: action.error,
    updateLoader: false,
  })),
  on(areaCodeActions.deleteAreaCode, (state, action) => ({
    ...state,
    deleteLoader: true,
  })),
  on(areaCodeActions.deleteAreaCodeSuccess, (state, action) => {
    return areaCodeAdapter.removeOne(action.id, state);
  }),
  on(areaCodeActions.deleteAreaCodeFail, (state, action) => ({
    ...state,
    error: action.error,
    deleteLoader: false,
  }))
);
