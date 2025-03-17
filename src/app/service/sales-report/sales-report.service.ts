import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SalesReportService {
  constructor(private datePipe: DatePipe,) {}

  formatSelectedDate(selectedDate: Date): string {
   let formattedDate: string =
      this.datePipe.transform(selectedDate, 'yyyy-MM-01') || '';
    // this.getProductReportByPrice();
    return formattedDate;
  }
}
