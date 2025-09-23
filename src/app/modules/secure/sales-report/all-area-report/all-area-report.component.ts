import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PieGraph } from '../../../../store/models/common.model';
import { LoaderComponent } from '../../../../common-component/loader/loader.component';
import { PieGraphComponent } from '../../../../common-component/pie-graph/pie-graph.component';
import { SalesReportStoreService } from '../../../../service/sales-report/sales-report-store.service';
import { SalesSummaryByArea, SalesSummaryGrandTotal, SalesSummaryReport } from '../../../../store/models/sales-report.model';
import { Subject, takeUntil } from 'rxjs';
import { NoDataComponent } from '../../../../common-component/no-data/no-data.component';
export type ComponentState = {
  salesSummaryAllArea: SalesSummaryReport[];
  allAreaReportPieGraph: PieGraph;
};
@Component({
  standalone: true,
  selector: 'app-all-area-report',
  templateUrl: './all-area-report.component.html',
  styleUrl: './all-area-report.component.scss',
  imports: [CommonModule, LoaderComponent, PieGraphComponent, NoDataComponent],
})
export class AllAreaReportComponent {
  loader: boolean = true;
  componentState: ComponentState;
  @Input() isAmount: boolean = true;
  @Input() status: string;
  type: boolean = true;
  unsubscribe$ = new Subject<void>();
  grandTotals: SalesSummaryGrandTotal;
  constructor(private salesReportStore: SalesReportStoreService) {}

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.componentState = {
      ...this.componentState,
    };
    this.getSalesSummaryByAllArea();
    this.getGrandTotals();
  }

  ngOnChanges() {
    if (this.isAmount !== this.type) {
      this.type = this.isAmount;
      this.processSalesSummaryByAllArea();
    }
  }

  getSalesSummaryByAllArea() {
    const { getSalesSummaryByAllArea } = this.salesReportStore;

    getSalesSummaryByAllArea()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res: SalesSummaryReport[]) => {
          this.componentState = {
            ...this.componentState,
            salesSummaryAllArea: res,
          };
          // this.grandTotals = res?.grandTotals;
          this.processSalesSummaryByAllArea();
        },
        error: (err) => {
          console.log('err: ', err);
        },
      });
  }

  getGrandTotals() {
    const { getSalesReportGrandTotals } = this.salesReportStore;

    getSalesReportGrandTotals()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (totals: SalesSummaryGrandTotal) => {
          this.grandTotals = totals;
        },
        error: (err) => {
          console.log('err: ', err);
        },
      });
  }

  processSalesSummaryByAllArea() {
    const { salesSummaryAllArea: report } = this.componentState;
    this.componentState = {
      ...this.componentState,
      allAreaReportPieGraph: {
        labels: report.map((item: SalesSummaryReport) => item?.areaCode),
        datasets: {
          label: `Product Report by ${this.isAmount ? 'Price' : 'Quantity'}`,
          data: report.map((item) =>
            this.isAmount ? item?.totalRevenue : item?.totalQuantity
          ),
        },
      },
    };

    this.loader = false;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
  }
}
