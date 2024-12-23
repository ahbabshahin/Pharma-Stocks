import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class Config {
  rootURL: string = 'http://localhost:5000';
}
