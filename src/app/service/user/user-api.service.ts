import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from '../../config';
import { EditRolePayload } from '../../store/models/user.model';
import { map } from 'rxjs';

@Injectable()
export class UserApiService {

  constructor(private http: HttpClient, private env: Config) { }

  getUsers(params: {[key: string]: any}){
    return this.http.get(`${this.env.rootURL}/v1/user/all`, { params });
  }

  editRole(payload: EditRolePayload){
    return this.http
      .patch(`${this.env.rootURL}/v1/user/edit-role/${payload?._id}`, payload)
      .pipe(map((res: any) => res?.body));
  }

}
