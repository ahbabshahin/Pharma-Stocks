import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InvoiceStoreService } from '../../../../service/invoice/invoice-store.service';
import { Invoice } from '../../../../store/models/invoice.model';
import { Business } from '../../../../store/models/business.model';
import { CommonService } from '../../../../service/common/common.service';
import { Stock } from '../../../../store/models/stocks.model';
import { StockApiService } from '../../../../service/stocks/stock-api.service';
import { SubSink } from 'subsink';
import { CustomerApiService } from '../../../../service/customer/customer-api.service';

@Component({
  selector: 'app-new-invoice',
  templateUrl: './new-invoice.component.html',
  styleUrls: ['./new-invoice.component.scss'],
})
export class NewInvoiceComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  status!: boolean;
  invoiceNumber: number = 1;
  taxRate: number = 0.15; // Default tax rate
  form!: FormGroup;
  isDarkTheme = false;
  business!: Business;
  date: Date = new Date();
  nzFilterOption = (): boolean => false;
  products: Stock[] = [];
  selectedValue!: Stock;
  selectedCustomer: any = null;
  constructor(
    private formBuilder: FormBuilder,
    private invoiceStore: InvoiceStoreService,
    private commonService: CommonService,
    private customerApi: CustomerApiService,
    private stockApi: StockApiService
  ) {}

  ngOnInit(): void {
    this.initialize();
  }

  initialize() {
    let business: string = localStorage.getItem('business') as string;
    if (business) this.business = JSON.parse(business);
    else this.commonService.showErrorToast('Business not found');
    this.initializeForm();
  }

  initializeForm() {
    this.form = this.formBuilder.group({
      customer: ['', [Validators.required]],
      status: ['due', Validators.required],
      products: this.formBuilder.array([]),
    });
    this.addProduct();
  }

  get productsFormArray(): FormArray {
    return this.form.get('products') as FormArray;
  }

  addProduct(): void {
    const productGroup = this.formBuilder.group({
      name: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
    });
    this.productsFormArray.push(productGroup);
  }

  removeProduct(index: number): void {
    this.productsFormArray.removeAt(index);
  }

  calculateProductTotal(product: any): number {
    const quantity = product.get('quantity')?.value || 0;
    const price = product.get('price')?.value || 0;
    return quantity * price;
  }

  get totalAmount(): number {
    return this.productsFormArray.controls.reduce((total, product) => {
      return total + this.calculateProductTotal(product);
    }, 0);
  }

  toggleTheme(): void {
    document.body.classList.toggle('dark-mode');
  }

  searchCustomer(e: any) {
    console.log('e: ', e);
    let searchTerm = e.trim();
    if (searchTerm !== '') {
      let params = {
        name: e,
      };
      this.subs.sink = this.customerApi
        .searchCustomer(params)
        .subscribe((res: any) => {
          console.log('res: ', res);
          this.products = res?.body;
        });
    }
  }

  searchProduct(e: any, indx: number) {
    console.log('e: ', e);
    let searchTerm = e.trim();
    if (searchTerm !== '') {
      let params = {
        query: e,
      };
      this.subs.sink = this.stockApi
        .searchStock(params)
        .subscribe((res: any) => {
          console.log('res: ', res);
          this.products = res?.body;
        });
    }
    //  this.productsFormArray?.controls[indx]?.value;
    console.log(
      'this.productsFormArray?.controls[indx]?.value: ',
      this.productsFormArray?.controls[indx]?.value?.name
    );

    if(this.productsFormArray?.controls[indx]?.value?.name) this.onProductSelect(
      this.productsFormArray?.controls[indx]?.value?.name,
      indx
    );
  }

  onProductSelect(selectedProduct: Stock, index: number): void {
    console.log('selectedProduct: ', selectedProduct);
    console.log('index: ', index);
    const productGroup = this.productsFormArray.at(index);
    if (productGroup) {
      this.productsFormArray.at(index).patchValue({
        name: selectedProduct?.name,
        price: selectedProduct?.price,
        quantity: 1, // Default to 1 when a product is selected
      });
      console.log('this.productsFormArray.at(index): ', this.productsFormArray.at(index));
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Invoice Data:', this.form.value);
      const formRes = this.form.value;
      let payload: Invoice = {
        products: formRes?.products,
        taxRate: this.taxRate,
        totalAmount: this.totalAmount,
        status: formRes?.status,
        customer: formRes?.customer,
      };

      this.invoiceStore.addInvoice(payload);
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
