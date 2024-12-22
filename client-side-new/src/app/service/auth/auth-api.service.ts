import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from '../../config';
import { LoginCred, RegisterCred } from '../../store/models/user.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  constructor(private http: HttpClient, private env: Config) {}

  login(payload: LoginCred) {
    return this.http.post(`${this.env.rootURL}/v1/auth/login`, payload);
  }

  register(payload: RegisterCred) {
    return this.http.post(`${this.env.rootURL}/v1/auth/register`, payload);
  }

  logout(accessToken: string){
    return this.http.post(`${this.env.rootURL}/v1/auth/logout`, accessToken);
  }

  getUser(id: string){
    return this.http
      .get(`${this.env.rootURL}/v1/auth/user/${id}`)
      .pipe(map((res: any) => res?.body));
  }
}
