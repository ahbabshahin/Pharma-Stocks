import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CommonComponentModule } from '../../../../common-component/common-component.module';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormsModule } from '@angular/forms';
import { BarGraph } from '../../../../store/models/common.model';
import { SalesReportService } from '../../../../service/sales-report/sales-report.service';

@Component({
  selector: 'app-product-report-by-quantity',
  standalone: true,
  imports: [
    CommonModule,
    CommonComponentModule,
    NzDatePickerModule,
    NzRadioModule,
    FormsModule,
  ],
  templateUrl: './product-report-by-quantity.component.html',
  styleUrl: './product-report-by-quantity.component.scss',
})
export class ProductReportByQuantityComponent {
  loader: boolean = true;
  barGraph: BarGraph;
  selectedDate: Date = new Date();
  radioValue: number = 0;
  formattedDate: string = '';
  totalQuantity: number = 0;
  constructor(private salesReport: SalesReportService) {}

  ngOnInit() {}

  onDateChange() {}

  ngOnDestroy() {}
}
