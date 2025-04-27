import { Injectable } from '@angular/core';
import { Config } from '../../config';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { DailyReportResponse, ProductReportResponse, YearlyReportResponse } from '../../store/models/sales-report.model';

@Injectable({
  providedIn: 'root',
})
export class SalesReportApiService {
  constructor(private http: HttpClient, private env: Config) {}

  getSalesReportByPrice(date: string) {
    return this.http
      .get(`${this.env.rootURL}/v1/sales-report/by-price?date=${date}`)
      .pipe(map((res: any) => res));
  }

  getSalesReportByQuantity(date: string) {
    return this.http
      .get(`${this.env.rootURL}/v1/sales-report/by-quantity?date=${date}`)
      .pipe(map((res: any) => res));
  }

  getDailySalesReport(params: { [key: string]: any }) {
    return this.http
      .get<DailyReportResponse>(`${this.env.rootURL}/v1/sales-report/daily`, {
        params,
      })
      .pipe(map((res: DailyReportResponse) => res));
  }

  getYearlySalesReport(year: number) {
    return this.http
      .get<YearlyReportResponse>(
        `${this.env.rootURL}/v1/sales-report/yearly?year=${year}`
      )
      .pipe(map((res: YearlyReportResponse) => res));
  }

  getProductReport(date: string): Observable<ProductReportResponse> {
    return this.http
      .get<ProductReportResponse>(
        `${this.env.rootURL}/v1/sales-report/product?date=${date}`
      )
      .pipe(map((res: ProductReportResponse) => res));
  }
}
