import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { InvoiceApiService } from '../../../service/invoice/invoice-api.service';
import { CommonComponentModule } from '../../../common-component/common-component.module';
import { SharedModule } from '../../../shared/shared.module';
import { DailyReportComponent } from '../sales-report/daily-report/daily-report.component';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    CommonComponentModule,
    SharedModule,
    DailyReportComponent,
  ],
  providers: [InvoiceApiService, DatePipe],
})
export class DashboardModule {}
