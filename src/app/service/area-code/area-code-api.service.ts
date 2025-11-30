import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from '../../config';
import { map, Observable } from 'rxjs';
import { AreaCode } from '../../store/models/area-code.model';

@Injectable()
export class AreaCodeApiService {
  constructor(private http: HttpClient, private env: Config) {}

  getAllAreaCode(): Observable<AreaCode[]> {
    return this.http
      .get(`${this.env.rootURL}/v1/area-code`)
      .pipe(map((res: any) => res?.body));
  }

  addAreaCode(payload: AreaCode): Observable<AreaCode> {
    return this.http
      .post<AreaCode>(`${this.env.rootURL}/v1/area-code`, payload)
      .pipe(map((res: any) => res?.body));
  }

  updateAreaCode(payload: AreaCode): Observable<AreaCode> {
    return this.http
      .post<AreaCode>(`${this.env.rootURL}/v1/area-code/${payload?._id}`, payload)
      .pipe(map((res: any) => res?.body));
  }

  deleteAreaCode(id: string) {
    return this.http
      .delete(`${this.env.rootURL}/v1/area-code/${id}`);
  }
}
