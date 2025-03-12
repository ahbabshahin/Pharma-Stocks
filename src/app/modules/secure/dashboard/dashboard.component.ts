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
    this.formatSelectedDate();
    // this.getMonthlySalesReport();
  }

  getBusiness() {
    const business = this.businessService.getBusiness();

    if (business) this.business = business;
  }

  onDateChange(): void {
    this.formatSelectedDate();
  }

  formatSelectedDate(): void {
    const year = this.selectedDate?.getFullYear();
    const month = this.selectedDate?.getMonth() + 1; // Months are 0-based
    this.formattedDate = `${year}-${String(month)?.padStart(2, '0')}-01`;
    this.getMonthlySalesReport();
  }

  getMonthlySalesReport() {
    const today = new Date();
    const formattedDate: string =
      this.datePipe.transform(today, 'yyyy-MM-dd') || '';

    this.subs.sink = this.salesReportApi
      .getDailySalesReport(this.formattedDate)
      .subscribe((res) => {
        console.log('res of daily sales report', res);
        this.dailyReport = res;
        this.processDailySalesReport()
        // this.initializeChart();
      });
  }

  processDailySalesReport() {
    this.dailySalesReportBarGraph = {
      labels: this.dailyReport.map((item: DailyReport) => item.date),
      datasets: {
        label: 'Daily Sales Report',
        data: this.dailyReport.map((item) => item.totalRevenue),
      },
    };
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
