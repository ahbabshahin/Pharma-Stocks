import { CommonModule } from '@angular/common';
import { Component, signal, Signal } from '@angular/core';
import { LoaderComponent } from 'src/app/common-component/loader/loader.component';
import { NoDataComponent } from 'src/app/common-component/no-data/no-data.component';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { Expense } from 'src/app/store/models/expense.model';
import { ExpenseService } from 'src/app/service/expense/expense.service';
import { ExpenseApiService } from 'src/app/service/expense/expense-api.service';

@Component({
	standalone: true,
	selector: 'app-expense',
	templateUrl: './expense.component.html',
	styleUrl: './expense.component.scss',
	imports: [
		CommonModule,
		LoaderComponent,
		NoDataComponent,
		ExpenseListComponent,
	],
	providers: [ExpenseApiService, ExpenseService],
})
export class ExpenseComponent {
	expenseList: Signal<Expense[]> = this.expenseService.expenseList;
	loader: Signal<boolean> = this.expenseService.loader;
	loaded: Signal<boolean> = this.expenseService.loaded;
	error: Signal<string> = this.expenseService.error;

	params = signal<{ params: { [keys: string]: any } }>(null as any);

	constructor(private expenseService: ExpenseService) {}

	ngOnInit() {
		this.initialize();
	}

	initialize() {
		if (!this.loaded()) {
			this.params.update((value) => ({
				...value,
				page: 1,
				limit: 10,
			}));
			this.loadExpense();
		}
	}
	loadExpense() {
		this.expenseService.loadExpense(this.params());
	}
}
