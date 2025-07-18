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
import { BusinessService } from '../../../../service/business/business.service';

@Component({
  selector: 'app-new-invoice',
  templateUrl: './new-invoice.component.html',
  styleUrls: ['./new-invoice.component.scss'],
})
export class NewInvoiceComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  status!: boolean;
  invoiceNumber: number = 1;
  total!: number;
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
    private drawerRef: NzDrawerRef,
    private businessService: BusinessService
  ) {}

  ngOnInit(): void {
    this.initialize();
  }

  initialize() {
    this.getBusiness();
    this.getCustomers();
    this.getTotalInvoice();
    this.initializeForm();

    if (this.invoice) this.populateForm();
  }

  getBusiness() {
    let business = this.businessService.getBusiness();
    if (business) this.business = business;
  }

  initializeForm() {

    this.form = this.formBuilder.group({
      sn: [`SN-${this.total + 1}`],
      customer: ['', [Validators.required]],
      status: ['due', Validators.required],
      products: this.formBuilder.array([]),
      discount: [
        15,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
    });
    if (!this.invoice) this.addProduct();
  }

  populateForm() {
    this.form.patchValue({
      sn: this.invoice?.sn,
      customer: this.invoice?.customer,
      status: this.invoice?.status,
      discount: this.invoice?.discount,
    });
    const customer = this.customers.find(
      (item) => item?._id == this.invoice?.customer
    );

    if (customer) this.customer = customer;
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
      this.calculateProductTotal(productGroup);
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

    this.subs.sink = this.customerStore.getCustomers().subscribe({
      next: (res: Customer[]) => {
        this.customers = res;
      },
      error: () => {

      },
    });
  }

  getTotalInvoice(){
    this.subs.sink = this.invoiceStore.getTotalInvoice().subscribe({
      next: (total: number) => {
        if (total !== undefined) {
          this.total = total;
        }
      },
      error: (error) => {},
    });
  }

  searchCustomer(e: any) {
    let searchTerm = e?.target?.value?.trim();
    if (searchTerm !== '') {
      let params = {
        name: searchTerm,
      };
      this.subs.sink = this.customerApi
        .searchCustomer(params)
        .subscribe((res: any) => {
          this.customers = res;
        });
    }
  }

  onCustomerSelect(customer: Customer) {
    this.form?.get('customer')?.patchValue(customer?._id);
    this.customer = customer;
  }

  searchProduct(e: any) {
    let searchTerm = e?.target?.value.trim();
    // if (searchTerm !== '') {
      let params = {
        query: searchTerm,
      };
      this.subs.sink = this.stockApi
        .searchStock(params)
        .subscribe((res: any) => {
          this.products = res?.body;
        });
    // }
  }

  onProductSelect(selectedProduct: Stock, index: number): void {


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

      const formRes = this.form.value;
      let payload: Invoice = {
        sn: `SN-${this.total + 1}`,
        products: formRes?.products,
        discount: formRes?.discount,
        totalAmount: this.totalAmount,
        status: formRes?.status,
        customer: formRes?.customer,
      };

      this.commonService.presentLoading();
      if (this.invoice) {
        payload = {
          ...payload,
          _id: this.invoice._id,
        }
        this.invoiceStore.updateInvoice(payload);
      } else {
        this.invoiceStore.addInvoice(payload);
      }
      this.drawerRef.close(payload);
    } else {
      this.commonService.showWarningModal('Form is invalid');
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
