import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-invoice',
  templateUrl: './new-invoice.component.html',
  styleUrls: ['./new-invoice.component.scss'],
})
export class NewInvoiceComponent implements OnInit, OnDestroy {
  createdAt!: Date;
  status!: boolean;
  totalAmount: number = 0;
  taxRate: number = 0.15; // Default tax rate
  form!: FormGroup;
  isDarkTheme = false;
  constructor(private formBuilder: FormBuilder, private renderer: Renderer2) {}

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.checkTheme();
    this.createdAt = new Date();
    this.status = true;
    this.initializeForm();
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme; // Toggle theme
    const theme = this.isDarkTheme ? 'dark-theme' : 'light-theme';

    // Add/Remove class from body
    if (this.isDarkTheme) {
      this.renderer.addClass(document.body, 'dark-theme');
      this.renderer.removeClass(document.body, 'light-theme');
    } else {
      this.renderer.addClass(document.body, 'light-theme');
      this.renderer.removeClass(document.body, 'dark-theme');
    }

    // Save preference in localStorage
    localStorage.setItem('theme', theme);
  }

  checkTheme() {
    // Retrieve the saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    const theme = savedTheme || (prefersDark ? 'dark-theme' : 'light-theme');

    // Set theme class on body
    if (theme === 'dark-theme') {
      this.isDarkTheme = true;
      this.renderer.addClass(document.body, 'dark-theme');
    } else {
      this.isDarkTheme = false;
      this.renderer.addClass(document.body, 'light-theme');
    }
  }

  get products(): FormArray {
    return this.form.get('products') as FormArray;
  }

  initializeForm() {
    this.form = this.formBuilder.group({
      products: this.formBuilder.array([]),
      taxRate: [this.taxRate, Validators.required],
      totalAmount: [{ value: this.totalAmount, disabled: true }],
      status: [this.status],
      customer: ['', Validators.required],
      createdAt: [this.createdAt],
    });
    this.addProduct();
    this.setupValueChangeHandlers();
  }

  setupValueChangeHandlers() {
    this.products.valueChanges.subscribe(() => this.calculateTotalAmount());
  }

  calculateTotalAmount() {
    const subtotal = this.products.controls.reduce((sum, group) => {
      const quantity = (group.get('quantity')?.value as number) || 0;
      const price = (group.get('price')?.value as number) || 0;
      return sum + quantity * price;
    }, 0);

    this.totalAmount = subtotal + subtotal * this.taxRate;
    this.form.patchValue({ totalAmount: this.totalAmount });
  }

  addProduct() {
    const formGroup = this.formBuilder.group({
      name: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
    });
    this.products.push(formGroup);
  }

  removeProduct(index: number) {
    this.products.removeAt(index);
  }

  onSubmit() {
    if (this.form.invalid) {
      console.error('Form is invalid');
      return;
    }
    console.log('Form Submitted:', this.form.getRawValue());
  }

  generatePDF() {
    console.log('Generating PDF...');
    // Implement PDF generation logic here (e.g., using jsPDF or pdfMake)
  }

  ngOnDestroy() {
    // Cleanup logic if needed
  }
}
