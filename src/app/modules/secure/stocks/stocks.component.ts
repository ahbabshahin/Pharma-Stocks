import { Component } from '@angular/core';
import { StockStoreService } from '../../../service/stocks/stock-store.service';
import { CommonService } from '../../../service/common/common.service';
import { SubSink } from 'subsink';
import { Observable, of } from 'rxjs';
import { Stock } from '../../../store/models/stocks.model';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NewStockComponent } from './new-stock/new-stock.component';
import { AuthStoreService } from '../../../service/auth/auth-store.service';
import { setLoader } from '../../../store/actions/auth.action';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrl: './stocks.component.scss',
})
export class StocksComponent {
  subs = new SubSink();
  loader$: Observable<boolean> = of(true);
  params = {
    page: 1,
    limit: 10,
  };
  stocks: Stock[] = [];
  searchText: string = '';
  total: number = 0;
  subLoader$: Observable<boolean> = of(false);
  isMore: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private stockStore: StockStoreService,
    private commonService: CommonService,
    private drawerService: NzDrawerService,
    private authStore: AuthStoreService
  ) {}

  ngOnInit() {
    this.initialize();
  }

  async initialize() {
    await this.isAdminUser();
    this.getLoader();
    this.isStockLoaded();
    this.getStocks();
    this.getTotalStocks();
  }

  isStockLoaded() {
    this.subs.sink = this.stockStore
      .getStockLoaded()
      .subscribe((loaded: boolean) => {
        if (!loaded) {
          this.loadStock();
        }
      });
  }

  async isAdminUser() {
    console.log('admin');
    this.isAdmin = await this.authStore.isAdminUser();
    console.log('this.isAdmin: ', this.isAdmin);
  }

  getLoader() {
    this.loader$ = this.stockStore.getStockLoader();
    this.subLoader$ = this.stockStore.getStockSubLoader();
  }

  loadStock() {
    this.stockStore.loadStock(this.params, this.isMore);
  }

  getStocks() {
    this.subs.sink = this.stockStore.getStocks().subscribe({
      next: (res: Stock[]) => {
        if (res?.length) this.stocks = res;
        console.log('this.stocks: ', this.stocks);
        if (this.isMore) this.isMore = false;
      },
      error: () => {
        if (this.isMore) this.isMore = false;
      },
    });
  }

  getTotalStocks() {
    this.subs.sink = this.stockStore.getTotalStock().subscribe({
      next: (total: number) => {
        console.log('total: ', total);
        this.total = total;
      },
      error: () => {},
    });
  }

  addStock(stock?: Stock) {
    console.log('stock: ', stock);
    this.drawerService.create({
      nzTitle: 'New Stock',
      nzClosable: true,
      nzMaskClosable: false,
      nzWidth: '50%',
      // nzWrapClassName: 'md-drawer',
      nzContent: NewStockComponent,
      nzData: { stock },
    });
  }

  async deleteStock(id: string) {
    const ok = await this.commonService.showConfirmModal(
      'Are you sure you want to delete this product?'
    );
    if (!ok) return;

    this.commonService.presentLoading();
    this.stockStore.deleteStock(id);
  }

  search() {
    console.log('search ', this.searchText);
    this.searchText = this.searchText?.trim();
    if (this.searchText !== '') {
      let params = {
        query: this.searchText?.trim(),
      };

      this.stockStore.searchStock(params);
    }
  }

  resetSearch() {
    this.searchText = '';
    this.params = {
      ...this.params,
      page: 1,
    };
    this.isMore = false;
    this.loadStock();
  }

  loadMore() {
    if (this.stocks?.length < this.total) {
      this.params = {
        ...this.params,
        page: this.params.page + 1,
      };
      this.stockStore.setStockSubLoader(true);
      this.isMore = true;
      this.loadStock();
    }
  }

  async showLogs(stock: Stock) {
    const { LogComponent } = await import(
      '../../../common-component/log/log.component'
    );
    this.drawerService.create({
      nzTitle: 'Activity Logs',
      nzWidth: '100%',
      nzWrapClassName: 'full-drawer',
      nzContent: LogComponent,
      nzData: {
        logs: stock?.activity_log,
      },
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
