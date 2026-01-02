import { Component, effect, Signal, untracked } from '@angular/core';
import { Customer } from '../../../../store/models/customer.model';
import { CommonService } from '../../../../service/common/common.service';
import { CustomerStoreService } from '../../../../service/customer/customer-store.service';
import {
	FormBuilder,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { CommonModule } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { AreaCode } from 'src/app/store/models/area-code.model';
import { AreaCodeStoreService } from 'src/app/service/area-code/area-code-store.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
	standalone: true,
	selector: 'app-new-customer',
	templateUrl: './new-customer.component.html',
	styleUrl: './new-customer.component.scss',
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,

		NzInputModule,
		NzButtonModule,
		NzSelectModule,
		NzLayoutModule,
	],
})
export class NewCustomerComponent {
	customer: Customer<AreaCode>;
	form!: FormGroup;
	areaCodes: Signal<AreaCode[]> = toSignal(
		this.areaCodeStore.getAllAreaCodes(),
		{ initialValue: [] }
	);
	isAreaCodeLoaded: Signal<boolean> = toSignal(
		this.areaCodeStore.getAreaCodeLoaded(),
		{ initialValue: false }
	);
	constructor(
		private commonService: CommonService,
		private customerStore: CustomerStoreService,
		private formBuilder: FormBuilder,
		private drawerRef: NzDrawerRef,
		private areaCodeStore: AreaCodeStoreService
	) {
		effect(() => {
			const loaded = this.isAreaCodeLoaded();

			if (!loaded) {
				untracked(() => this.loadAreaCodes());
			}
		});
	}

	ngOnInit() {
		this.initialize();
	}

	initialize() {
		this.initializeForm();
		if (this.customer) this.populateForm();
	}

	initializeForm() {
		this.form = this.formBuilder.group({
			name: ['', [Validators.required, Validators.minLength(2)]],
			contacts: [''],
			email: [''],
			address: ['', [Validators.required, Validators.minLength(3)]],
			areaCode: ['',],
			sn: [this.customerStore.generateSerialNumber()],
			customMessage: [''],
		});
	}

	populateForm() {
		this.form.patchValue({
			...this.customer,
			sn: this.customer?.sn
				? this.customer.sn
				: this.customerStore.generateSerialNumber(),
			areaCode: this.customer?.areaCode?._id,
		});
	}

	onSubmit() {
		let formRes: Customer<string> = this.form?.value;
		let payload: Customer<string> = formRes;

		this.commonService.presentLoading();
		if (this.customer) {
			payload = {
				...this.customer,
				...payload,
			};

			//
			this.customerStore.updateCustomer(payload);
		} else {
			this.customerStore.addCustomer(payload);
		}
		this.drawerRef.close();
	}

	loadAreaCodes() {
		this.areaCodeStore.loadAreaCodes();
	}

	ngOnDestroy() {}
}
