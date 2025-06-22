import { Component } from '@angular/core';
import { CommonService } from '../../../service/common/common.service';
import { SubSink } from 'subsink';
import { CustomerStoreService } from '../../../service/customer/customer-store.service';
import { Customer } from '../../../store/models/customer.model';
import { Observable, of } from 'rxjs';
import { AuthStoreService } from '../../../service/auth/auth-store.service';
import { NzDrawerService } from 'ng-zorro-antd/drawer';

type ComponentState = {
  customers: Customer[];
  isAdmin: boolean;
  isMore: boolean;
  total: number;
  searchText: string;
};

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss',
})
export class CustomerComponent {
  subs = new SubSink();
  params = {
    page: 1,
    limit: 10,
    search: '',
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
    private commonService: CommonService,
    private customerStore: CustomerStoreService,
    private authStore: AuthStoreService,
    private drawerService: NzDrawerService
  ) {}

  ngOnInit() {
    this.initialize();
  }

  async initialize() {
    this.componentState = {
      ...this.componentState,
      customers: [],
      isAdmin: false,
      isMore: false,
      total: 0,
      searchText: '',
    };
    this.getLoader();
    this.isCustomerLoaded();
    this.getCustomer();
    await this.isAdminUser();
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

  async isAdminUser() {
    this.componentState = {
      ...this.componentState,
      isAdmin: await this.authStore.isAdminUser(),
    };

  }

  getLoader() {
    const { getCustomerLoader, getCustomerSubLoader } = this.customerStore;
    this.loader = {
      ...this.loader,
      loader$: getCustomerLoader(),
      subLoader$: getCustomerSubLoader(),
    };
  }

  loadCustomer() {
    const { isMore } = this.componentState;
    this.customerStore.loadCustomer(this.params, isMore);
  }

  getCustomer() {
    this.subs.sink = this.customerStore.getCustomers().subscribe({
      next: (res: Customer[]) => {
        this.componentState = {
          ...this.componentState,
          customers: res,
          isMore: false,
        };
      },
      error: () => {
        this.componentState = {
          ...this.componentState,
          isMore: false,
        };
      },
    });
    this.subs.sink = this.customerStore.getCustomerTotal().subscribe({
      next: (total: number) => {
        this.componentState = {
          ...this.componentState,
          total,
        };
      },
      error: () => {},
    });
  }

  async addCustomer(customer?: Customer) {
    const { NewCustomerComponent } = await import(
      './new-customer/new-customer.component'
    );
    this.drawerService.create({
      nzTitle: 'New Customer',
      nzClosable: true,
      nzMaskClosable: false,
      nzWidth: '50%',
      // nzWrapClassName: 'md-drawer',
      nzContent: NewCustomerComponent,
      nzData: { customer },
    });
  }

  async deleteCustomer(customer: Customer) {
    const { name, _id } = customer;
    const ok = await this.commonService.showConfirmModal(
      `Are you sure you want to delete ${name}?`
    );

    if (!ok) return;

    this.commonService.presentLoading();
    this.customerStore.deleteCustomer(_id as string);
  }

  loadMore() {
    const { customers, total } = this.componentState;
    if (customers?.length < total) {
      this.params = {
        ...this.params,
        page: this.params.page + 1,
      };
      this.componentState = {
        ...this.componentState,
        isMore: true,
      };
      this.loadCustomer();
      this.customerStore.setCustomerSubLoader(true);
    }
  }

  onSearch(e: any){
    this.componentState = {
      ...this.componentState,
      searchText: e?.target?.value,
    };
    const { searchText, isMore } = this.componentState;
    this.params = {
      ...this.params,
      page: 1,
      search: searchText,
    }

    // this.loadCustomer();
    if(searchText)
    this.customerStore.searchCustomer(this.params, isMore);
  }

  clearSearch() {
    this.componentState = {
      ...this.componentState,
      searchText: '',
    };
    this.params = {
      ...this.params,
      search: '',
    }

    this.loadCustomer();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
