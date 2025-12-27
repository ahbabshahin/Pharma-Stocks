import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Invoice } from '../../store/models/invoice.model';
import { map, Observable } from 'rxjs';
import { Config } from '../../config';
import { Customer } from 'src/app/store/models/customer.model';

@Injectable()
export class InvoiceApiService {
  constructor(private http: HttpClient, private env: Config) {}

  getInvoices(params: { [key: string]: any }): Observable<Invoice<Customer>[]> {
    return this.http.get<Invoice<Customer>[]>(`${this.env.rootURL}/v1/invoice`, {
      params,
    });
  }

  addInvoice(payload: Invoice<string>) {
    return this.http.post(`${this.env.rootURL}/v1/invoice`, payload).pipe(map((res: any) => res?.body));
  }

  updateInvoice(payload: Invoice<string>){
    return this.http.patch(
      `${this.env.rootURL}/v1/invoice/${payload?._id}`,
      payload
    ).pipe(map((res: any) => res?.body));
  }

  deleteInvoice(id: string){
    return this.http.delete(`${this.env.rootURL}/v1/invoice/${id}`);
  }

  searchInvoice(params: { [key: string]: any }){
    return this.http.get(`${this.env.rootURL}/v1/invoice/search`, {
      params,
    });
  }

  downloadSearchedInvoice(params: { [key: string]: any }){
    return this.http.get(`${this.env.rootURL}/v1/invoice/export/excel`, {
      params,
      responseType: 'blob'
    });
  }
}
