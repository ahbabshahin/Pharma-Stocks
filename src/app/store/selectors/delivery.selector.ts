import { createFeatureSelector, createSelector } from '@ngrx/store';
import { deliveryAdapter, DeliveryState } from '../reducers/delivery.reducer';
import { deliveryStateName } from '../app.state';

export const getDeliveryState =
  createFeatureSelector<DeliveryState>(deliveryStateName);

export const getDeliveryLoader = createSelector(
  getDeliveryState,
  (state: DeliveryState) => state.loader
);

export const getDeliveryLoaded = createSelector(
  getDeliveryState,
  (state: DeliveryState) => state.loaded
);

export const getTotalDelivery = createSelector(
  getDeliveryState,
  (state: DeliveryState) => state.total
);

export const getDeliveryGrandTotal = createSelector(
  getDeliveryState,
  (state: DeliveryState) => state.grandTotal
);

export const getDeliveryError = createSelector(
  getDeliveryState,
  (state: DeliveryState) => state.error
);

export const getDeliveryList = createSelector(
  getDeliveryState,
  deliveryAdapter.getSelectors().selectAll
);
