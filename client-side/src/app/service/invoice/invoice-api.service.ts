import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from '../../config';
import { Invoice } from '../../store/models/invoice.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvoiceApiService {

  constructor(private http: HttpClient, private env: Config){}

  getInvoices(params: {[key: string]: any}): Observable<Invoice[]>{
    return this.http.get<Invoice[]>(`${this.env.rootURL}/v1/invoice`, {
      params,
    });
  }

  addInvoice(payload: any){
    return this.http.post(`${this.env.rootURL}/invoice`, payload);
  }
}
