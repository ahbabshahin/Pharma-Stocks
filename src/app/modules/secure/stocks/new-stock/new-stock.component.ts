import { Component } from '@angular/core';
import { Stock } from '../../../../store/models/stocks.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StockStoreService } from '../../../../service/stocks/stock-store.service';
import { CommonService } from '../../../../service/common/common.service';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-new-stock',
  templateUrl: './new-stock.component.html',
  styleUrl: './new-stock.component.scss'
})
export class NewStockComponent {
  stock!: Stock;
  form!: FormGroup;
  isAdmin: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private stockStore: StockStoreService,
    private commonService: CommonService,
    private drawerRef: NzDrawerRef,
  ){}

  ngOnInit(){
    this.initialize();
  }

  initialize(){
    this.initializeForm();
    if(this.stock){
      this.populateForm();
    }
  }


  initializeForm(){
    this.form = this.formBuilder.group({
      name: ['', [Validators?.required]],
      quantity: [null, [Validators?.required]],
      price: [null, [Validators?.required]],
	  purchasePrice: [0],
      brand: ['', [Validators?.required]],
      dosage: ['', [Validators?.required]],
      lowStockThreshold: [10, [Validators?.required]],
    });
  }

  populateForm(){
    this.form.patchValue({
      ...this.stock
    });
  }

  onSubmit(){
    if (this.form?.valid) {
      this.commonService.presentLoading();

      const formRes: Stock = this.form?.value;
      let payload: Stock = {
        ...formRes,
      };

      if (this.stock) {
        payload = {
          ...payload,
          _id: this.stock._id,
        };

        this.stockStore.updateStock(payload);
      }else{
        this.stockStore.addStock(payload);
      }

      this.drawerRef.close();
    }else{
      this.commonService.showWarningModal('Please fill all the fields');
    }
  }

  ngOnDestroy(){}
}
