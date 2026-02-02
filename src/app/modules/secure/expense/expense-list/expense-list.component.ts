import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { Expense } from 'src/app/store/models/expense.model';

@Component({
	standalone: true,
	selector: 'app-expense-list',
	templateUrl: './expense-list.component.html',
	styleUrl: './expense-list.component.scss',
	imports: [
		CommonModule,

	],
})
export class ExpenseListComponent {
	expenseList = input<Expense[]>();
}
