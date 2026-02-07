import { CommonModule } from '@angular/common';
import { Component, signal, Signal } from '@angular/core';
import { LoaderComponent } from 'src/app/common-component/loader/loader.component';
import { NoDataComponent } from 'src/app/common-component/no-data/no-data.component';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { Expense, ExpenseParams, ExpenseType } from 'src/app/store/models/expense.model';
import { ExpenseService } from 'src/app/service/expense/expense.service';
import { ExpenseApiService } from 'src/app/service/expense/expense-api.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { lastValueFrom } from 'rxjs';
import { CommonService } from 'src/app/service/common/common.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
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

		NzButtonModule,
		NzTabsModule,
		NzIconModule,
	],
	providers: [ExpenseApiService, ExpenseService],
})
export class ExpenseComponent {
	expenseList: Signal<Expense[]> = this.expenseService.expenseList;
	loader: Signal<boolean> = this.expenseService.loader;
	subloader: Signal<boolean> = this.expenseService.subloader;
	loaded: Signal<boolean> = this.expenseService.loaded;
	error: Signal<string> = this.expenseService.error;
	total: Signal<number> = this.expenseService.total;
	tabs: { label: string; value: string }[] = this.expenseService.tabs;
	params = signal<ExpenseParams>({
		page: 1,
		limit: 10,
	});
	selectedIndx: number = 0;
	initialLoader: boolean = true;
	type: string = '';
	isMobile: boolean = false;
	ExpenseType = ExpenseType;

	constructor(
		private expenseService: ExpenseService,
		private drawerService: NzDrawerService,
		private commonService: CommonService,
	) {}

	ngOnInit() {
		this.initialize();
	}

	  async getScreenSize() {
		this.isMobile = await lastValueFrom(this.commonService.isItAMobile$());
	  }

	initialize() {
		this.getScreenSize();
		this.initialLoader = false;
		if (!this.loaded()) {
			this.loadExpense();
		}
	}
	loadExpense() {
		this.expenseService.loadExpense(this.params());
	}

	loadMore() {
		if (this.expenseList()?.length < this.total()) {
			this.params.update((value) => ({
				...value,
				page: (value?.page + 1) as number,
			}));
			this.loadExpense();
		}
	}

	onTabChange(index: number) {
		const tab: string = this.tabs[index]?.value;
		this.type = tab;
		this.selectedIndx = index;
		if (tab === '') delete this.params()?.type;
		else
			this.params.update((value) => ({
				...value,
				page: 1,
				type: tab,
			}));
		this.loadExpense();
	}

	async addExpense(expense?: Expense) {
		const { NewExpenseComponent } =
			await import('src/app/modules/secure/expense/new-expense/new-expense.component');
		this.drawerService.create({
			nzTitle: 'New Expense',
			nzClosable: true,
			nzMaskClosable: false,
			nzWidth: this.isMobile ? '100%' : '50%',
			nzContent: NewExpenseComponent,
			nzData: {
				type: this.type,
				expense,
				expenseService: this.expenseService,
			},
		});
	}
}
