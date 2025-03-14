import { Component } from '@angular/core';
import { BarGraphComponent } from '../../../../common-component/bar-graph/bar-graph.component';
import { CommonModule, DatePipe } from '@angular/common';
import { BarGraph } from '../../../../store/models/common.model';
import { SubSink } from 'subsink';
import { SalesReportApiService } from '../../../../service/sales-report/sales-report-api.service';
import { SalesReportByPrice } from '../../../../store/models/sales-report.model';
import { FormsModule } from '@angular/forms';
import { CommonComponentModule } from '../../../../common-component/common-component.module';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'app-product-report-by-price',
  standalone: true,
  imports: [
    CommonModule,
    BarGraphComponent,
    NzDatePickerModule,
    CommonComponentModule,
    FormsModule,
  ],
  templateUrl: './product-report-by-price.component.html',
  styleUrl: './product-report-by-price.component.scss',
  providers: [SalesReportApiService, DatePipe],
})
export class ProductReportByPriceComponent {
  barGraph: BarGraph;
  subs = new SubSink();
  selectedDate: Date = new Date();
  formattedDate: string;
  loader: boolean = true;
  salesReportByPrice: SalesReportByPrice[] = [];
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
    this.formattedDate =
      this.datePipe.transform(this.selectedDate, 'yyyy-MM-01') || '';
    this.getProductReportByPrice();
  }

  getProductReportByPrice() {
    this.subs.sink = this.salesReportApi
      .getSalesReportByPrice(this.formattedDate)
      .subscribe({
        next: (res) => {
          this.salesReportByPrice = res;
          console.log('this.salesReportByPrice : ', this.salesReportByPrice);
          this.processDailySalesReport();
        },
        error: (err) => {
          console.log(err);
          this.loader = false;
        },
      });
  }
  processDailySalesReport() {
    this.barGraph = {
      labels: this.salesReportByPrice.map(
        (item: SalesReportByPrice) => item.product
      ),
      indexAxis: 'y',
      datasets: {
        label: 'Product Report by Price',
        data: this.salesReportByPrice.map((item) => item.totalRevenue),
      },
    };
    console.log('this.barGraph : ', this.barGraph );
    this.loader = false;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
