import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from '../../config';
import { map, Observable } from 'rxjs';
import { DeliveryResponse } from '../../store/models/delivery.model';

@Injectable()
export class DeliveryApiService {
  constructor(private http: HttpClient, private env: Config) {}

  getDeliveryList(params: {
    [keys: string]: any;
  }): Observable<DeliveryResponse> {
    return this.http
      .get<DeliveryResponse>(`${this.env.rootURL}/v1/delivery`, {params})
      .pipe(map((res: DeliveryResponse) => res));
  }
}
