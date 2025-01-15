import { Component } from '@angular/core';
import { Business } from '../../../../store/models/business.model';
import { Customer } from '../../../../store/models/customer.model';
import { Invoice } from '../../../../store/models/invoice.model';
import { CommonService } from '../../../../service/common/common.service';
import { NewInvoiceComponent } from '../new-invoice/new-invoice.component';
import { NzDrawerService } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-view-invoice',
  templateUrl: './view-invoice.component.html',
  styleUrl: './view-invoice.component.scss',
})
export class ViewInvoiceComponent {
  invoice!: Invoice;
  business!: Business;
  customer!: Customer;
  invoiceNumber!: number;
  date!: string;
  invoiceStatus!: string;
  products: any;
  discount!: number;
  totalAmount!: number;

  constructor(
    private commonService: CommonService,
    private drawerService: NzDrawerService
  ) {}

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.getBusiness();
  }

  getBusiness() {
    let business: string = localStorage.getItem('business') as string;
    if (business) this.business = JSON.parse(business);
    else this.commonService.showErrorToast('Business not found');
  }

  calculateProductTotal(product: any): number {
    const quantity = product?.quantity || 0;
    const price = product?.price || 0;
    return quantity * price;
  }

  get subTotalAmount(): number {
    return this.invoice?.products.reduce((total, product) => {
      return total + this.calculateProductTotal(product);
    }, 0);
  }

  updateInvoice() {
    this.drawerService.create({
      nzTitle: 'New Invoice',
      nzClosable: true,
      nzMaskClosable: false,
      nzWidth: '100%',
      nzWrapClassName: 'full-drawer',
      // nzSize: 'large',
      nzContent: NewInvoiceComponent,
      nzData: { invoice: this.invoice },
    });
  }
  printInvoice() {}

  ngOnDestroy(){}
}
