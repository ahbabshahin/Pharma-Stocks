import { computed, Injectable, signal } from '@angular/core';
import { ExpenseApiService } from './expense-api.service';
import { Expense, ExpenseResponse } from 'src/app/store/models/expense.model';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, distinct, distinctUntilChanged, filter, of, switchMap, tap } from 'rxjs';

@Injectable()
export class ExpenseService {
	constructor(private expenseApi: ExpenseApiService) {}

	private expenseState = signal<{
		data: Expense[];
		loader: boolean;
		loaded: boolean;
		error: string;
		addloader: boolean;
		updateLoader: boolean;
		deleteLoader: boolean;
		total: number;
	}>({
		data: [],
		loader: false,
		loaded: false,
		error: '',
		addloader: false,
		updateLoader: false,
		deleteLoader: false,
		total: 0,
	});

	expenseList = computed(() => this.expenseState().data);
	loader = computed(() => this.expenseState().loader);
	loaded = computed(() => this.expenseState().loaded);
	error = computed(() => this.expenseState().error);
	addLoader = computed(() => this.expenseState().addloader);
	updateLoader = computed(() => this.expenseState().updateLoader);
	deleteLoader = computed(() => this.expenseState().deleteLoader);
	total = computed(() => this.expenseState().total);

	loadExpenseParams = signal<{params: {[keys: string]: any}}>(null as any);

	loadExpense(params: {[keys: string]: any}){
		this.loadExpenseParams.set({params});
	}

	setExpenseLoader(loader: boolean, key: string) {
		this.expenseState.set({
			...this.expenseState(),
			[key]: loader,
		});
	}

	readonly loadExpenseApiCall = toSignal(
		toObservable(this.loadExpenseParams).pipe(
			filter((params) => params !== null),
			distinctUntilChanged(),
			tap(() => this.setExpenseLoader(true, 'loader')),
			switchMap((params) => this.expenseApi.getExpenses(params.params).pipe(
				tap((res: ExpenseResponse) => {
					this.expenseState.set({
						...this.expenseState(),
						data: res.body,
						loader: false,
						error: '',
						total: res.total,
					})
				}),
				catchError((err) => {
					this.expenseState.set({
						...this.expenseState(),
						loader: false,
						error: err,
					});

					return of({body: [], total: 0})
				})
			))
		),
		{
			initialValue: null
		}
	)
}
