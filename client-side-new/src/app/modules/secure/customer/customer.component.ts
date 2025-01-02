import { Component } from '@angular/core';
import { CommonService } from '../../../service/common/common.service';
import { SubSink } from 'subsink';
import { CustomerStoreService } from '../../../service/customer/customer-store.service';
import { Customer } from '../../../store/models/customer.model';
import { Observable, of } from 'rxjs';
import { AuthStoreService } from '../../../service/auth/auth-store.service';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NewCustomerComponent } from './new-customer/new-customer.component';

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
  };
  customers: Customer[] = [];
  loader$: Observable<boolean> = of(true);
  subLoader$: Observable<boolean> = of(false);
  isAdmin$: Observable<boolean> = of(false);
  isMore: boolean = false;
  total: number = 0;

  constructor(
    private commonService: CommonService,
    private customerStore: CustomerStoreService,
    private authStore: AuthStoreService,
    private drawerService: NzDrawerService
  ) {}

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.isAdminUser();
    this.getLoader();
    this.isCustomerLoaed();
    this.getCustomer();
  }

  isCustomerLoaed() {
    this.subs.sink = this.customerStore
      .getCustomerLoaded()
      .subscribe((loaded: boolean) => {
        if (!loaded) {
          this.loadCustomer();
        }
      });
  }

  async isAdminUser() {
    console.log('admin');
    this.isAdmin$ = this.authStore.isAdminUser();
    console.log('this.isAdmin: ', this.isAdmin$);
  }

  getLoader() {
    this.loader$ = this.customerStore.getCustomerLoader();
    this.subLoader$ = this.customerStore.getCustomerSubLoader();
  }

  loadCustomer() {
    this.customerStore.loadCustomer(this.params, this.isMore);
  }

  getCustomer() {
    this.subs.sink = this.customerStore.getCustomers().subscribe({
      next: (res: Customer[]) => {
        this.customers = res;
        if(this.isMore) this.isMore = false;
      },
      error: () => {
        if (this.isMore) this.isMore = false;
      },
    });
    this.subs.sink = this.customerStore
      .getCustomerTotal()
      .subscribe({next:(total: number) => {
        this.total = total;
      },
    error: () => {}
    });
  }

  addCustomer(customer?: Customer) {
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
    const ok = await this.commonService.showConfirmModal(
      `Are you sure you want to delete ${customer?.name}?`
    );

    if (!ok) return;

    this.commonService.presentLoading();
    this.customerStore.deleteCustomer(customer._id as string);
  }

  loadMore(){
    if(this.customers?.length < this.total){
      this.params = {
        ...this.params,
        page: this.params.page + 1
      }
      this.isMore = true;
      this.loadCustomer();
      this.customerStore.setCustomerSubLoader(true);
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
