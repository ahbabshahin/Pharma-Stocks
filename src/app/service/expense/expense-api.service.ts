import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Config } from 'src/app/config';
import { ExpenseResponse, NewExpense } from 'src/app/store/models/expense.model';

@Injectable()
export class ExpenseApiService {
	constructor(
		private env: Config,
		private http: HttpClient,
	) {}

	getExpenses(params: { [key: string]: any }): Observable<ExpenseResponse> {
		return this.http.get(`${this.env.rootURL}/v1/expense`, { params }).pipe(
			map((res: any) => {
				return { body: res?.body || [], total: res?.total || 0 };
			}),
		);
	}

	createExpense(payload: NewExpense) {
		return this.http.post(`${this.env.rootURL}/v1/expense`, payload).pipe(
			map((res: any) => res?.body),
		);

	}
}
