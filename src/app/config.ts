import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class Config {
  // rootURL = 'http://localhost:5000/api';
  rootURL = 'https://pharma-stocks-server.vercel.app/api';
}
