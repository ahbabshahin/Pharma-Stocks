import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzColorPickerModule } from 'ng-zorro-antd/color-picker';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Subject, takeUntil } from 'rxjs';
import { AreaCodeStoreService } from 'src/app/service/area-code/area-code-store.service';
import { CommonService } from 'src/app/service/common/common.service';
import { UserStoreService } from 'src/app/service/user/user-store.service';
import { AreaCode, AreaManager } from 'src/app/store/models/area-code.model';
import { User } from 'src/app/store/models/user.model';

@Component({
	standalone: true,
	selector: 'app-new-area-code',
	templateUrl: './new-area-code.component.html',
	styleUrl: './new-area-code.component.scss',
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,

		NzInputModule,
		NzSelectModule,
		NzButtonModule,
		NzColorPickerModule,
	],
	providers: [AreaCodeStoreService, UserStoreService],
})
export class NewAreaCodeComponent {
	area: AreaCode;
	unsubscribe$ = new Subject<void>();
	form: FormGroup;
	color: string = '#000000';
	users: User[] = [];

	constructor(
		private areaCodeStore: AreaCodeStoreService,
		private formBuilder: FormBuilder,
		private userStore: UserStoreService,
		private commonService: CommonService,
		private drawerRef: NzDrawerRef
	) {}

	ngOnInit() {
		this.initialize();
	}

	initialize() {
		this.initializeForm();
		this.isUsersLoaded();
		this.getUserList();
	}

	initializeForm() {
		this.form = this.formBuilder.group({
			title: ['', [Validators.required]],
			code: ['', [Validators.required, Validators.minLength(3)]],
			manager: ['', [Validators.required]],
			marketingExpense: [''],
			description: [''],
			color: [''],
		});

		if (this.area) {
			this.populateForm();
		}
	}

	populateForm() {
		let manager = this.area?.manager as AreaManager;
		this.form.patchValue({
			...this.area,
			manager: manager?._id,
			color: this.area?.color,
		});

		this.form?.addControl('_id', new FormControl(this.area?._id));
	}

	isUsersLoaded() {
		const { getUserLoaded } = this.userStore;

		getUserLoaded()
			.pipe(takeUntil(this.unsubscribe$))
			.subscribe({
				next: (loaded: boolean) => {
					if (!loaded) {
						this.loadUsers();
					}
				},
			});
	}

	loadUsers() {
		let params = {
			page: 1,
			limit: 100,
		};
		this.userStore.loadUsers(params, false);
	}

	getUserList() {
		const { getUsers } = this.userStore;
		getUsers()
			.pipe(takeUntil(this.unsubscribe$))
			.subscribe({
				next: (res: any) => {
					if (res?.length) {
						this.users = res;
					}
				},
				error: (error) => {},
			});
	}

	onSubmit() {
		this.commonService.presentLoading();
		try {
			console.log('form', this.form.value);
			let payload: AreaCode = this.form.value;
			payload = {
				...payload,
				color: this.color,
				code: payload?.code?.toUpperCase(),
			};
			if (this.area) {
				this.areaCodeStore.updateAreaCode(payload);
			} else this.areaCodeStore.addAreaCode(payload);
			this.drawerRef.close();
		} catch (e) {
			this.commonService.dismissLoading();
		}
	}

	ngOnDestroy() {
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}
}
