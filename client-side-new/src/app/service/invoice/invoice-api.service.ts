import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Invoice } from '../../store/models/invoice.model';
import { map, Observable } from 'rxjs';
import { Config } from '../../config';

@Injectable()
export class InvoiceApiService {
  constructor(private http: HttpClient, private env: Config) {}

  getInvoices(params: { [key: string]: any }): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.env.rootURL}/v1/invoice`, {
      params,
    });
  }

  addInvoice(payload: Invoice) {
    return this.http.post(`${this.env.rootURL}/v1/invoice`, payload).pipe(map((res: any) => res?.body));
  }

  updateInvoice(payload: Invoice){
    return this.http.patch(
      `${this.env.rootURL}/v1/invoice/${payload?._id}`,
      payload
    ).pipe(map((res: any) => res?.body));
  }
}
