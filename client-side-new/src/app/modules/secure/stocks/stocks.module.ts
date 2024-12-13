import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StocksRoutingModule } from './stocks-routing.module';
import { StoreModule } from '@ngrx/store';
// import { stockReducer } from '../../store/reducers/stock.reducer';
import * as stockComponents from './index'

@NgModule({
  declarations: [...stockComponents.components],
  imports: [
    CommonModule,
    StocksRoutingModule,
    // StoreModule.forFeature('stock', stockReducer)
  ]
})
export class StocksModule { }
