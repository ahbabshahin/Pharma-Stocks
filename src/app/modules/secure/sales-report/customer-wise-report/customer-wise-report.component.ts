import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BarGraphComponent } from '../../../../common-component/bar-graph/bar-graph.component';
import { LoaderComponent } from '../../../../common-component/loader/loader.component';
import { Subject, takeUntil } from 'rxjs';
import { SalesReportStoreService } from '../../../../service/sales-report/sales-report-store.service';
import {
  SalesSummaryGrandTotal,
  CustomerWiseSalesReportResponse,
  CustomerWiseSalesReport,
} from '../../../../store/models/sales-report.model';
import { BarGraph } from '../../../../store/models/common.model';
import { NoDataComponent } from '../../../../common-component/no-data/no-data.component';

type ComponentState = {
  // customerWiseSalesReport: CustomerWiseSalesReportResponse;
  customerWiseSalesReport: CustomerWiseSalesReport[];
  customerWiseReportBarGraph: BarGraph;
};

@Component({
  standalone: true,
  selector: 'app-customer-wise-report',
  templateUrl: './customer-wise-report.component.html',
  styleUrl: './customer-wise-report.component.scss',
  imports: [CommonModule, BarGraphComponent, LoaderComponent, NoDataComponent],
})
export class CustomerWiseReportComponent {
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
    this.getCustomerWiseSalesReport();
    this.getGrandTotals();
  }

  ngOnChanges() {
    if (this.isAmount !== this.type) {
      this.type = this.isAmount;
      this.processCustomerWiseSalesReport();
    }
  }

  getCustomerWiseSalesReport() {
    const { getCustomerWiseSalesReport } = this.salesReportStore;

    getCustomerWiseSalesReport()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res: CustomerWiseSalesReport[]) => {
          this.componentState = {
            ...this.componentState,
            // salesSummaryAllArea: res,
            customerWiseSalesReport: res,
          };
          // this.grandTotals = res?.grandTotals;
          this.processCustomerWiseSalesReport();
        },
        error: (err) => {
          console.log('err: ', err);
        },
      });
  }

  getGrandTotals(){
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

  processCustomerWiseSalesReport() {
    const {
      customerWiseSalesReport: report ,
    } = this.componentState;
    this.componentState = {
      ...this.componentState,
      customerWiseReportBarGraph: {
        labels: report.map(
          (item: CustomerWiseSalesReport) => item?.customerName
        ),
        indexAxis: 'x',
        datasets: {
          label: `Customer wise Sales`,
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
