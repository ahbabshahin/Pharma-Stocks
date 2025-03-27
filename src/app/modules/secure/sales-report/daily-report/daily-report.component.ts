import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LineGraphComponent } from '../../../../common-component/line-graph/line-graph.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { CommonComponentModule } from '../../../../common-component/common-component.module';
import { FormsModule } from '@angular/forms';
import { BarGraph, LineGraph } from '../../../../store/models/common.model';
import { SalesReportApiService } from '../../../../service/sales-report/sales-report-api.service';
import { SubSink } from 'subsink';
import { DailyReport, DailyReportResponse } from '../../../../store/models/sales-report.model';
import { SalesReportService } from '../../../../service/sales-report/sales-report.service';

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
  providers: [SalesReportApiService, SalesReportService, DatePipe,],
})
export class DailyReportComponent {
  @Input() isAmount: boolean = true;
  subs = new SubSink();
  selectedDate: Date = new Date();
  loader: boolean = true;
  dailySalesReportBarGraph: BarGraph;
  dailySalesReportLineGraph: LineGraph;
  formattedDate: string = '';
  dailyReport: DailyReport[] = [];
  totalRevenue: number = 0;
  totalQuantity: number = 0;
  constructor(
    private salesReportApi: SalesReportApiService,
    private salesReport: SalesReportService,
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

  ngOnChanges() {
    this.processDailySalesReport();
  }

  formatSelectedDate(): void {
    this.formattedDate =
      this.datePipe.transform(this.selectedDate, 'yyyy-MM-01') || '';
    this.getMonthlySalesReport();
  }

  getMonthlySalesReport() {
    this.subs.sink = this.salesReport
      .getDailySalesReport(this.formattedDate)
      .subscribe({
        next: (res: DailyReportResponse) => {
          this.dailyReport = res?.body ?? [];
          this.totalRevenue = res?.total ?? 0;
          this.totalQuantity = res?.totalQuantity ?? 0;
          this.processDailySalesReport();
        },
        error: (err) => {
          this.loader = false;
        },
      });
  }

  processDailySalesReport() {
    this.dailySalesReportLineGraph = {
      labels: this.dailyReport?.map((item: DailyReport) => item.date),
      xTitle: 'Date',
      yTitle: `Total ${this.isAmount ? 'Revenue' : 'Quantity'}`,
      datasets: {
        label: 'Daily Sales Report',
        data: this.dailyReport?.map((item) =>
          this.isAmount ? item?.totalRevenue : item?.totalQuantity
        ),
      },
    };
    this.loader = false;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
