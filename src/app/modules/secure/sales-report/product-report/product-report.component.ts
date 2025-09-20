import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CommonComponentModule } from '../../../../common-component/common-component.module';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import { BarGraphComponent } from '../../../../common-component/bar-graph/bar-graph.component';
import { SalesReportService } from '../../../../service/sales-report/sales-report.service';
import { SalesReportStoreService } from '../../../../service/sales-report/sales-report-store.service';
import { ProductReport } from '../../../../store/models/sales-report.model';
import { BarGraph } from '../../../../store/models/common.model';

type ComponentState = {
  totalRevenue$: Observable<number>;
  totalQuantity$: Observable<number>;
  productReportBarGraph: BarGraph;
  productReport: ProductReport[];
};

@Component({
  standalone: true,
  selector: 'app-product-report',
  templateUrl: './product-report.component.html',
  styleUrl: './product-report.component.scss',
  imports: [CommonModule, CommonComponentModule, BarGraphComponent],
})
export class ProductReportComponent {
  componentState: ComponentState;
  loader: boolean = true;
  selectedDate: Date = new Date();
  @Input() formattedDate: string;
  unsubscribe$ = new Subject();
  @Input() isAmount: boolean = true;
  @Input() status: string;
  type: boolean = true;

  constructor(
    private salesReport: SalesReportService,
    private salesReportStore: SalesReportStoreService
  ) {}

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.componentState = {
      ...this.componentState,
      productReport: [],
      totalRevenue$: of(0),
      totalQuantity$: of(0),
    };
    // this.formatSelectedDate();
    this.getProductReport();
  }

  formatSelectedDate(): void {
    this.formattedDate = this.salesReport.formatSelectedDate(this.selectedDate);
    this.getProductReport();
  }

  ngOnChanges() {
    if(this.isAmount !== this.type){
      this.type = this.isAmount;
      this.processDailySalesReport();
    }
  }

  getProductReport() {
    const { getProductReport } = this.salesReportStore;

    getProductReport()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res: ProductReport[]) => {
          this.componentState = {
            ...this.componentState,
            productReport: res,
          };
          this.loader = false;
          this.getTotalProduct();

          this.processDailySalesReport();
        },
        error: () => {
          this.loader = false;
        },
      });
  }

  getTotalProduct() {
    const { getProductReportTotalRevenue, getProductReportTotalQuantity } =
      this.salesReportStore;
    this.componentState = {
      ...this.componentState,
      totalRevenue$: getProductReportTotalRevenue(),
      totalQuantity$: getProductReportTotalQuantity(),
    };
  }

  processDailySalesReport() {
    this.componentState = {
      ...this.componentState,
      productReportBarGraph: {
        labels: this.componentState?.productReport.map(
          (item: ProductReport) => item?.product
        ),
        indexAxis: 'x',
        datasets: {
          label: `Product Report by ${this.isAmount ? 'Price' : 'Quantity'}`,
          data: this.componentState?.productReport.map((item) =>
            this.isAmount ? item?.totalRevenue : item?.totalQuantity
          ),
        },
      },
    };

    this.loader = false;
  }

  ngOnDestroy() {
    this.unsubscribe$.next('');
  }
}
