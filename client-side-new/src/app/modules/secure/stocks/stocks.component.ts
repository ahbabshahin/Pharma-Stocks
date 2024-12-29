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
  searchText: string = '';

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
    this.getStocks();
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
        console.log('this.stocks: ', this.stocks);
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
      nzData: {stock}
    });
  }

  async deleteStock(id: string){
    const ok = await this.commonService.showConfirmModal('Are you sure you want to delete this product?');
    if (!ok) return;

    this.commonService.presentLoading();
    this.stockStore.deleteStock(id);
  }

  search(){
    console.log('search ', this.searchText);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
