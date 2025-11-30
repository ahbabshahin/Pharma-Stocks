import { createFeatureSelector, createSelector } from '@ngrx/store';
import { areaCodeAdapter, AreaCodeState } from '../reducers/area-code.reducer';
import { areaCodeStateName } from '../app.state';

export const getAreaCodeState =
  createFeatureSelector<AreaCodeState>(areaCodeStateName);

export const getAreaCodeLoader = createSelector(
  getAreaCodeState,
  (state: AreaCodeState) => state.loader
);

export const getAreaCodeAddLoader = createSelector(
  getAreaCodeState,
  (state: AreaCodeState) => state.addLoader
);

export const getAreaCodeUpdateLoader = createSelector(
  getAreaCodeState,
  (state: AreaCodeState) => state.updateLoader
);

export const getAreaCodeDeleteLoader = createSelector(
  getAreaCodeState,
  (state: AreaCodeState) => state.deleteLoader
);

export const getAreaCodeSubLoader = createSelector(
  getAreaCodeState,
  (state: AreaCodeState) => state.subLoader
);

export const getAreaCodeLoaded = createSelector(
  getAreaCodeState,
  (state: AreaCodeState) => state.loaded
);

export const getTotalAreaCode = createSelector(
  getAreaCodeState,
  (state: AreaCodeState) => state.total
);

export const getAreaCodeError = createSelector(
  getAreaCodeState,
  (state: AreaCodeState) => state.error
);

export const getAreaCode = (id: string) =>
  createSelector(
    getAreaCodeState,
    (state: AreaCodeState) => state.entities?.[id]
  );

export const getAllAreaCodes = createSelector(
  getAreaCodeState,
  areaCodeAdapter.getSelectors().selectAll
);
