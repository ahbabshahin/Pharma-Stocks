import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StocksRoutingModule } from './stocks-routing.module';
import { StoreModule } from '@ngrx/store';
// import { stockReducer } from '../../store/reducers/stock.reducer';
import * as stockComponents from './index'
import { SharedModule } from '../../../shared/shared.module';
import { StockApiService } from '../../../service/stocks/stock-api.service';
import { StockStoreService } from '../../../service/stocks/stock-store.service';
import { stockStateName } from '../../../store/app.state';
import { stockReducer } from '../../../store/reducers/stocks.reducer';
import { EffectsModule } from '@ngrx/effects';
import { StockEffects } from '../../../store/effects/stocks.effect';
import { LoaderComponent } from "../../../common-component/loader/loader.component";
import { CommonComponentModule } from '../../../common-component/common-component.module';

@NgModule({
  declarations: [...stockComponents.components],
  imports: [
    CommonModule,
    StocksRoutingModule,
    SharedModule,
    StoreModule.forFeature(stockStateName, stockReducer),
    EffectsModule.forFeature(StockEffects),
    CommonComponentModule,
  ],
  providers: [StockApiService, StockStoreService],
})
export class StocksModule {}
