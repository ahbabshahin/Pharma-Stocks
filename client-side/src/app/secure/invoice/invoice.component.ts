import { Component } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NewInvoiceComponent } from './new-invoice/new-invoice.component';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss',
})
export class InvoiceComponent {
  createdAt!: Date;
  status!: boolean;
  products!: any[];
  totalAmount!: number;
  taxRate!: number;

  constructor(private drawerService: NzDrawerService) {}

  ngOnInit() {
    this.createdAt = new Date();
    this.status = true;
  }

  addInvoice() {
    this.drawerService.create({
      nzTitle: 'New Invoice',
      nzClosable: true,
      nzMaskClosable: false,
      nzSize: 'large',
      nzContent: NewInvoiceComponent,
    });
  }

  generatePDF() {}
}
