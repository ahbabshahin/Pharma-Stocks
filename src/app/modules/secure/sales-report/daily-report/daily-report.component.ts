import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { CommonComponentModule } from '../../../../common-component/common-component.module';
import { FormsModule } from '@angular/forms';
import { LineGraph } from '../../../../store/models/common.model';
import { SalesReportApiService } from '../../../../service/sales-report/sales-report-api.service';
import { SubSink } from 'subsink';
import {
  DailyReport,
  DailyReportResponse,
} from '../../../../store/models/sales-report.model';
import { SalesReportService } from '../../../../service/sales-report/sales-report.service';
import { SalesReportStoreService } from '../../../../service/sales-report/sales-report-store.service';
import { Observable, of, Subject, takeUntil } from 'rxjs';

type ComponentState = {
  dailyReport: DailyReport[];
  totalRevenue$: Observable<number>;
  totalQuantity$: Observable<number>;
  loader$: Observable<boolean>;
  dailySalesReportLineGraph: LineGraph;
};
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
  providers: [SalesReportApiService, SalesReportService, DatePipe],
})
export class DailyReportComponent {
  @Input() status: string;
  @Input() isAmount: boolean = true;
  newStatus: string = 'paid';
  subs = new SubSink();
  selectedDate: Date = new Date();
  loader: boolean = true;
  dailySalesReportLineGraph: LineGraph;
  formattedDate: string = '';
  dailyReport: DailyReport[] = [];
  totalRevenue: number = 0;
  totalQuantity: number = 0;
  unsubscribe$ = new Subject<void>();

  componentState: ComponentState;
  params: {
    date: string;
    status: string;
  };
  constructor(
    private salesReport: SalesReportService,
    private datePipe: DatePipe,
    private salesReportStore: SalesReportStoreService
  ) {}

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.componentState = {
      ...this.componentState,
      totalRevenue$: of(0),
      totalQuantity$: of(0),
      loader$: of(true),
    };
    this.params = {
      ...this.params,
      status: this.status,
    };
    this.getLoader();
    this.getSalesReportDate();
    this.getMonthlySalesReport();
    this.formatSelectedDate();
  }
  onDateChange(): void {
    this.formatSelectedDate();
  }

  ngOnChanges() {

    if (this.status !== this.newStatus) {
      this.loader = true;
      this.newStatus = this.status;
      this.params = {
        ...this.params,
        date: this.formattedDate,
        status: this.status,
      };
      this.loadMonthlySalesReport();
      return;
    } else this.processDailySalesReport();
  }

  formatSelectedDate(): void {
    this.formattedDate = this.salesReport.formatSelectedDate(this.selectedDate);
    this.params = {
      ...this.params,
      date: this.formattedDate,
    };
    this.loadMonthlySalesReport();
  }

  getLoader() {
    const { getDailyReportLoader } = this.salesReportStore;
    this.componentState = {
      ...this.componentState,
      loader$: getDailyReportLoader(),
    };
  }

  loadMonthlySalesReport() {
    this.salesReportStore.loadDailyReport(this.params);
  }

  getMonthlySalesReport() {
    // this.params = {
    //   ...this.params,
    //   date: this.formattedDate,
    //   status: this.status,
    // };
    // this.subs.sink = this.salesReport
    //   .getDailySalesReport(this.params)
    //   .subscribe({
    //     next: (res: DailyReportResponse) => {
    //       this.dailyReport = res?.body ?? [];
    //       this.totalRevenue = res?.total ?? 0;
    //       this.totalQuantity = res?.totalQuantity ?? 0;
    //       this.processDailySalesReport();
    //     },
    //     error: (err) => {
    //       this.loader = false;
    //     },
    //   });

    const { getDailyReport } = this.salesReportStore;

    getDailyReport()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res: DailyReport[]) => {

          this.componentState = {
            ...this.componentState,
            dailyReport: res,
          };
          this.getTotal();
          this.processDailySalesReport();
        },
        error: (err) => {
          // this.loader = false;
        },
      });
  }

  getTotal() {
    const { getDailyReportTotalRevenue, getDailyReportTotalQuantity } =
      this.salesReportStore;
    this.componentState = {
      ...this.componentState,
      totalRevenue$: getDailyReportTotalRevenue(),
      totalQuantity$: getDailyReportTotalQuantity(),
    };
  }

  processDailySalesReport() {
    if (this.componentState?.dailyReport) {
      const { dailyReport } = this.componentState;
      this.dailySalesReportLineGraph = {
        labels: dailyReport?.map((item: DailyReport) => item?.date),
        xTitle: 'Date',
        yTitle: `Total ${this.isAmount ? 'Revenue' : 'Quantity'}`,
        datasets: {
          label: 'Daily Sales Report',
          data: dailyReport?.map((item) =>
            this.isAmount ? item?.totalRevenue : item?.totalQuantity
          ),
        },
      };
      this.loader = false;
    }
  }

  getSalesReportDate() {
    this.subs.sink = this.salesReportStore
      .getSalesReportDate()
      .subscribe((date: string) => {
        if (date !== '') {
          if (date !== this.formattedDate) {
            this.selectedDate = new Date(date);
            this.formattedDate = date;
            this.params = {
              ...this.params,
              date,
            };
            // this.dispatchActions();
          } else {

          }
        } else this.onDateChange();
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
  }
}
