import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from '../../config';
import { Stock } from '../../store/models/stocks.model';
import { map } from 'rxjs';

@Injectable()
export class StockApiService {
  constructor(private http: HttpClient, private env: Config) {}

  getStocks(params: { [key: string]: any }) {
    return this.http.get(`${this.env.rootURL}/v1/stock`, { params });
  }

  addStock(payload: Stock) {
    return this.http.post(`${this.env.rootURL}/v1/stock`, payload).pipe(map((res: any) => res?.body));
  }

  updateStock(payload: Stock) {
    return this.http
      .patch(`${this.env.rootURL}/v1/stock/product/${payload?._id}`, payload)
      .pipe(map((res: any) => res?.body));
  }

  deleteStock(id: string) {
    return this.http.delete(`${this.env.rootURL}/v1/stock/${id}`);
  }

  searchStock(params: { [key: string]: any }) {
    return this.http.get(`${this.env.rootURL}/v1/stock/search`, { params });
  }
}
