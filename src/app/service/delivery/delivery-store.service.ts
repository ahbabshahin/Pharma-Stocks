import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { DeliveryState } from '../../store/reducers/delivery.reducer';
import * as deliveryActions from '../../store/actions/delivery.action';

@Injectable({
  providedIn: 'root'
})
export class DeliveryStoreService {

  constructor(private store: Store<DeliveryState>) { }

  dispatch = (action: Action) => this.store.dispatch(action);
  select = (selector: any) => this.store.select(selector);

  loadDeliveryList(params: {[keys: string]: any}){
    this.dispatch(deliveryActions.loadDeliveryList({params}))
  }
}
