import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CustomerListComponent } from './customer-list/customer-list.component';

@Component({
  standalone: true,
  selector: 'app-sold-products',
  templateUrl: './sold-products.component.html',
  styleUrl: './sold-products.component.scss',
  imports: [
    CommonModule,
    CustomerListComponent,
  ],
})
export class SoldProductsComponent {}
