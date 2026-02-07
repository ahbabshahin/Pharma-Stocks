import { CommonModule } from '@angular/common';
import { Component, effect, signal, Signal, untracked } from '@angular/core';
import {
	FormBuilder,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { ExpenseService } from 'src/app/service/expense/expense.service';
import {
	ExpenseType,
	ExpenseTypeSelector,
	NewExpense,
} from 'src/app/store/models/expense.model';

@Component({
	standalone: true,
	selector: 'app-new-expense',
	templateUrl: './new-expense.component.html',
	styleUrl: './new-expense.component.scss',
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,

		NzInputModule,
		NzButtonModule,
		NzSelectModule,
		NzSpinModule,
	],
})
export class NewExpenseComponent {
	expenseService: ExpenseService;
	form: FormGroup;
	expenseTypes: string[] = Object.values(ExpenseTypeSelector);
	type: ExpenseType;
	expenseReasons: string[] = [];
	addloader: Signal<boolean>;
	error: Signal<string>;

	isSubmitted = signal<boolean>(false);

	constructor(
		private formBuilder: FormBuilder,
		private drawerRef: NzDrawerRef,
	) {
		effect(() => this.getError());
	}
	ngOnInit() {
		this.initialize();
	}

	initialize() {
		this.expenseReasons = this.expenseService.getExpenseReasons();
		this.addloader = this.expenseService.addLoader;
		this.error = this.expenseService.error;
		this.initializeForm();
	}

	initializeForm() {
		this.form = this.formBuilder.group({
			type: [this.expenseTypes[0], [Validators.required]],
			amount: [0, [Validators.required, Validators.min(1)]],
			description: [''],
			expenseReason: [this.expenseReasons[0], [Validators.required]],
		});
	}

	onSubmit() {
		// this.expenseService.addExpense();
		const payload: NewExpense = this.form.value;

		this.expenseService.addExpense(payload);
		this.isSubmitted.set(true);
	}

	getError() {
		const error: string = this.error();
		const loader: boolean = this.addloader();

		if (!error && !loader && this.isSubmitted()) {
			untracked(() => this.isSubmitted.set(false));
			this.drawerRef.close();
		}
	}

	ngOnDestroy() {}
}
