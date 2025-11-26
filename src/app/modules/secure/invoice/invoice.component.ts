import { Component, OnInit, OnDestroy } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { SubSink } from 'subsink';
import { Invoice } from '../../../store/models/invoice.model';
import { InvoiceStoreService } from '../../../service/invoice/invoice-store.service';
import { CustomerStoreService } from '../../../service/customer/customer-store.service';
import { CustomerApiService } from '../../../service/customer/customer-api.service';
import { Observable, of } from 'rxjs';
import { Customer } from '../../../store/models/customer.model';
import { DatePipe } from '@angular/common';
import { InvoiceApiService } from '../../../service/invoice/invoice-api.service';
import { CommonService } from '../../../service/common/common.service';

type ComponentState = {
  invoices: Invoice[];
  total: number;
  isMore: boolean;
  customers: Customer[];
  startDate: string;
  endDate: string;
  searchText: string;
};
@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss',
})
export class InvoiceComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  params = {
    page: 1,
    limit: 10,
    status: '',
  };
  searchParams: {
    page: number;
    limit: number;
    status: string;
    search?: string;
    startDate?: string;
    endDate?: string;
  } = {
    ...this.params,
    search: '',
    startDate: '',
    endDate: '',
  };
  componentState: ComponentState;
  loader: {
    loader$: Observable<boolean>;
    subLoader$: Observable<boolean>;
  } = {
    loader$: of(true),
    subLoader$: of(false),
  };

  constructor(
    private drawerService: NzDrawerService,
    private invoiceStoreService: InvoiceStoreService,
    private customerStore: CustomerStoreService,
    private customerApi: CustomerApiService,
    private datePipe: DatePipe,
    private invoiceApi: InvoiceApiService,
    private commonService: CommonService,
  ) {}

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.componentState = {
      ...this.componentState,
      invoices: [],
      customers: [],
      total: 0,
      isMore: false,
      startDate: '',
      endDate: '',
      searchText: '',
    };
    this.getLoader();
    this.isCustomerLoaded();
    this.getCustomers();
    this.isInvoiceLoaded();
    this.getInvoices();
  }

  loadInvoice() {
    if (!this.params.status) this.params.status = '';
    this.invoiceStoreService.loadInvoice(
      this.params,
      this.componentState?.isMore
    );
  }

  getInvoices() {
    this.subs.sink = this.invoiceStoreService.getInvoices().subscribe({
      next: (res: Invoice[]) => {
        if (res) {
          this.componentState = {
            ...this.componentState,
            invoices: res,
          };
        }
      },
      error: (error) => {},
    });

    this.subs.sink = this.invoiceStoreService.getTotalInvoice().subscribe({
      next: (total: number) => {
        if (total !== undefined) {
          this.componentState = {
            ...this.componentState,
            total,
          };
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
    const { getInvoiceLoader, getInvoiceSubLoader } = this.invoiceStoreService;

    this.loader = {
      ...this.loader,
      loader$: getInvoiceLoader(),
      subLoader$: getInvoiceSubLoader(),
    };
  }

  loadCustomer() {
    const params = {
      page: 1,
      limit: 1000,
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
          this.componentState = {
            ...this.componentState,
            customers: res,
          };
        }
      },
      error: (error) => {},
    });
  }

  async addInvoice(invoice?: Invoice) {
    const { NewInvoiceComponent } = await import(
      './new-invoice/new-invoice.component'
    );
    this.drawerService.create({
      nzTitle: 'New Invoice',
      nzClosable: true,
      nzMaskClosable: false,
      nzWidth: '100%',
      nzWrapClassName: 'full-drawer',
      nzContent: NewInvoiceComponent,
      nzData: { invoice, total: this.componentState?.total },
    });
  }

  async viewInvoice(invoice: Invoice) {
    const { ViewInvoiceComponent } = await import(
      './view-invoice/view-invoice.component'
    );
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

  clearSearch() {
    this.componentState = {
      ...this.componentState,
      searchText: '',
    };
    this.onSearch('');
    this.searchParams = {
      ...this.searchParams,
      search: this.componentState?.searchText,
    };

    this.searchInvoice();
  }

  onSearch(e: any) {
    if (e?.target) {
      this.componentState = {
        ...this.componentState,
        searchText: e.target.value?.trim(),
      };
      this.params = {
        ...this.params,
        page: 1,
      };
      this.searchParams = {
        ...this.searchParams,
        ...this.params,
        search: this.componentState?.searchText,
      };
      if (
        this.componentState?.startDate == '' &&
        this.componentState?.endDate == ''
      ) {
        delete this.searchParams.startDate;
        delete this.searchParams.endDate;
      }
      this.componentState = {
        ...this.componentState,
        isMore: false,
      };
      this.searchInvoice();
    }
  }

  searchInvoice() {
    this.invoiceStoreService.setInvoiceLoaded(true);
    this.invoiceStoreService.searchInvoice(
      this.searchParams,
      this.componentState?.isMore
    );
  }

  formatDate(date: Date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  onDateInputChange() {
    if (this.componentState?.startDate && this.componentState?.endDate) {
      this.params = {
        ...this.params,
        page: 1,
      };
      this.searchParams = {
        ...this.searchParams,
        ...this.params,
        startDate: this.componentState?.startDate,
        endDate: this.componentState?.endDate,
      };
      if (this.componentState?.searchText == '') {
        delete this.searchParams.search;
      }
    } else {
      delete this.searchParams.startDate;
      delete this.searchParams.endDate;
    }
    this.componentState = {
      ...this.componentState,
      isMore: false,
    };
    this.searchInvoice();
  }

  resetSearch() {
    this.params = {
      ...this.params,
      page: 1,
      status: '',
    };
    this.searchParams = {
      ...this.searchParams,
      ...this.params,
      search: '',
      startDate: '',
      endDate: '',
      status: '',
    };
    this.componentState = {
      ...this.componentState,
      isMore: false,
      startDate: '',
      endDate: '',
      searchText: '',
    };
    this.invoiceStoreService.setLoader(true);
    this.loadInvoice();
  }

  loadMore() {
    const { invoices, total } = this.componentState;
    if (invoices?.length < total) {
      this.invoiceStoreService.setSubLoader(true);
      this.componentState = {
        ...this.componentState,
        isMore: true,
      };
      this.params = {
        ...this.params,
        page: this.params.page + 1,
      };
      if (
        this.searchParams?.search ||
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

  onStatusChange(status: string) {
    if (status) {
      this.params = {
        ...this.params,
        page: 1,
      };
      this.searchParams = {
        ...this.searchParams,
        ...this.params,
        status,
      };

      if (
        this.componentState?.startDate == '' &&
        this.componentState?.endDate == ''
      ) {
        delete this.searchParams.startDate;
        delete this.searchParams.endDate;
      }

      if (this.componentState.searchText === '')
        delete this.searchParams.search;
      this.invoiceStoreService.setLoader(true);
      this.searchInvoice();
    } else {
      this.invoiceStoreService.setLoader(true);
      this.loadInvoice();
    }
  }

  downloadInvoiceExcel() {
    this.commonService.presentLoading();
    this.invoiceApi.downloadSearchedInvoice(this.searchParams).subscribe({
      next: (file) => {
        try {
          const url = window.URL.createObjectURL(file);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'invoices.xlsx';
          a.click();
          URL.revokeObjectURL(url);
          this.commonService.dismissLoading();
        } catch (e) {
          this.commonService.dismissLoading();
        }
      },
      error: (error) => {
        // this.commonService.presentToast('Something went wrong')
        this.commonService.dismissLoading();
      },
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
