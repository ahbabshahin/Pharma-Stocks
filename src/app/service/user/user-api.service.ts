import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from '../../config';

@Injectable()
export class UserApiService {

  constructor(private http: HttpClient, private env: Config) { }

  getUsers(params: {[key: string]: any}){
    return this.http.get(`${this.env.rootURL}/v1/user/all`, { params });
  }


}
