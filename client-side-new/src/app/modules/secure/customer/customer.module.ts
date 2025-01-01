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
import { LoaderComponent } from "../../../common-component/loader/loader.component";
import { CommonComponentModule } from '../../../common-component/common-component.module';


@NgModule({
  declarations: [customerComponents.components],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    SharedModule,
    StoreModule.forFeature(customerStateName, customerReducer),
    EffectsModule.forFeature(CustomerEffects),
    CommonComponentModule,
],
  providers: [CustomerApiService, CustomerStoreService,],
})
export class CustomerModule {}
