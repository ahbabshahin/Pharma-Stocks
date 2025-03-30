import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { SalesReportApiService } from './sales-report-api.service';
import { catchError, map, of } from 'rxjs';
import { CommonService } from '../common/common.service';
import { DailyReportResponse, SalesReportByPrice, SalesReportByQuantity, YearlyReportResponse } from '../../store/models/sales-report.model';

@Injectable({
  providedIn: 'root',
})
export class SalesReportService {
  constructor(
    private datePipe: DatePipe,
    private salesReportApi: SalesReportApiService,
    private commonService: CommonService
  ) {}

  formatSelectedDate(selectedDate: Date): string {
    let formattedDate: string =
      this.datePipe.transform(selectedDate, 'yyyy-MM-01') || '';
    // this.getProductReportByPrice();
    return formattedDate;
  }

  getSalesReportByPrice(date: string) {
    return this.salesReportApi.getSalesReportByPrice(date).pipe(
      map(
        (res: { body: SalesReportByPrice[]; total: number }) => {
          return res;
        },
        catchError(() => {
          this.commonService.showErrorToast('Sales report by price load failed')
          return of();
        })
      )
    );
  }

  getSalesReportByQuantity(date: string) {
    return this.salesReportApi.getSalesReportByQuantity(date).pipe(
      map(
        (res: { body: SalesReportByQuantity[]; total: number }) => {
          return res;
        },
        catchError(() => {
          this.commonService.showErrorToast(
            'Sales report by quantity load failed'
          );
          return of();
        })
      )
    );
  }

  getDailySalesReport(params: {[key: string]: any}){
    return this.salesReportApi.getDailySalesReport(params).pipe(
      map(
        (res: DailyReportResponse) => {
          return res;
        },
        catchError(() => {
          this.commonService.showErrorToast(
            'Daily Sales report by price and quantity load failed'
          );
          return of();
        })
      )
    );
  }

  getYearlySalesReport(year: number){
    return this.salesReportApi.getYearlySalesReport(year).pipe(
      map(
        (res: YearlyReportResponse) => {
          return res;
        },
        catchError(() => {
          this.commonService.showErrorToast(
            'Yearly Sales report by price and quantity load failed'
          );
          return of();
        })
      )
    );
  }

}
