import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { SalesReportApiService } from './sales-report-api.service';
import { catchError, map, of } from 'rxjs';
import { CommonService } from '../common/common.service';
import { SalesReportByPrice, SalesReportByQuantity } from '../../store/models/sales-report.model';

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
          return of();
        })
      )
    );
  }
}
