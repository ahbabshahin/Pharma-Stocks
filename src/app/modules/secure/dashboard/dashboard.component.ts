import { Component } from '@angular/core';
import { BusinessService } from '../../../service/business/business.service';
import { Business } from '../../../store/models/business.model';
import { SubSink } from 'subsink';
import { InvoiceApiService } from '../../../service/invoice/invoice-api.service';
import { DailyReport, SalesReportByPrice } from '../../../store/models/invoice.model';
import { BarGraph } from '../../../store/models/common.model';
import { SalesReportApiService } from '../../../service/sales-report/sales-report-api.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  loader: boolean = true;
  subs = new SubSink();
  business!: Business;
  dailyReport: DailyReport[] = [];
  dailySalesReportBarGraph: BarGraph;

  selectedDate: Date = new Date(); // Default to current date
  formattedDate: string = '';

  constructor(
    private businessService: BusinessService,
    private salesReportApi: SalesReportApiService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.getBusiness();
    // this.formatSelectedDate();
    // this.getMonthlySalesReport();
  }

  getBusiness() {
    const business = this.businessService.getBusiness();

    if (business) this.business = business;
  }



  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
