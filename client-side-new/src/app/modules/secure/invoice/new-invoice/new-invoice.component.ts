import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { InvoiceStoreService } from '../../../../service/invoice/invoice-store.service';
import { Invoice } from '../../../../store/models/invoice.model';

@Component({
  selector: 'app-new-invoice',
  templateUrl: './new-invoice.component.html',
  styleUrls: ['./new-invoice.component.scss'],
})
export class NewInvoiceComponent implements OnInit, OnDestroy {
  createdAt!: Date;
  status!: boolean;
  invoiceNumber: number = 1;
  taxRate: number = 0.15; // Default tax rate
  form!: FormGroup;
  isDarkTheme = false;
  constructor(
    private formBuilder: FormBuilder,
    private invoiceStore: InvoiceStoreService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    // Add a default product row
    this.initialize();
  }

  initialize() {
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

  get products(): FormArray {
    return this.form.get('products') as FormArray;
  }

  addProduct(): void {
    const productGroup = this.formBuilder.group({
      name: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
    });
    this.products.push(productGroup);
  }

  removeProduct(index: number): void {
    this.products.removeAt(index);
  }

  calculateProductTotal(product: any): number {
    const quantity = product.get('quantity')?.value || 0;
    const price = product.get('price')?.value || 0;
    return quantity * price;
  }

  get totalAmount(): number {
    return this.products.controls.reduce((total, product) => {
      return total + this.calculateProductTotal(product);
    }, 0);
  }

  toggleTheme(): void {
    document.body.classList.toggle('dark-mode');
  }

  generatePDF(): void {
    // PDF generation logic
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

  ngOnDestroy() {}
}
