import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { CommonComponentModule } from '../../../common-component/common-component.module';
import { ProductReportByPriceComponent } from './product-report-by-price/product-report-by-price.component';
import { ProductReportByQuantityComponent } from './product-report-by-quantity/product-report-by-quantity.component';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormsModule } from '@angular/forms';
import { SalesReportService } from '../../../service/sales-report/sales-report.service';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { YearlyReportComponent } from './yearly-report/yearly-report.component';
import { ProductReportTableComponent } from './product-report-table/product-report-table.component';
import { SalesReportStoreService } from '../../../service/sales-report/sales-report-store.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-sales-report',
  standalone: true,
  imports: [
    CommonModule,
    CommonComponentModule,
    ProductReportByPriceComponent,
    ProductReportByQuantityComponent,
    NzRadioModule,
    FormsModule,
    NzDatePickerModule,
    NzAffixModule,
    ProductReportTableComponent,
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
  constructor(
    private salesReport: SalesReportService,
    private salesReportStore: SalesReportStoreService
  ) {}

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    // this.onDateChange();
    this.getSalesReportDate();
  }

  loadProductReport() {
    this.salesReportStore.loadProductReport(this.formattedDate);
  }

  getSalesReportDate(){
    this.subs.sink = this.salesReportStore.getSalesReportDate().subscribe((date: string) =>{
      if(date !== '' ) {
        if (date !== this.formattedDate) {
          this.selectedDate = new Date(date);
          this.formattedDate = date;
          this.loadProductReport();
        }else{
          console.log('reset');
        }
      }
      else this.onDateChange()
    })
  }

  onDateChange(): void {
    this.formattedDate = this.salesReport.formatSelectedDate(this.selectedDate);
    this.loadProductReport();
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }
}
