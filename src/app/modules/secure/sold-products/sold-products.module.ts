import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SoldProductsRoutingModule } from './sold-products-routing.module';
import { CustomerSummaryStoreService } from '../../../service/customer-summary/customer-summary-store.service';
import { EffectsModule } from '@ngrx/effects';
import { CustomerSummaryEffects } from '../../../store/effects/customer-summary.effect';


@NgModule({
  declarations: [],
  imports: [CommonModule, SoldProductsRoutingModule,
    EffectsModule.forFeature(CustomerSummaryEffects)
  ],
  providers: [CustomerSummaryStoreService],
})
export class SoldProductsModule {}
