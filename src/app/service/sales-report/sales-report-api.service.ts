import { Injectable } from '@angular/core';
import { Config } from '../../config';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CustomerWiseSalesReportResponse, DailyReportResponse, ProductReportResponse, SalesSummaryByArea, YearlyReportResponse } from '../../store/models/sales-report.model';
import { CustomerSummaryResponse } from '../../store/models/sold-products.model';

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

  getProductReport(params: {
    [key: string]: any;
  }): Observable<ProductReportResponse> {
    return this.http
      .get<ProductReportResponse>(
        `${this.env.rootURL}/v1/sales-report/product`,
        { params }
      )
      .pipe(map((res: ProductReportResponse) => res));
  }

  getSalesSummaryByAllArea(params: {
    [key: string]: any;
  }): Observable<SalesSummaryByArea> {
    return this.http
      .get<SalesSummaryByArea>(
        `${this.env.rootURL}/v1/sales-report/sales-summary-all-area`,
        { params }
      )
      .pipe(map((res: SalesSummaryByArea) => res));
  }

  getCustomerWiseSalesReport(params: {
    [key: string]: any;
  }): Observable<CustomerWiseSalesReportResponse> {
    return this.http
      .get<CustomerWiseSalesReportResponse>(
        `${this.env.rootURL}/v1/sales-report/customer-sales`,
        { params }
      )
      .pipe(map((res: CustomerWiseSalesReportResponse) => res));
  }

  getCustomerSummaryList(params: {
    [key: string]: any;
  }): Observable<CustomerSummaryResponse> {
    return this.http
      .get<CustomerSummaryResponse>(
        `${this.env.rootURL}/v1/sales-report/customer-summary`,
        { params }
      )
      .pipe(map((res: CustomerSummaryResponse) => res));
  }
}
