import { Injectable, signal, Signal } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { CustomerState } from '../../store/reducers/customer.reducer';
import { catchError, debounceTime, distinctUntilChanged, Observable, of, switchMap } from 'rxjs';
import * as customerActions from '../../store/actions/customer.action';
import { Update } from '@ngrx/entity';
import { Customer } from '../../store/models/customer.model';
import * as customerSelectors from '../../store/selectors/customer.selector';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { CustomerApiService } from './customer-api.service';
import { AreaCode } from 'src/app/store/models/area-code.model';

@Injectable()
export class CustomerStoreService {
	customerSearchTerm = signal('');

	constructor(
		private store: Store<CustomerState>,
		private customerApi: CustomerApiService
	) {}

	dispatch = (action: Action) => this.store.dispatch(action);
	select = <T>(action: any): Observable<T> => this.store.select(action);

	// Set Sub Loader
	setCustomerSubLoader(status: boolean) {
		this.dispatch(customerActions.setCustomerSubLoader({ status }));
	}

	// Load Customers
	loadCustomer(params: { [key: string]: any }, isMore: boolean) {
		this.dispatch(customerActions.loadCustomer({ params, isMore }));
	}
	loadCustomerSuccess(
		res: Customer<AreaCode>[],
		total: number,
		isMore: boolean
	) {
		this.dispatch(
			customerActions.loadCustomerSuccess({ res, total, isMore })
		);
	}
	loadCustomerFail(error: string) {
		this.dispatch(customerActions.loadCustomerFail({ error }));
	}

	// Add Customer
	addCustomer(payload: Customer<string>) {
		this.dispatch(customerActions.addCustomer({ payload }));
	}
	addCustomerSuccess(res: Customer<AreaCode>) {
		this.dispatch(customerActions.addCustomerSuccess({ res }));
	}
	addCustomerFail(error: string) {
		this.dispatch(customerActions.addCustomerFail({ error }));
	}

	// Update Customer
	updateCustomer(payload: Customer<string>) {
		this.dispatch(customerActions.updateCustomer({ payload }));
	}
	updateCustomerSuccess(res: Update<Customer<AreaCode>>) {
		this.dispatch(customerActions.updateCustomerSuccess({ res }));
	}
	updateCustomerFail(error: string) {
		this.dispatch(customerActions.updateCustomerFail({ error }));
	}

	// Delete Customer
	deleteCustomer(id: string) {
		this.dispatch(customerActions.deleteCustomer({ id }));
	}
	deleteCustomerSuccess(id: string) {
		this.dispatch(customerActions.deleteCustomerSuccess({ id }));
	}
	deleteCustomerFail(error: string) {
		this.dispatch(customerActions.deleteCustomerFail({ error }));
	}

	// Search Customer
	searchCustomer(params: { [key: string]: any }, isMore: boolean) {
		this.dispatch(customerActions.searchCustomer({ params, isMore }));
	}
	searchCustomerSuccess(res: Customer<AreaCode>[]) {
		this.dispatch(customerActions.searchCustomerSuccess({ res }));
	}
	searchCustomerFail(error: string) {
		this.dispatch(customerActions.searchCustomerFail({ error }));
	}

	//selectors

	getCustomerLoader = (): Observable<boolean> =>
		this.select(customerSelectors.getCustomerLoader);

	getCustomerSubLoader = (): Observable<boolean> =>
		this.select(customerSelectors.getCustomerSubLoader);

	getCustomerLoaded = (): Observable<boolean> =>
		this.select(customerSelectors.getCustomerLoaded);

	getCustomerTotal = (): Observable<number> =>
		this.select(customerSelectors.getCustomerTotal);

	getCustomerError = (): Observable<string> =>
		this.select(customerSelectors.getCustomerError);

	getCustomers = (): Observable<Customer<AreaCode>[]> =>
		this.select(customerSelectors.getCustomers);

	generateSerialNumber() {
		// Generate two random uppercase letters
		const letters = String.fromCharCode(
			Math.floor(Math.random() * 26) + 65,
			Math.floor(Math.random() * 26) + 65
		);

		// Generate four random digits
		const digits = Math.floor(1000 + Math.random() * 9000);

		// Combine letters and digits
		return letters + digits;
	}

	setCustomerSearchParams(search: string) {
		console.log('search: ', search);
		let searchTerm = search?.trim();
		this.customerSearchTerm?.set(searchTerm);
	}

	customers: Signal<Customer<AreaCode>[]> = toSignal(
		toObservable(this.customerSearchTerm).pipe(
			debounceTime(300),
			distinctUntilChanged(),
			switchMap((search: string) => {
				if (!search) return [];
				else {
					const params = {
						name: search,
					};

					const request$ = this.customerApi.searchCustomer(params);

					return request$.pipe(
						catchError((error) => {
							return of([]);
						})
					);

					// return request$
				}
			})
		),
		{
			initialValue: [],
		}
	);
}
