import { Component } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NewInvoiceComponent } from './new-invoice/new-invoice.component';
import { InvoiceStoreService } from '../../service/invoice/invoice-store.service';

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

  constructor(
    private drawerService: NzDrawerService,
    private invoiceStoreService: InvoiceStoreService
  ) {}

  ngOnInit() {
    this.createdAt = new Date();
    this.status = true;
    this.initialize();
  }

  initialize(){
    const params = {
      page: 1,
      limit: 10,
      status: 'due',
    };
    this.invoiceStoreService.setLoader(true);
    this.invoiceStoreService.loadInvoice(params)

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
