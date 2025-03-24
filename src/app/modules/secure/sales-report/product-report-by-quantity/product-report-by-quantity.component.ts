import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CommonComponentModule } from '../../../../common-component/common-component.module';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormsModule } from '@angular/forms';
import { BarGraph } from '../../../../store/models/common.model';
import { SalesReportService } from '../../../../service/sales-report/sales-report.service';
import { SubSink } from 'subsink';
import { SalesReportByQuantity } from '../../../../store/models/sales-report.model';

@Component({
  selector: 'app-product-report-by-quantity',
  standalone: true,
  imports: [
    CommonModule,
    CommonComponentModule,
    NzDatePickerModule,
    NzRadioModule,
    FormsModule,
  ],
  templateUrl: './product-report-by-quantity.component.html',
  styleUrl: './product-report-by-quantity.component.scss',
  providers: [SalesReportService, DatePipe],
})
export class ProductReportByQuantityComponent {
  loader: boolean = true;
  barGraph: BarGraph;
  selectedDate: Date = new Date();
  @Input() formattedDate: string;
  totalQuantity: number = 0;
  subs = new SubSink();
  salesReportByQuantity: any;
  constructor(private salesReport: SalesReportService) {}

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    // this.formatDate();
  }

  // onDateChange() {
  //   this.formatDate();
  // }

  formatDate(){
    this.formattedDate = this.salesReport.formatSelectedDate(this.selectedDate);
    this.getSalesReportByQuantity();
  }

  ngOnChanges() {
    console.log('on changes');
    this.getSalesReportByQuantity();
  }


  getSalesReportByQuantity() {
    this.subs.sink = this.salesReport
      .getSalesReportByQuantity(this.formattedDate)
      .subscribe({
        next: (res: { body: SalesReportByQuantity[]; total: number }) => {
          this.salesReportByQuantity = res?.body ?? [];
          this.totalQuantity = res?.total ?? 0;
          this.processSalesReport();
        },
        error: () => [],
      });
  }

  processSalesReport() {
    this.barGraph = {
      labels: this.salesReportByQuantity.map((item: SalesReportByQuantity) => item.product),
      indexAxis: 'y',
      datasets: {
        label: 'Product Report by Quantity',
        data: this.salesReportByQuantity.map((item: SalesReportByQuantity) => item.totalQuantity),
      },
    };

    this.loader = false;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
