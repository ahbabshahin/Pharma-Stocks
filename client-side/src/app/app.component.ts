import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { StockState } from './store/reducers/stock.reducer';
import { setLoader } from './store/actions/stock.action';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private store: Store<StockState>){}
  ngOnInit(){
    this.store.dispatch(setLoader({status: true}))
  }
}
