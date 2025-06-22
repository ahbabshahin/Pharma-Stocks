import { Injectable } from '@angular/core';
import { Config } from '../../config';
import { HttpClient } from '@angular/common/http';
import { Customer } from '../../store/models/customer.model';
import { map } from 'rxjs';

@Injectable()
export class CustomerApiService {
  constructor(private env: Config, private http: HttpClient) {}

  getCustomers(params: { [key: string]: any }) {
    params = {
      ...params
    }
    for (let x in params) if (params[x] == '') delete params[x];
    return this.http.get(`${this.env.rootURL}/v1/customer`, { params });
  }

  addCustomer(payload: Customer) {
    return this.http.post(`${this.env.rootURL}/v1/customer`, payload).pipe(map((res: any) => res?.body));
  }

  updateCustomer(payload: Customer) {
    return this.http.put(
      `${this.env.rootURL}/v1/customer/${payload?._id}`,
      payload
    ).pipe(map((res: any) => res?.body));
  }

  deleteCustomer(id: string) {
    return this.http.delete(`${this.env.rootURL}/v1/customer/${id}`);
  }

  searchCustomer(params: { [key: string]: any }) {
    return this.http
      .get(`${this.env.rootURL}/v1/customer/search`, { params })
      .pipe(map((res: any) => res?.body));
  }
}
