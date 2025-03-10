import { Component } from '@angular/core';
import { BusinessService } from '../../../service/business/business.service';
import { Business } from '../../../store/models/business.model';
import { SubSink } from 'subsink';
import { InvoiceApiService } from '../../../service/invoice/invoice-api.service';
import { SalesReportByPrice } from '../../../store/models/invoice.model';
import { BarGraph } from '../../../store/models/common.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  subs = new SubSink();
  business!: Business;
  monthlySalesReport: SalesReportByPrice[] = [];
  monthlySalesReportBarGraph: BarGraph;
  constructor(
    private businessService: BusinessService,
    private invoiceApiService: InvoiceApiService,
    ) {}

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.getBusiness();
    // this.getMonthlySalesReport();
  }

  getBusiness() {
    const business = this.businessService.getBusiness();

    if (business) this.business = business;
  }

  getMonthlySalesReport() {
    this.subs.sink = this.invoiceApiService
      .getMonthlySalesReport()
      .subscribe((res) => {
        this.monthlySalesReport = res;
        // this.initializeChart();
      });
  }

  processMonthlySalesReport() {
    this.monthlySalesReportBarGraph = {
      labels: this.monthlySalesReport.map((item: any) => item.month),
      datasets: {
        label: 'Monthly Sales Report',
        data: this.monthlySalesReport.map((item) => item.totalRevenue),
      },
    };
  }


  ngOnDestroy() {}
}
