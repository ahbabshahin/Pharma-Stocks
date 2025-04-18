import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';

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
  listOfColumn = [
    {
      title: 'Name',
      compare: (a: DataItem, b: DataItem) => a.name.localeCompare(b.name),
      priority: false,
    },
    {
      title: 'Chinese Score',
      compare: (a: DataItem, b: DataItem) => a.chinese - b.chinese,
      priority: 3,
    },
    {
      title: 'Math Score',
      compare: (a: DataItem, b: DataItem) => a.math - b.math,
      priority: 2,
    },
    {
      title: 'English Score',
      compare: (a: DataItem, b: DataItem) => a.english - b.english,
      priority: 1,
    },
  ];
  listOfData: DataItem[] = [
    {
      name: 'John Brown',
      chinese: 98,
      math: 60,
      english: 70,
    },
    {
      name: 'Jim Green',
      chinese: 98,
      math: 66,
      english: 89,
    },
    {
      name: 'Joe Black',
      chinese: 98,
      math: 90,
      english: 70,
    },
    {
      name: 'Jim Red',
      chinese: 88,
      math: 99,
      english: 89,
    },
  ];
}
