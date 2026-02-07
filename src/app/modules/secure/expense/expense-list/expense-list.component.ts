import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
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
	type = input<string>();
	ExpenseType = ExpenseType;
}
