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
    ProductReportTableComponent,
    ProductReportComponent,
],
  templateUrl: './sales-report.component.html',
  styleUrl: './sales-report.component.scss',
  providers: [],
})
export class SalesReportComponent {
  subs = new SubSink();
  priceQuantity: boolean = true;
  formattedDate: string = '';
  selectedDate: Date = new Date();
  navHeight: number = 60;
  isAmount: boolean = true;
  status: string = 'paid';
  params: {
    date: string,
    status: string,
  }
  constructor(
    private salesReport: SalesReportService,
    private salesReportStore: SalesReportStoreService,
  ) {}

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    // this.onDateChange();
    this.params = {
      ...this.params,
      status: this.status,
    }
    this.getSalesReportDate();
  }

  loadProductReport() {
    if(this.params?.date)
    this.salesReportStore.loadProductReport(this.params);
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
            }
            this.loadProductReport();
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
    this.loadProductReport();
  }

  onStatusChange(status: string): void {
    this.status = status;
    this.params = {
      ...this.params,
      status,
    }
    this.loadProductReport();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
