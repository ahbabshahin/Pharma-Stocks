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
    endDate: ''
  };
  dateRange: Date[] = [];
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
    private datePipe: DatePipe,
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
    this.invoiceStoreService.setLoader(true);
    this.invoiceStoreService.loadInvoice(this.params, this.isMore);
  }

  getInvoices() {
    this.subs.sink = this.invoiceStoreService.getInvoices().subscribe({
      next: (res: Invoice[]) => {
        if (res) {
          this.invoices = res;
        }
      },
      error: (error) => {

      },
    });

    this.subs.sink = this.invoiceStoreService.getTotalInvoice().subscribe({
      next: (total: number) => {
        if (total !== undefined) {
          this.total = total;
        }
      },
      error: (error) => {

      },
    });
  }

  isInvoiceLoaded() {
    this.subs.sink = this.invoiceStoreService
      .getInvoiceLoaded()
      .subscribe((loaded: boolean) => {
        if (loaded === false) {
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
      error: (error) => {
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

  onSearch(e: any) {
    if (e?.target) {
      this.searchText = e.target.value?.trim();
        this.searchParams = {
          ...this.params,
          page: 1,
          customer: this.searchText,
        };
        if(this.dateRange.length == 0){
          delete this.searchParams.startDate;
          delete this.searchParams.endDate;
        }
        this.isMore = false;
        this.searchInvoice();

    }
  }

  searchInvoice() {
    this.invoiceStoreService.setInvoiceLoaded(true);
    this.invoiceStoreService.searchInvoice(this.searchParams);
  }

  formatDate(date: Date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  onDateChange(dates: Date[]) {
    if (dates && dates.length === 2) {
      this.dateRange = dates;
      this.searchParams = {
        ...this.searchParams,
        startDate: this.formatDate(dates[0]) as string,
        endDate: this.formatDate(dates[1]) as string,
      }
      if(this.searchText == ''){
        delete this.searchParams.customer;
      }
    } else {
      this.searchParams = {
        ...this.searchParams,
      }
      if(this.dateRange.length == 0){
        delete this.searchParams.startDate;
        delete this.searchParams.endDate;
      }
    }
    this.searchParams = {
      ...this.searchParams,
      page: 1,
    };
    this.isMore = false;
    this.searchInvoice();
  }

  resetSearch() {
    this.params = {
      ...this.params,
      page: 1,
    };
    this.searchText = '';
    this.searchParams = {
      ...this.searchParams,
      page: 1,
      customer: '',
      startDate: '',
      endDate: '',
    };
    this.dateRange = [];
    this.isMore = false;
    this.loadInvoice();
  }

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

  generatePDF() {
    // Implement PDF generation
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
