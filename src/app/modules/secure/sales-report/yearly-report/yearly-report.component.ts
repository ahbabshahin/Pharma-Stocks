import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { SalesReportService } from '../../../../service/sales-report/sales-report.service';
import { FormsModule } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { CommonComponentModule } from '../../../../common-component/common-component.module';
import { LineGraph } from '../../../../store/models/common.model';
import { SubSink } from 'subsink';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { YearlyReport, YearlyReportResponse } from '../../../../store/models/sales-report.model';
import { LineGraphComponent } from '../../../../common-component/line-graph/line-graph.component';

@Component({
  selector: 'app-yearly-report',
  standalone: true,
  imports: [
    CommonModule,
    CommonComponentModule,
    NzDatePickerModule,
    FormsModule,
    NzRadioModule,
  ],
  templateUrl: './yearly-report.component.html',
  styleUrl: './yearly-report.component.scss',
  providers: [SalesReportService, DatePipe],
})
export class YearlyReportComponent {
  date: Date = new Date();
  year: number;
  subs = new SubSink();
  isAmount: boolean = true;
  totalRevenue: number = 0;
  totalQuantity: number = 0;
  loader: boolean = true;
  yearlySalesReportLineGraph: LineGraph = {
    labels: [],
    xTitle: '',
    yTitle: '',
    datasets: { label: '', data: [] },
  };
  yearlyReport: YearlyReport[] = [];
  constructor(private salesReport: SalesReportService) {}

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.year = new Date().getFullYear();
    this.getYearlySalesReport();
  }
  onYearChange() {
    this.year = this.date.getFullYear();
    this.getYearlySalesReport();
  }

  onTypeChange() {
    this.processYearlySalesReport();
  }

  getYearlySalesReport() {
    this.subs.sink = this.salesReport
      .getYearlySalesReport(this.year)
      .subscribe({
        next: (res: YearlyReportResponse) => {
          this.yearlyReport = res?.body ?? [];
          this.totalRevenue = res?.total ?? 0;
          this.totalQuantity = res?.totalQuantity ?? 0;
          this.processYearlySalesReport();
          // this.loader = false;
        },
        error: () => {
          this.loader = false;
        },
      });
  }

  processYearlySalesReport() {
    if (!this.yearlyReport || this.yearlyReport.length === 0) {
      console.warn('No data for the graph.');
      return;
    }

    this.yearlySalesReportLineGraph = {
      labels: this.yearlyReport.map((item: YearlyReport) => item.month),
      xTitle: 'Month',
      yTitle: `Total ${this.isAmount ? 'Revenue' : 'Quantity'}`,
      datasets: {
        label: 'Yearly Sales Report',
        data: this.yearlyReport.map((item) =>
          this.isAmount ? item.totalRevenue ?? 0 : item.totalQuantity ?? 0
        ),
      },
    };

    this.loader = false;
    console.log('Processed Graph Data:', this.yearlySalesReportLineGraph);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
