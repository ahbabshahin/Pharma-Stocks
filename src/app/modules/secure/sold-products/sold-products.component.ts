import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import {
  PaymentStatus,
  SalesReportPeriod,
} from '../../../store/models/common.model';
import { FormsModule } from '@angular/forms';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FilterComponent } from '../../../common-component/filter/filter.component';

@Component({
  standalone: true,
  selector: 'app-sold-products',
  templateUrl: './sold-products.component.html',
  styleUrl: './sold-products.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    NzSelectModule,
    NzDatePickerModule,
    NzRadioModule,
    NzAffixModule,

    CustomerListComponent,
    FilterComponent,
  ],
})
export class SoldProductsComponent {
  selectedDate: string;
  navHeight: number = 80;
  period: SalesReportPeriod;
  status: PaymentStatus;

  constructor(){}

  ngOnInit(){}

  initialize(){}


  onPeriodChange() {}
  onDateChange() {}

  onStatusChange() {}
  SalesReportPeriod = SalesReportPeriod;
  Object = Object;

  ngOnDestroy(){}
}
