import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { SalesReportService } from '../../../../service/sales-report/sales-report.service';
import { FormsModule } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { CommonComponentModule } from '../../../../common-component/common-component.module';
import { LineGraph } from '../../../../store/models/common.model';

@Component({
  selector: 'app-yearly-report',
  standalone: true,
  imports: [
    CommonModule,
    NzDatePickerModule,
    CommonComponentModule,
    FormsModule,
  ],
  templateUrl: './yearly-report.component.html',
  styleUrl: './yearly-report.component.scss',
  providers: [SalesReportService, DatePipe],
})
export class YearlyReportComponent {
  year: number;
  isAmount: boolean = true;
  totalRevenue: number = 0;
  totalQuantity: number = 0;
  loader: boolean = true;
  yearlySalesReportLineGraph: LineGraph;

  ngOnInit(){}
  onYearChange() {}

  ngOnDestroy(){}
}
