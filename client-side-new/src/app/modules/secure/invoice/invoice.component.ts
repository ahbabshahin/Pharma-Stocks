import { Component } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NewInvoiceComponent } from './new-invoice/new-invoice.component';
import{ SubSink } from 'subsink';
import { Invoice } from '../../../store/models/invoice.model';
import { InvoiceStoreService } from '../../../service/invoice/invoice-store.service';
import { CustomerStoreService } from '../../../service/customer/customer-store.service';

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
  subs = new SubSink();
  params = {
    page: 1,
    limit: 10,
    status: 'due',
  };
  invoices: Invoice[] = [];

  constructor(
    private drawerService: NzDrawerService,
    private invoiceStoreService: InvoiceStoreService,
    private customerStore: CustomerStoreService
  ) {}

  ngOnInit() {
    this.createdAt = new Date();
    this.status = true;
    this.initialize();
  }

  initialize() {
    this.isCustomerLoaded();
    this.isInvoiceLoaded();
    this.getInvoices();
  }

  loadInvoice() {
    // this.invoiceStoreService.setLoader(true);
    this.invoiceStoreService.loadInvoice(this.params);
  }

  getInvoices() {
    this.subs.sink = this.invoiceStoreService.getInvoices().subscribe({
      next: (res: Invoice[]) => {
        this.invoices = res;
      },
      error: () => {
        console.log('error');
      },
    });
  }

  isInvoiceLoaded() {
    this.subs.sink = this.invoiceStoreService
      .getInvoiceLoaded()
      .subscribe((loaded: boolean) => {
        if (!loaded) {
          this.loadInvoice();
        }
      });
  }

  loadCustomer() {
    let params = {
      page: 1,
      limit: 100,
    };
    this.customerStore.loadCustomer(params, false);
  }

  isCustomerLoaded() {
    this.subs.sink = this.customerStore
      .getCustomerLoaded()
      .subscribe((loaded: boolean) => {
        if (!loaded) {
          this.loadCustomer();
        }
      });
  }

  addInvoice() {
    this.drawerService.create({
      nzTitle: 'New Invoice',
      nzClosable: true,
      nzMaskClosable: false,
      nzWidth: '100%',
      nzWrapClassName: 'full-drawer',
      // nzSize: 'large',
      nzContent: NewInvoiceComponent,
    });
  }

  generatePDF() {}

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
