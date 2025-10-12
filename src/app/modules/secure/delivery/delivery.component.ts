import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DeliveryListComponent } from './delivery-list/delivery-list.component';

@Component({
  standalone: true,
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrl: './delivery.component.scss',
  imports: [
    CommonModule,
    DeliveryListComponent,
  ],
})
export class DeliveryComponent {}
