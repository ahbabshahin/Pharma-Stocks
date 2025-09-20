import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FilterState } from '../../store/reducers/filter.reducer';
import { filterStateName } from '../app.state';

export const selectFilterState = createFeatureSelector<FilterState>(filterStateName);

export const getFilterStatus = createSelector(
  selectFilterState,
  (state) => state.status
);

export const getFilterDate = createSelector(
  selectFilterState,
  (state) => state.date
);

export const getFilterPeriod = createSelector(
  selectFilterState,
  (state) => state.period
);
