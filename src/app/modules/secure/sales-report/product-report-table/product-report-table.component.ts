import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { SalesReportStoreService } from '../../../../service/sales-report/sales-report-store.service';
import { SubSink } from 'subsink';
import { ProductReport } from '../../../../store/models/sales-report.model';
import { Observable, of } from 'rxjs';

interface DataItem {
  name: string;
  chinese: number;
  math: number;
  english: number;
}
@Component({
  selector: 'app-product-report-table',
  standalone: true,
  imports: [CommonModule, NzTableModule],
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

  constructor(private salesReportStore: SalesReportStoreService) {}

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.getProductReport();
  }

  getProductReport() {
    this.productReport$ = this.salesReportStore.getProductReport();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
