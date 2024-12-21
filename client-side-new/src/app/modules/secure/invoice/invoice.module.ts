import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoiceComponent } from './invoice.component';
import { NewInvoiceComponent } from './new-invoice/new-invoice.component';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { invoiceReducer } from '../../../store/reducers/invoice.reducer';
import { InvoiceEffects } from '../../../store/effects/invoice.effect';
import { invoiceStateName } from '../../../store/app.state';

@NgModule({
  declarations: [InvoiceComponent, NewInvoiceComponent],
  imports: [
    CommonModule,
    InvoiceRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature(invoiceStateName, invoiceReducer),
    EffectsModule.forFeature([InvoiceEffects])
  ],
})
export class InvoiceModule {}
