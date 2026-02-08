import { CommonModule } from '@angular/common';
import { Component, effect, input, output } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { LoaderComponent } from 'src/app/common-component/loader/loader.component';
import { Expense, ExpenseType } from 'src/app/store/models/expense.model';

@Component({
	standalone: true,
	selector: 'app-expense-list',
	templateUrl: './expense-list.component.html',
	styleUrl: './expense-list.component.scss',
	imports: [
		CommonModule,
		LoaderComponent,

		NzIconModule,
		NzButtonModule,
	],
})
export class ExpenseListComponent {
	expenseList = input<Expense[]>();
	loader = input<boolean>();
	type = input<string>();
	ExpenseType = ExpenseType;

	onDeleteExpense = output<Expense>();
	onUpdateExpense = output<Expense>();
	selectedIndx: number = -1;

	constructor(){
		effect(() =>{
			const loader: boolean = this.loader() as boolean;
			if(!loader)
				this.selectedIndx = -1;
		})
	}

	updateExpense(expense: Expense) {
		this.onUpdateExpense.emit(expense);
	}

	deleteExpense(expense: Expense, indx: number) {
		this.selectedIndx = indx;
		this.onDeleteExpense.emit(expense);
	}
}
