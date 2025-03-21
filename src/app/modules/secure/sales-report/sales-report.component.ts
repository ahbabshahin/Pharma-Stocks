import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CommonComponentModule } from '../../../common-component/common-component.module';
import { ProductReportByPriceComponent } from './product-report-by-price/product-report-by-price.component';
import { ProductReportByQuantityComponent } from './product-report-by-quantity/product-report-by-quantity.component';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormsModule } from '@angular/forms';
import { SalesReportService } from '../../../service/sales-report/sales-report.service';

@Component({
  selector: 'app-sales-report',
  standalone: true,
  imports: [
    CommonModule,
    CommonComponentModule,
    ProductReportByPriceComponent,
    ProductReportByQuantityComponent,
    NzRadioModule,
    FormsModule,
  ],
  templateUrl: './sales-report.component.html',
  styleUrl: './sales-report.component.scss',
  providers: [SalesReportService]
})
export class SalesReportComponent {
  priceQuantity: boolean = true;
}
