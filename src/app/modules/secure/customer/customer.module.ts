import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerRoutingModule } from './customer-routing.module';
import * as customerComponents from './index';
import { SharedModule } from '../../../shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { customerStateName } from '../../../store/app.state';
import { customerReducer } from '../../../store/reducers/customer.reducer';
import { EffectsModule } from '@ngrx/effects';
import { CustomerEffects } from '../../../store/effects/customer.effect';
import { CustomerApiService } from '../../../service/customer/customer-api.service';
import { CustomerStoreService } from '../../../service/customer/customer-store.service';
import { CommonComponentModule } from '../../../common-component/common-component.module';
import { AreaCodeStoreService } from 'src/app/service/area-code/area-code-store.service';
import { AreaCodeEffect } from 'src/app/store/effects/area-code.effect';
import { AreaCodeApiService } from 'src/app/service/area-code/area-code-api.service';


@NgModule({
  declarations: [customerComponents.components],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    SharedModule,
    StoreModule.forFeature(customerStateName, customerReducer),
    EffectsModule.forFeature(CustomerEffects),
    EffectsModule.forFeature(AreaCodeEffect),
    CommonComponentModule,
],
  providers: [CustomerApiService, CustomerStoreService, AreaCodeStoreService, AreaCodeApiService,],
})
export class CustomerModule {}
