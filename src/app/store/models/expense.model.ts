import { ActivityLog } from './common.model';

export interface Expense {
	_id: string;
	type: string;
	amount: number;
	referenceInvoice: string;
	description: string;
	createdBy: ExpenseCreatedBy
	activity_log: ActivityLog[];
	createdAt: string;
	updatedAt: string;
}

export interface ExpenseCreatedBy {
	_id: string;
	name: string;
}

export interface ExpenseResponse {
	body: Expense[];
	total: 0;
}

export interface ExpenseParams {
	page: number;
	limit: number;
	type?: string;
	startDate?: string;
	endDate?: string;
}
