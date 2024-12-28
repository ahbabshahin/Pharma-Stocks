import { Component } from '@angular/core';
import { StockStoreService } from '../../../service/stocks/stock-store.service';
import { CommonService } from '../../../service/common/common.service';
import { SubSink } from 'subsink';
import { Observable, of } from 'rxjs';
import { Stock } from '../../../store/models/stocks.model';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NewStockComponent } from './new-stock/new-stock.component';

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

  constructor(
    private stockStore: StockStoreService,
    private commonService: CommonService,
    private drawerService: NzDrawerService,
  ) {}
  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.getLoader();
    this.isStockLoaded();
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

  getLoader() {
    this.loader$ = this.stockStore.getStockLoader();
  }

  loadStock() {
    this.stockStore.loadStock(this.params);
  }

  getStocks() {
    this.subs.sink = this.stockStore.getStocks().subscribe({
      next: (res: Stock[]) => {
        if (res?.length) this.stocks = res;
      },
      error: () => {},
    });
  }

  addStock(stock?: Stock) {
     this.drawerService.create({
      nzTitle: 'New Invoice',
      nzClosable: true,
      nzMaskClosable: false,
      nzWidth: '50%',
      // nzWrapClassName: 'full-drawer',
      nzContent: NewStockComponent,
    });
  }

  ngOnDestroy() {}
}
