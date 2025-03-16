import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { LineGraphComponent } from '../../../../common-component/line-graph/line-graph.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { CommonComponentModule } from '../../../../common-component/common-component.module';
import { FormsModule } from '@angular/forms';
import { BarGraph, LineGraph } from '../../../../store/models/common.model';
import { SalesReportApiService } from '../../../../service/sales-report/sales-report-api.service';
import { SubSink } from 'subsink';
import { DailyReport } from '../../../../store/models/sales-report.model';

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
  dailySalesReportLineGraph: LineGraph;
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
    this.formattedDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-01') || '';
    this.getMonthlySalesReport();
  }

  getMonthlySalesReport() {
    this.subs.sink = this.salesReportApi
      .getDailySalesReport(this.formattedDate)
      .subscribe({
        next: (res) => {
          this.dailyReport = res;
          this.processDailySalesReport();
        },
        error: (err) => {
          this.loader = false;
        },
      });
  }

  processDailySalesReport() {
    this.dailySalesReportLineGraph = {
      labels: this.dailyReport.map((item: DailyReport) => item.date),
      xTitle: 'Date',
      yTitle: 'Total Revenue',
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
