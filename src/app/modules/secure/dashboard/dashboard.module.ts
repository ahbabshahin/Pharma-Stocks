import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { InvoiceApiService } from '../../../service/invoice/invoice-api.service';
import { CommonComponentModule } from '../../../common-component/common-component.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, DashboardRoutingModule, CommonComponentModule,],
  providers: [InvoiceApiService],
})
export class DashboardModule {}
