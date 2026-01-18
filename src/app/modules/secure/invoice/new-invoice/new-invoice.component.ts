import {
    Component,
    OnInit,
    OnDestroy,
    Signal,
    computed,
    Injector,
    effect,
    untracked,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InvoiceStoreService } from '../../../../service/invoice/invoice-store.service';
import { Invoice } from '../../../../store/models/invoice.model';
import { Business } from '../../../../store/models/business.model';
import { CommonService } from '../../../../service/common/common.service';
import { Stock } from '../../../../store/models/stocks.model';
import { Customer } from '../../../../store/models/customer.model';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { CustomerStoreService } from '../../../../service/customer/customer-store.service';
import { BusinessService } from '../../../../service/business/business.service';
import { AuthStoreService } from '../../../../service/auth/auth-store.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { StockStoreService } from 'src/app/service/stocks/stock-store.service';
import { AreaCode } from 'src/app/store/models/area-code.model';
@Component({
	selector: 'app-new-invoice',
	templateUrl: './new-invoice.component.html',
	styleUrls: ['./new-invoice.component.scss'],
})
export class NewInvoiceComponent implements OnInit, OnDestroy {
	status!: boolean;
	invoiceNumber: number = 1;
	form!: FormGroup;
	business!: Business;
	date: Date = new Date();
	// products: Stock[] = [];
	invoice!: Invoice<Customer<AreaCode>>;
	invoiceForm!: FormGroup;
	customer!: Customer<AreaCode>;
	stock!: Stock;

	//signals
	role = toSignal(this.authStore.getUserRole(), { initialValue: '' });
	customers: Signal<Customer<AreaCode>[]> = this.customerStore.customers;
	products: Signal<Stock[]> = this.stockStore.products;
	totalInvoices: Signal<number> = this.invoiceStore.totalInvoice;
	formValues: Signal<Invoice<String>>;
	constructor(
		private formBuilder: FormBuilder,
		private invoiceStore: InvoiceStoreService,
		private commonService: CommonService,
		private customerStore: CustomerStoreService,
		private stockStore: StockStoreService,
		private drawerRef: NzDrawerRef,
		private businessService: BusinessService,
		private authStore: AuthStoreService,
		private injector: Injector
	) {
		effect(() => {
			const formRes = this.formValues?.();
			const customers = this.customers();
			if (!customers) return;
			untracked(() => this.onCustomerSelected());
			if (!formRes) return;
			untracked(() => this.calculateProductTotal());
		});
	}

	ngOnInit(): void {
		this.initialize();
	}

	initialize() {
		this.getBusiness();
		this.initializeForm();

		if (this.invoice) this.populateForm();
	}

	getBusiness() {
		let business = this.businessService.getBusiness();
		if (business) this.business = business;
	}

	getUserRole() {
		// this.subs.sink = this.authStore.getUserRole().subscribe({
		//   next: (role: string) => {
		//     if (role) this.role = role;
		//   },
		// });
	}

	initializeForm() {
		this.form = this.formBuilder.group({
			sn: [`SN-${this.totalInvoices() + 1}`],
			customer: ['', [Validators.required]],
			status: ['due', Validators.required],
			products: this.formBuilder.array([]),
			discount: [
				15,
				[Validators.required, Validators.min(0), Validators.max(100)],
			],
		});
		// if(this.total()){
		// 	this.form?.addControl(
		// 		'sn',
		// 		new FormControl(`SN-${this.total() + 1}`)
		// 	);
		// }
		if (!this.invoice) this.addProduct();

		this.formValues = toSignal(this.form?.valueChanges, {
			initialValue: this.form?.value,
			injector: this.injector,
		});
	}

	populateForm() {
		this.form.patchValue({
			sn: this.invoice?.sn,
			customer: this.invoice?.customer?._id,
			status: this.invoice?.status,
			discount: this.invoice?.discount,
		});
		// const customer = this.customers.find(
		//   (item) => item?._id == this.invoice?.customer
		// );

		if (this.invoice?.customer) {
			this.customer = this.invoice?.customer;
			this.customerStore.setCustomerSearchParams(this.customer?.name);
		}
		this.populateProduct();
	}

	onCustomerSelected = () => {
		const customers = this.customers();
		console.log('customers: ', customers);
		if (!customers?.length || !this.form?.value?.customer) return null;
		let customerSelected = customers.find(
			(item) => item?._id == this.form?.value?.customer
		);
		if (!customerSelected) return null;
		this.customer = customerSelected;
		console.log('this.customer: ', this.customer);
		// this.customerStore.setCustomerSearchParams(this.customer?.name);
		return customerSelected;
	};

	get productsFormArray(): FormArray {
		return this.form.get('products') as FormArray;
	}

	addProduct(): void {
		const productGroup = this.formBuilder.group({
			_id: ['', [Validators.required]],
			name: ['', Validators.required],
			quantity: [1, [Validators.required, Validators.min(1)]],
			price: [0, [Validators.required, Validators.min(0)]],
			tp: [0],
			vat: [0],
			bonus: [0],
			total: [0],
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
				tp: product?.tp || 0,
				vat: product?.vat || 0,
				bonus: product?.bonus || 0,
				total: product?.quantity * (product?.tp + product?.vat) || 0,
			});
			this.productsFormArray.push(productGroup);
			// this.calculateProductTotal(
			// 	productGroup,
			// 	this.productsFormArray?.length - 1
			// );
		});
	}

	removeProduct(index: number): void {
		this.productsFormArray.removeAt(index);
	}

	calculateProductTotal() {
		const products = this.productsFormArray?.controls;
		const discountRate = this.form.get('discount')?.value || 0;

		products.forEach((group) => {
			const price = group.get('price')?.value || 0;
			const qty = group.get('quantity')?.value || 0;

			const discount = (price * discountRate) / 100;
			const priceAfterDiscount = price - discount;
			const total = qty * priceAfterDiscount;

			// Patch values silently
			group.patchValue(
				{
					tp: this.vatCalculation(priceAfterDiscount, 83),
					vat: this.vatCalculation(priceAfterDiscount, 17),
					total,
				},
				{ emitEvent: false }
			); // Important: emitEvent false prevents infinite loops
		});
	}

	// calculateProductTotal(product: any, indx: number): number {
	// 	let productGroup: FormGroup = this.productsFormArray?.at(
	// 		indx
	// 	) as FormGroup;

	// 	const quantity = product.get('quantity')?.value || 0;
	// 	const price = product.get('price')?.value || 0;
	// 	const discount = (price * this.form.get('discount')?.value) / 100;
	// 	let priceAfterDiscount = price - discount;
	// 	const subtotal = quantity * priceAfterDiscount;
	// 	const total = subtotal;

	// 	productGroup.patchValue({
	// 		...productGroup.value,
	// 		tp: this.vatCalculation(priceAfterDiscount, 83),
	// 		vat: this.vatCalculation(priceAfterDiscount, 17),
	// 	});
	// 	return total;
	// }

	calculateProductSubTotal(product: any): number {
		const quantity = product.get('quantity')?.value || 0;
		const price = product.get('price')?.value || 0;
		return quantity * price;
	}

	totals = computed(() => {
		const formRes = this.formValues?.();
		const products = formRes?.products || [];
		const discountPercent = formRes?.discount || 0;

		const subTotal = products.reduce(
			(acc: number, p: any) => acc + p.quantity * p.price,
			0
		);
		const discountAmount = (subTotal * discountPercent) / 100;

		return {
			subTotal,
			total: subTotal - discountAmount,
			discountAmount,
		};
	});

	// get totalAmount(): number {
	// 	let discount =
	// 		(this.subTotalAmount * this.form.get('discount')?.value) / 100;
	// 	return this.subTotalAmount - discount;
	// 	// return this.subTotalAmount;
	// }
	// get subTotalAmount(): number {
	// 	return this.productsFormArray.controls.reduce(
	// 		(total, product, indx: number) => {
	// 			this.calculateProductTotal(product, indx);
	// 			return total + this.calculateProductSubTotal(product);
	// 		},
	// 		0
	// 	);
	// }

	searchCustomer(search: string) {
		this.customerStore.setCustomerSearchParams(search);
	}

	onCustomerSelect(customer: Customer<AreaCode>) {
		this.form?.get('customer')?.patchValue(customer?._id);
		this.customer = customer;
	}

	searchProduct(e: any) {
		let searchTerm = e?.target?.value.trim();
		this.stockStore.setStockSearchParams(searchTerm);
	}

	vatCalculation(price: number, percentage: number): number {
		return (price * percentage) / 100;
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
			// this.calculateProductTotal(productGroup, index);
			productGroup
				.get('quantity')
				?.addValidators([Validators.max(this.stock?.quantity)]);
		}
	}

	onSubmit(): void {
		if (this.form.valid) {
			const formRes = this.form.value;
			let payload: Invoice<string> = {
				sn: `SN-${this.totalInvoices() + 1}`,
				products: formRes?.products,
				discount: formRes?.discount,
				totalAmount: this.totals()?.total,
				status: formRes?.status,
				customer: formRes?.customer,
			};

			this.commonService.presentLoading();
			if (this.invoice) {
				payload = {
					...payload,
					_id: this.invoice._id,
				};
				this.invoiceStore.updateInvoice(payload);
			} else {
				this.invoiceStore.addInvoice(payload);
			}
			this.drawerRef.close(payload);
		} else {
			this.commonService.showWarningModal('Form is invalid');
		}
	}

	info() {
		this.commonService.showInfoModal(
			this.customer?.customMessage as string
		);
	}

	ngOnDestroy() {}
}
