import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
@Injectable({
  providedIn: 'root',
})
export class Config {
  // rootURL = 'http://localhost:5000/api';
  rootURL: string = '';

  constructor(private http: HttpClient) {}
  async loadConfig(): Promise<void> {
    try {
      const config = await lastValueFrom(
        this.http.get<any>('assets/config.json')
      );
      this.rootURL = config.rootURL;
    //   this.rootURL = config.local;
    } catch (error) {
      console.error('Error loading config.json:', error);
      // Fallback URL if config.json fails to load
      this.rootURL = 'https://fallback-url.com/api';
    }
  }
  // rootURL = 'https://pharma-stocks-server.vercel.app/api';
}
