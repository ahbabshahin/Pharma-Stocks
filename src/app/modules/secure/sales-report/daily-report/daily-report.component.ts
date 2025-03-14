import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { LineGraphComponent } from '../../../../common-component/line-graph/line-graph.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { CommonComponentModule } from '../../../../common-component/common-component.module';
import { FormsModule } from '@angular/forms';
import { BarGraph } from '../../../../store/models/common.model';
import { SalesReportApiService } from '../../../../service/sales-report/sales-report-api.service';
import { DailyReport } from '../../../../store/models/invoice.model';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-daily-report',
  standalone: true,
  imports: [
    CommonModule,
    NzDatePickerModule,
    CommonComponentModule,
    FormsModule,
  ],
  templateUrl: './daily-report.component.html',
  styleUrl: './daily-report.component.scss',
  providers: [SalesReportApiService],
})
export class DailyReportComponent {
  subs = new SubSink();
  selectedDate: Date = new Date();
  loader: boolean = true;
  dailySalesReportBarGraph: BarGraph;
  formattedDate: string = '';
  dailyReport: DailyReport[] = [];

  constructor(
    private salesReportApi: SalesReportApiService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.formatSelectedDate();
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
      .subscribe({
        next: (res) => {
          console.log('res of daily sales report', res);
          this.dailyReport = res;
          this.processDailySalesReport();
          // this.initializeChart();
        },
        error: (err) => {
          this.loader = false;
          console.log('err of daily sales report', err);
        },
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
    this.loader = false;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
