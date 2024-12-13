import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { Config } from '../../config';
import { Invoice } from '../../store/models/invoice.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvoiceApiService {
  constructor(private http: HttpClient) {}

  getInvoices(params: { [key: string]: any }): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`http://localhost:5000/v1/invoice`, {
      params,
    });
  }

  addInvoice(payload: any) {
    return this.http.post(`http://localhost:5000/v1/invoice`, payload);
  }
}
