import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { InvoiceApiService } from '../../../service/invoice/invoice-api.service';
import { CommonComponentModule } from '../../../common-component/common-component.module';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, DashboardRoutingModule, CommonComponentModule, SharedModule,],
  providers: [InvoiceApiService, DatePipe],
})
export class DashboardModule {}
