import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CustomerSummary } from '../../../../store/models/sold-products.model';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import { CustomerSummaryStoreService } from '../../../../service/customer-summary/customer-summary-store.service';
import { SalesReportService } from '../../../../service/sales-report/sales-report.service';
import {
  PaymentStatus,
  SalesReportPeriod,
} from '../../../../store/models/common.model';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { LoaderComponent } from '../../../../common-component/loader/loader.component';
import { NoDataComponent } from '../../../../common-component/no-data/no-data.component';

type ComponentState = {
  customerSummaryList: CustomerSummary[];
  total: Observable<number>;
  loader: Observable<boolean>;
};
@Component({
  standalone: true,
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss',
  imports: [
    CommonModule,
    NzIconModule,
    NzButtonModule,
    LoaderComponent,
    NoDataComponent,
  ],
})
export class CustomerListComponent {
  componentState: ComponentState;
  unsubscribe$ = new Subject<void>();
  params: {
    page: number;
    limit: number;
    status: PaymentStatus;
    period: SalesReportPeriod;
    date: string;
  };
  paymentStatus = PaymentStatus;

  constructor(
    private customerSummaryStore: CustomerSummaryStoreService,
    private salesReportService: SalesReportService
  ) {}

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.params = {
      page: 1,
      limit: 10,
      status: PaymentStatus.PAID,
      period: SalesReportPeriod.MONTHLY,
      date: this.salesReportService.formatSelectedDate(new Date()),
    };
    this.componentState = {
      ...this.componentState,
      customerSummaryList: [],
      total: of(0),
      loader: of(true),
    };
    this.getLoader();
    this.isCustomerSummaryLoaded();

    this.getCustomerSummaryList();
  }

  // start get loader
  getLoader() {
    const { getCustomerSummaryLoader } = this.customerSummaryStore;
    this.componentState = {
      ...this.componentState,
      loader: getCustomerSummaryLoader(),
    };
  }
  // end get loader

  // start get customer summary list
  isCustomerSummaryLoaded() {
    const { getCustomerSummaryLoaded } = this.customerSummaryStore;

    getCustomerSummaryLoaded()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (loaded: boolean) => {
          if (!loaded) {
            this.loadCustomerSummaryList();
          }
        },
        error: (err) => {
          console.log('err: ', err);
        },
      });
  }

  loadCustomerSummaryList() {
    console.log('params ', this.params);
    this.customerSummaryStore.loadCustomerSummaryList(this.params);
  }

  getCustomerSummaryList() {
    const { getCustomerSummaryList } = this.customerSummaryStore;
    getCustomerSummaryList()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res: CustomerSummary[]) => {
          this.componentState = {
            ...this.componentState,
            customerSummaryList: res,
          };
        },
        error: (err) => {
          console.log('err: ', err);
        },
      });
    this.getTotalCustomerSummary();
  }

  getTotalCustomerSummary() {
    const { getTotalCustomerSummary } = this.customerSummaryStore;

    this.componentState = {
      ...this.componentState,
      total: getTotalCustomerSummary(),
    };
  }
  // end get customer summary list

  ngOnDestroy() {
    this.unsubscribe$.next();
  }
}
