import { Component, OnInit, OnDestroy } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NewInvoiceComponent } from './new-invoice/new-invoice.component';
import { SubSink } from 'subsink';
import { Invoice } from '../../../store/models/invoice.model';
import { InvoiceStoreService } from '../../../service/invoice/invoice-store.service';
import { CustomerStoreService } from '../../../service/customer/customer-store.service';
import { CustomerApiService } from '../../../service/customer/customer-api.service';
import { Observable, of } from 'rxjs';
import { Customer } from '../../../store/models/customer.model';
import { ViewInvoiceComponent } from './view-invoice/view-invoice.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'], // Fixed styleUrl to styleUrls
})
export class InvoiceComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  params = {
    page: 1,
    limit: 10,
    status: 'due',
  };
  searchParams: {
    page: number;
    limit: number;
    status: string;
    customer?: string;
    startDate?: string;
    endDate?: string;
  } = {
    ...this.params,
    customer: '',
    startDate: '',
    endDate: '',
  };
  startDate: string = '';
  endDate: string = '';
  loader$: Observable<boolean> = of(true);
  subLoader$: Observable<boolean> = of(false);
  invoices: Invoice[] = [];
  total: number = 0;
  isMore: boolean = false;
  customers: Customer[] = [];
  searchText: string = '';

  constructor(
    private drawerService: NzDrawerService,
    private invoiceStoreService: InvoiceStoreService,
    private customerStore: CustomerStoreService,
    private customerApi: CustomerApiService,
    private datePipe: DatePipe
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
        if (res) {
          this.invoices = res;
        }
      },
      error: (error) => {},
    });

    this.subs.sink = this.invoiceStoreService.getTotalInvoice().subscribe({
      next: (total: number) => {
        if (total !== undefined) {
          this.total = total;
        }
      },
      error: (error) => {},
    });
  }

  isInvoiceLoaded() {
    this.subs.sink = this.invoiceStoreService
      .getInvoiceLoaded()
      .subscribe((loaded: boolean) => {
        if (loaded === false) {
          this.invoiceStoreService.setLoader(true);
          this.loadInvoice();
        }
      });
  }

  getLoader() {
    this.loader$ = this.invoiceStoreService.getInvoiceLoader();
    this.subLoader$ = this.invoiceStoreService.getInvoiceSubLoader();
  }

  loadCustomer() {
    const params = {
      page: 1,
      limit: 100,
    };
    this.subs.sink = this.customerApi.getCustomers(params).subscribe({
      next: (res: any) => {
        if (res) {
          this.customerStore.loadCustomerSuccess(
            res?.body ?? [],
            res?.total ?? 0,
            false
          );
        }
      },
      error: (error) => {
        this.customerStore.loadCustomerFail('Customer load failed');
      },
    });
  }

  isCustomerLoaded() {
    this.subs.sink = this.customerStore
      .getCustomerLoaded()
      .subscribe((loaded: boolean) => {
        if (loaded === false) {
          this.loadCustomer();
        }
      });
  }

  getCustomers() {
    this.subs.sink = this.customerStore.getCustomers().subscribe({
      next: (res: Customer[]) => {
        if (res) {
          this.customers = res;
        }
      },
      error: (error) => {},
    });
  }

  addInvoice(invoice?: Invoice) {
    this.drawerService.create({
      nzTitle: 'New Invoice',
      nzClosable: true,
      nzMaskClosable: false,
      nzWidth: '100%',
      nzWrapClassName: 'full-drawer',
      nzContent: NewInvoiceComponent,
      nzData: { invoice, total: this.total },
    });
  }

  viewInvoice(invoice: Invoice) {
    if (invoice) {
      this.drawerService.create({
        nzTitle: 'View Invoice',
        nzClosable: true,
        nzMaskClosable: false,
        nzWidth: '100%',
        nzWrapClassName: 'full-drawer',
        nzContent: ViewInvoiceComponent,
        nzData: { invoice },
      });
    }
  }

  deleteInvoice(list?: Invoice) {
    if (list) {
      // Implement delete functionality
      this.invoiceStoreService.deleteInvoice(list._id as string);
    }
  }

  clearSearch() {
    this.searchText = '';
    this.onSearch('');
    this.searchParams = {
      ...this.searchParams,
      customer: this.searchText,
    };

    this.searchInvoice();
  }

  onSearch(e: any) {
    if (e?.target) {
      this.searchText = e.target.value?.trim();
      this.params = {
        ...this.params,
        page: 1,
      }
      this.searchParams = {
        ...this.searchParams,
        ...this.params,
        customer: this.searchText,
      };
      if (this.startDate == '' && this.endDate == '') {
        delete this.searchParams.startDate;
        delete this.searchParams.endDate;
      }
      this.isMore = false;
      this.searchInvoice();
    }
  }

  searchInvoice() {
    this.invoiceStoreService.setInvoiceLoaded(true);
    this.invoiceStoreService.searchInvoice(this.searchParams, this.isMore);
  }

  formatDate(date: Date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  onDateInputChange() {
    if (this.startDate && this.endDate) {
      this.params = {
        ...this.params,
        page: 1,
      };
      this.searchParams = {
        ...this.searchParams,
        ...this.params,
        startDate: this.startDate,
        endDate: this.endDate,
      };
      if (this.searchText == '') {
        delete this.searchParams.customer;
      }
    } else {
      delete this.searchParams.startDate;
      delete this.searchParams.endDate;
    }
    this.isMore = false;
    this.searchInvoice();
  }

  resetSearch() {
    this.params = {
      ...this.params,
      page: 1,
    };
    this.searchText = '';
    this.startDate = '';
    this.endDate = '';
    this.searchParams = {
      ...this.searchParams,
      ...this.params,
      customer: '',
      startDate: '',
      endDate: '',
    };
    this.isMore = false;
    this.invoiceStoreService.setLoader(true);
    this.loadInvoice();
  }

  loadMore() {
    if (this.invoices?.length < this.total) {
      this.invoiceStoreService.setSubLoader(true);
      this.isMore = true;
      this.params = {
        ...this.params,
        page: this.params.page + 1,
      };
      if (
        this.searchParams?.customer ||
        this.searchParams?.startDate ||
        this.searchParams?.endDate
      ) {
        this.searchParams = {
          ...this.searchParams,
          ...this.params,
        };
        this.searchInvoice();
      } else {

        this.loadInvoice();
      }
    }
  }

  generatePDF() {
    // Implement PDF generation
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
