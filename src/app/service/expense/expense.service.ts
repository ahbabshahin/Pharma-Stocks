import { computed, Injectable, signal } from '@angular/core';
import { ExpenseApiService } from './expense-api.service';
import {
	Expense,
	ExpenseParams,
	ExpenseResponse,
	ExpenseType,
	NewExpense,
} from 'src/app/store/models/expense.model';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
	catchError,
	distinct,
	distinctUntilChanged,
	exhaustMap,
	filter,
	of,
	switchMap,
	tap,
} from 'rxjs';
import { CommonService } from '../common/common.service';

@Injectable()
export class ExpenseService {
	tabs: { label: string; value: string }[] = [
		{ label: 'All', value: '' },
		{ label: 'Product', value: ExpenseType.PRODUCT },
		{ label: 'Salary', value: ExpenseType.SALARY },
		{ label: 'General', value: ExpenseType.GENERAL },
	]; //['all', 'product', 'salary', 'general'];

	private expenseReasons: string[] = [
		'Rent & Utilities',
		'Marketing & Advertising',
		'Maintenance',
		'Office Supplies',
		'Insurance',
		'Legal & Professional Services',
	];

	constructor(private expenseApi: ExpenseApiService, private commonService: CommonService,) {}

	private expenseState = signal<{
		data: Expense[];
		subloader: boolean;
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
		subloader: false,
		loaded: false,
		error: '',
		addloader: false,
		updateLoader: false,
		deleteLoader: false,
		total: 0,
	});

	private newExpensePayload = signal<NewExpense>(null as any);

	expenseList = computed(() => this.expenseState().data);
	loader = computed(() => this.expenseState().loader);
	subloader = computed(() => this.expenseState().subloader);
	loaded = computed(() => this.expenseState().loaded);
	error = computed(() => this.expenseState().error);
	addLoader = computed(() => this.expenseState().addloader);
	updateLoader = computed(() => this.expenseState().updateLoader);
	deleteLoader = computed(() => this.expenseState().deleteLoader);
	total = computed(() => this.expenseState().total);

	getExpenseReasons() {
		return this.expenseReasons;
	}

	loadExpenseParams = signal<ExpenseParams>(null as any);

	loadExpense(params: ExpenseParams) {
		this.loadExpenseParams.set({ ...params });
	}

	addExpense(payload: NewExpense) {
		this.newExpensePayload.set({...payload});
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
			tap((params) =>
				this.setExpenseLoader(
					true,
					params?.page > 1 ? 'subloader' : 'loader',
				),
			),
			switchMap((params) =>
				this.expenseApi.getExpenses(params).pipe(
					tap((res: ExpenseResponse) => {
						let expenses: Expense[] = res?.body;
						if (params?.page > 1) {
							expenses = [
								...this.expenseState().data,
								...res?.body,
							];
						}
						this.expenseState.set({
							...this.expenseState(),
							data: expenses,
							loader: false,
							subloader: false,
							loaded: true,
							error: '',
							total: res.total,
						});
					}),
					catchError((err) => {
						this.expenseState.set({
							...this.expenseState(),
							loader: false,
							subloader: false,
							loaded: false,
							error: err,
						});
						this.loadExpenseParams.set(null as any);
						return of({ body: [], total: 0 });
					}),
				),
			),
		),
		{
			initialValue: { body: [], total: 0 },
		},
	);

	readonly createExpenseApiCall = toSignal(
		toObservable(this.newExpensePayload).pipe(
			filter((payload) => payload !== null),
			distinctUntilChanged(),
			tap((payload) => this.setExpenseLoader(true, 'addloader')),
			exhaustMap((payload) => {
				return this.expenseApi.createExpense(payload).pipe(
					tap((res: Expense) => {
						const expenses: Expense[] = [
							...this.expenseState().data,
							res,
						];
						const total: number = this.expenseState().total + 1;
						this.expenseState.set({
							...this.expenseState(),
							data: expenses,
							addloader: false,
							error: '',
							total,
						});
						this.commonService.showSuccessToast('Expense created successfully');
					}),
					catchError((err) => {
						console.log('err: ', err);
						const error = err?.error?.message || 'Create expense failed';
						this.expenseState.set({
							...this.expenseState(),
							addloader: false,
							error: err,
						});
						this.newExpensePayload.set(null as any);
						this.commonService.showErrorToast(error);
						return of(error);
					}),
				);
			}),
		),
	);
}
