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
import { NzRadioModule } from 'ng-zorro-antd/radio';

@Component({
  selector: 'app-product-report-by-price',
  standalone: true,
  imports: [
    CommonModule,
    BarGraphComponent,
    NzDatePickerModule,
    CommonComponentModule,
    FormsModule,
    NzRadioModule,
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
  totalRevenue: number = 0;
  radioValue: number = 0;
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
        next: (res: { body: SalesReportByPrice[]; total: number }) => {
          this.salesReportByPrice = res?.body ?? [];
          this.totalRevenue = res?.total ?? 0;
          this.processDailySalesReport();
        },
        error: (err) => {
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

    this.loader = false;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
