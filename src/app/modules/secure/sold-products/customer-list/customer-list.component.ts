import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CustomerSummary } from '../../../../store/models/sold-products.model';
import { combineLatest, Observable, of, Subject, takeUntil } from 'rxjs';
import { CustomerSummaryStoreService } from '../../../../service/customer-summary/customer-summary-store.service';
import {
  PaymentStatus,
  SalesReportPeriod,
} from '../../../../store/models/common.model';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { LoaderComponent } from '../../../../common-component/loader/loader.component';
import { NoDataComponent } from '../../../../common-component/no-data/no-data.component';
import { FilterService } from '../../../../service/filter/filter.service';

type ComponentState = {
  customerSummaryList: CustomerSummary[];
  total$: Observable<number>;
  total: number;
  loader$: Observable<boolean>;
  subloader$: Observable<boolean>;
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
  isMore: boolean = false;
  constructor(
    private customerSummaryStore: CustomerSummaryStoreService,
    private filterService: FilterService
  ) {}

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.params = {
      ...this.params,
      page: 1,
      limit: 10,
      // status: PaymentStatus.PAID,
      // period: SalesReportPeriod.MONTHLY,
      // date: this.filterService.formatSelectedDate(new Date()),
    };
    this.componentState = {
      ...this.componentState,
      customerSummaryList: [],
      total: 0,
      loader$: of(true),
      subloader$: of(false),
    };
    this.getFilterParams();
    this.getLoader();
    // this.isCustomerSummaryLoaded();

    this.getCustomerSummaryList();
  }

  // start get filter params
  getFilterParams() {
    combineLatest([
      this.filterService.getFilterDate(),
      this.filterService.getFilterStatus(),
      this.filterService.getFilterPeriod(),
    ])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: ([date, status, period]) => {
          this.params = {
            ...this.params,
            page: 1,
            date,
            status,
            period,
          };
          this.loadCustomerSummaryList();
        },
        error: (err) => {
          console.log('Filter error: ', err);
        },
      });
  }
  // end get filter params

  // start get loader
  getLoader() {
    const { getCustomerSummaryLoader, getCustomerSummarySubLoader } =
      this.customerSummaryStore;
    this.componentState = {
      ...this.componentState,
      loader$: getCustomerSummaryLoader(),
      subloader$: getCustomerSummarySubLoader(),
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
    if (this.params?.date && this.params?.status && this.params?.period)
      this.customerSummaryStore.loadCustomerSummaryList(this.params, this.isMore);
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
          if(this.isMore) this.isMore = false;
        },
        error: (err) => {
          console.log('err: ', err);
        },
      });
    this.getTotalCustomerSummary();
  }

  getTotalCustomerSummary() {
    const { getTotalCustomerSummary } = this.customerSummaryStore;

    getTotalCustomerSummary().pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (total: number) =>{
        this.componentState = {
          ...this.componentState,
          total
        }
      },error: (err) => {
        console.log('err: ', err);
      }
    });
  }
  // end get customer summary list

  // start load more customer summary

  loadMore() {
    if (
      this.componentState?.customerSummaryList?.length <
      this.componentState?.total
    ) {
      this.params = {
        ...this.params,
        page: this.params.page + 1,
      };
      // this.stockStore.setStockSubLoader(true);
      this.isMore = true;
      this.loadCustomerSummaryList();
    }
  }
  // end load more customer summary

  ngOnDestroy() {
    this.unsubscribe$.next();
  }
}
