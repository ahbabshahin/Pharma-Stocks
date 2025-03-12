import { Injectable } from '@angular/core';
import { Config } from '../../config';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesReportApiService {

  constructor(private http: HttpClient, private env: Config) { }

  getSalesReportByPrice(){
    return this.http
      .get(`${this.env.rootURL}/v1/sales-report/by-price`)
      .pipe(map((res: any) => res?.body));
  }

  getDailySalesReport(date: string){
    return this.http
      .get(`${this.env.rootURL}/v1/sales-report/daily?date=${date}`)
      .pipe(map((res: any) => res?.body));
  }
}
