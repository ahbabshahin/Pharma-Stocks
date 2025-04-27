import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { SalesReportStoreService } from '../../../../service/sales-report/sales-report-store.service';
import { SubSink } from 'subsink';
import { ProductReport } from '../../../../store/models/sales-report.model';
import { Observable, of } from 'rxjs';
import { NzButtonModule } from 'ng-zorro-antd/button';

interface DataItem {
  name: string;
  chinese: number;
  math: number;
  english: number;
}
@Component({
  selector: 'app-product-report-table',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzButtonModule,],
  templateUrl: './product-report-table.component.html',
  styleUrl: './product-report-table.component.scss',
})
export class ProductReportTableComponent {
  subs = new SubSink();
  listOfColumn = [
    {
      title: 'Name',
      compare: (a: ProductReport, b: ProductReport) =>
        a.product.localeCompare(b.product),
      priority: false,
    },
    {
      title: 'Quantity',
      compare: (a: ProductReport, b: ProductReport) =>
        a.totalQuantity - b.totalQuantity,
      priority: 2,
    },
    {
      title: 'Price',
      compare: (a: ProductReport, b: ProductReport) => a.price - b.price,
      priority: 1,
    },
    {
      title: 'Discount',
      compare: (a: ProductReport, b: ProductReport) => a.discount - b.discount,
      priority: 2,
    },
    {
      title: 'Total Revenue',
      compare: (a: ProductReport, b: ProductReport) =>
        a.totalRevenue - b.totalRevenue,
      priority: 1,
    },
  ];
  productReport$: Observable<ProductReport[]> = of([]);
  productReport: ProductReport[] = [];

  constructor(private salesReportStore: SalesReportStoreService) {}

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.getProductReport();
  }

  getProductReport() {
    this.productReport$ = this.salesReportStore.getProductReport();
    this.getProductReportValue();
  }

  getProductReportValue(){
    this.subs.sink = this.productReport$.subscribe((res: ProductReport[]) =>{
      this.productReport = res;
    })
  }

  csvDownload() {
      if (!this.productReport || !this.productReport.length) {
        console.error('No this.productReport provided for CSV export.');
        return;
      }
      // Extract the headers
      const headers = Object.keys(this.productReport[0]);
      const formattedHeaders = headers.map(header => header.charAt(0).toUpperCase() + header.slice(1));
      const {month, year} = this.productReport[0]
      let filename: string = `Product report of ${month} ${year}`;

      // Build CSV rows
      const csvRows = [
        formattedHeaders.join(','), // Header row
        ...this.productReport.map(row =>
          headers.map(fieldName => {
            const value = (row as any)[fieldName];
            if (typeof value === 'string') {
              return `"${value.replace(/"/g, '""')}"`; // Escape quotes
            }
            return value ?? '';
          }).join(',')
        )
      ];

      // Combine into single CSV string
      const csvString = csvRows.join('\r\n');

      // Create a Blob with CSV content
      const blob = new Blob([csvString], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);

      // Create a hidden download link
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', filename);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
