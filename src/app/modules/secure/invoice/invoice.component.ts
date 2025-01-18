import { Component } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NewInvoiceComponent } from './new-invoice/new-invoice.component';
import{ SubSink } from 'subsink';
import { Invoice } from '../../../store/models/invoice.model';
import { InvoiceStoreService } from '../../../service/invoice/invoice-store.service';
import { CustomerStoreService } from '../../../service/customer/customer-store.service';
import { CustomerApiService } from '../../../service/customer/customer-api.service';
import { Observable, of } from 'rxjs';
import { Customer } from '../../../store/models/customer.model';
import { ViewInvoiceComponent } from './view-invoice/view-invoice.component';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss',
})
export class InvoiceComponent {
  subs = new SubSink();
  params = {
    page: 1,
    limit: 10,
    status: 'due',
  };
  loader$: Observable<boolean> = of(true);
  subLoader$: Observable<boolean> = of(false);
  invoices: Invoice[] = [];
  total: number = 0;
  isMore: boolean = false;
  customers: Customer[] = [];

  constructor(
    private drawerService: NzDrawerService,
    private invoiceStoreService: InvoiceStoreService,
    private customerStore: CustomerStoreService,
    private customerApi: CustomerApiService
  ) {}

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.getLoader();
    this.isCustomerLoaded();
    this.getCustomers();
    this.isInvoiceLoaded();
    this.getInvoices();
  }

  loadInvoice() {
    this.invoiceStoreService.loadInvoice(this.params, this.isMore);
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

    this.subs.sink = this.invoiceStoreService.getTotalInvoice().subscribe({
      next: (total: number) => {
        this.total = total;
      },
      error: () => {},
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

  getLoader() {
    this.loader$ = this.invoiceStoreService.getInvoiceLoader();
    this.subLoader$ = this.invoiceStoreService.getInvoiceSubLoader();
  }

  loadCustomer() {
    let params = {
      page: 1,
      limit: 100,
    };
    this.subs.sink = this.customerApi.getCustomers(params).subscribe({
      next: (res: any) => {
        this.customerStore.loadCustomerSuccess(
          res?.body ?? [],
          res?.total ?? 0,
          false
        );
      },
      error: () => {
        this.customerStore.loadCustomerFail('Customer load failed');
      },
    });
  }

  isCustomerLoaded() {
    this.subs.sink = this.customerStore
      .getCustomerLoaded()
      .subscribe((loaded: boolean) => {
        console.log('loaded: ', loaded);
        if (!loaded) {
          this.loadCustomer();
        }
      });
  }

  getCustomers() {
    console.log('customer');
    this.subs.sink = this.customerStore.getCustomers().subscribe({
      next: (res: Customer[]) => {
        console.log('res: ', res);
        this.customers = res;
      },
      error: () => {
        console.log('error');
      },
    });
  }

  addInvoice(invoice?: Invoice) {
    this.drawerService.create({
      nzTitle: 'New Invoice',
      nzClosable: true,
      nzMaskClosable: false,
      nzWidth: '100%',
      nzWrapClassName: 'full-drawer',
      // nzSize: 'large',
      nzContent: NewInvoiceComponent,
      nzData: { invoice, total: this.total },
    });
  }

  viewInvoice(invoice: Invoice) {
    this.drawerService.create({
      nzTitle: 'View Invoice',
      nzClosable: true,
      nzMaskClosable: false,
      nzWidth: '100%',
      nzWrapClassName: 'full-drawer',
      // nzSize: 'large',
      nzContent: ViewInvoiceComponent,
      nzData: { invoice },
    });
  }

  deleteInvoice(list?: Invoice) {}

  loadMore() {
    if (this.invoices?.length < this.total) {
      this.params = {
        ...this.params,
        page: this.params.page + 1,
      };
      this.invoiceStoreService.setSubLoader(true);
      this.isMore = true;
      this.loadInvoice();
    }
  }

  generatePDF() {}

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
