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
import { Customer } from '../../../../store/models/customer.model';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { CustomerStoreService } from '../../../../service/customer/customer-store.service';

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
  business!: Business;
  date: Date = new Date();
  products: Stock[] = [];
  customers: Customer[] = [];
  invoice!: Invoice;
  invoiceForm!: FormGroup;
  customer!: Customer;
  stock!: Stock;

  constructor(
    private formBuilder: FormBuilder,
    private invoiceStore: InvoiceStoreService,
    private commonService: CommonService,
    private customerApi: CustomerApiService,
    private customerStore: CustomerStoreService,
    private stockApi: StockApiService,
    private drawerRef: NzDrawerRef
  ) {}

  ngOnInit(): void {
    this.initialize();
  }

  initialize() {
    this.getCustomers();
    let business: string = localStorage.getItem('business') as string;
    if (business) this.business = JSON.parse(business);
    else this.commonService.showErrorToast('Business not found');
    this.initializeForm();
    if (this.invoice) this.populateForm();
  }

  initializeForm() {
    this.form = this.formBuilder.group({
      customer: ['', [Validators.required]],
      status: ['due', Validators.required],
      products: this.formBuilder.array([]),
      discount: [
        15,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
    });
    this.addProduct();
  }

  populateForm() {
    this.form.patchValue({
      customer: this.invoice?.customer,
      status: this.invoice?.status,
      discount: this.invoice?.discount,
    });

    this.populateProduct();
  }

  get productsFormArray(): FormArray {
    return this.form.get('products') as FormArray;
  }

  addProduct(): void {
    const productGroup = this.formBuilder.group({
      _id: ['', [Validators.required]],
      name: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
    });
    this.productsFormArray.push(productGroup);
  }

  populateProduct() {
    this.invoice?.products.forEach((product) => {
      const productGroup = this.formBuilder.group({
        _id: product?._id,
        name: product?.name,
        quantity: product?.quantity,
        price: product?.price,
      });
      this.productsFormArray.push(productGroup);
    });
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
    let discount =
      (this.subTotalAmount * this.form.get('discount')?.value) / 100;
    return this.subTotalAmount - discount;
  }
  get subTotalAmount(): number {
    return this.productsFormArray.controls.reduce((total, product) => {
      return total + this.calculateProductTotal(product);
    }, 0);
  }

  getCustomers() {
    console.log('customer');
    this.subs.sink = this.customerStore.getCustomers().subscribe({
      next: (res: Customer[]) => {
        console.log('res: ', res);
        this.customers = res;
      },
      error: () => {
        console.log('error');
      },
    });
  }

  searchCustomer(e: any) {
    console.log('e: ', e);
    let searchTerm = e?.target?.value?.trim();
    console.log('searchTerm: ', searchTerm);
    if (searchTerm !== '') {
      let params = {
        name: searchTerm,
      };
      this.subs.sink = this.customerApi
        .searchCustomer(params)
        .subscribe((res: any) => {
          console.log('res: ', res);
          this.customers = res;
        });
    }
  }

  onCustomerSelect(customer: Customer) {
    this.form?.get('customer')?.patchValue(customer?._id);
    this.customer = customer;
  }

  searchProduct(e: any) {
    console.log('e: ', e);
    let searchTerm = e?.target?.value.trim();
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
  }

  onProductSelect(selectedProduct: Stock, index: number): void {
    console.log('selectedProduct: ', selectedProduct);
    console.log('index: ', index);
    this.stock = selectedProduct;
    const productGroup = this.productsFormArray.at(index);
    if (productGroup) {
      this.productsFormArray.at(index).patchValue({
        _id: selectedProduct._id,
        name: selectedProduct?.name,
        price: selectedProduct?.price,
        quantity: 1, // Default to 1 when a product is selected
      });
      console.log(
        'this.productsFormArray.at(index): ',
        this.productsFormArray.at(index)
      );
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Invoice Data:', this.form.value);
      const formRes = this.form.value;
      let payload: Invoice = {
        products: formRes?.products,
        discount: this.taxRate,
        totalAmount: this.subTotalAmount,
        status: formRes?.status,
        customer: formRes?.customer,
      };

      this.commonService.presentLoading();
      if (this.invoice) {
        this.invoiceStore.updateInvoice(payload);
      } else {
        this.invoiceStore.addInvoice(payload);
      }
      this.drawerRef.close();
    } else {
      this.commonService.showWarningModal('Form is invalid');
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
