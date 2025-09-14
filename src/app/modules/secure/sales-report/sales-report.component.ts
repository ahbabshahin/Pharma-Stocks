import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CommonComponentModule } from '../../../common-component/common-component.module';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormsModule } from '@angular/forms';
import { SalesReportService } from '../../../service/sales-report/sales-report.service';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { ProductReportTableComponent } from './product-report-table/product-report-table.component';
import { SalesReportStoreService } from '../../../service/sales-report/sales-report-store.service';
import { SubSink } from 'subsink';
import { ProductReportComponent } from "./product-report/product-report.component";
import { AllAreaReportComponent } from './all-area-report/all-area-report.component';
import { CustomerWiseReportComponent } from './customer-wise-report/customer-wise-report.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { SalesReportInterval } from '../../../store/models/sales-report.model';

@Component({
  selector: 'app-sales-report',
  standalone: true,
  imports: [
    CommonModule,
    CommonComponentModule,
    NzRadioModule,
    FormsModule,
    NzDatePickerModule,
    NzAffixModule,
    NzSelectModule,
    ProductReportTableComponent,
    ProductReportComponent,
    AllAreaReportComponent,
    CustomerWiseReportComponent,
  ],
  templateUrl: './sales-report.component.html',
  styleUrl: './sales-report.component.scss',
  providers: [],
})
export class SalesReportComponent {
  subs = new SubSink();
  Object = Object;
  priceQuantity: boolean = true;
  formattedDate: string = '';
  selectedDate: Date = new Date();
  navHeight: number = 60;
  isAmount: boolean = true;
  status: string = 'paid';
  params: {
    date: string;
    status: string;
  };
  interval: SalesReportInterval = SalesReportInterval.MONTHLY;
  SalesReportInterval = SalesReportInterval;
  constructor(
    private salesReport: SalesReportService,
    private salesReportStore: SalesReportStoreService
  ) {}

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    // this.onDateChange();
    this.params = {
      ...this.params,
      status: this.status,
    };
    this.getSalesReportDate();
  }

  dispatchActions() {
    this.loadProductReport();
    this.loadSalesSummaryByAllArea();
    this.loadCustomerWiseSalesReport();
  }

  loadProductReport() {
    if (this.params?.date) this.salesReportStore.loadProductReport(this.params);
  }

  loadSalesSummaryByAllArea() {
    if (this.params?.date)
      this.salesReportStore.loadSalesSummaryByAllArea(this.params);
  }

  loadCustomerWiseSalesReport() {
    if (this.params?.date) {
      let params = {
        ...this.params,
        type: this.interval,
      };
      this.salesReportStore.loadCustomerWiseSalesReport(params);
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
            this.dispatchActions();
          } else {
            console.log('reset');
          }
        } else this.onDateChange();
      });
  }

  onDateChange(): void {
    this.formattedDate = this.salesReport.formatSelectedDate(this.selectedDate);
    this.params = {
      ...this.params,
      date: this.formattedDate,
    };
    this.dispatchActions();
  }

  onStatusChange(status: string): void {
    this.status = status;
    this.params = {
      ...this.params,
      status,
    };
    this.dispatchActions();
  }

  onIntervalChange(){
    this.loadCustomerWiseSalesReport();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
