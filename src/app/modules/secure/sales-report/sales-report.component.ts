import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CommonComponentModule } from '../../../common-component/common-component.module';
import { ProductReportByPriceComponent } from './product-report-by-price/product-report-by-price.component';

@Component({
  selector: 'app-sales-report',
  standalone: true,
  imports: [CommonModule, CommonComponentModule, ProductReportByPriceComponent],
  templateUrl: './sales-report.component.html',
  styleUrl: './sales-report.component.scss'
})
export class SalesReportComponent {

}
