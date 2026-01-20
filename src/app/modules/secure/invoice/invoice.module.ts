import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

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
import { InvoiceApiService } from '../../../service/invoice/invoice-api.service';
import { InvoiceStoreService } from '../../../service/invoice/invoice-store.service';
import { StockApiService } from 'src/app/service/stocks/stock-api.service';
import { CustomerApiService } from '../../../service/customer/customer-api.service';
import { NgxPrintModule } from 'ngx-print';
import { CustomerStoreService } from '../../../service/customer/customer-store.service';
import { CommonComponentModule } from '../../../common-component/common-component.module';
import { ViewInvoiceComponent } from './view-invoice/view-invoice.component';
import { StockStoreService } from 'src/app/service/stocks/stock-store.service';
import { InvoiceService } from 'src/app/service/invoice/invoice.service';

@NgModule({
  declarations: [InvoiceComponent, NewInvoiceComponent, ViewInvoiceComponent],
  imports: [
    CommonModule,
    InvoiceRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature(invoiceStateName, invoiceReducer),
    EffectsModule.forFeature([InvoiceEffects]),
    NgxPrintModule,
    CommonComponentModule,
  ],
  providers: [
    InvoiceApiService,
    InvoiceStoreService,
    StockApiService,
	StockStoreService,
    CustomerApiService,
    CustomerStoreService,
    DatePipe,
	InvoiceService,
  ],
})
export class InvoiceModule {}
