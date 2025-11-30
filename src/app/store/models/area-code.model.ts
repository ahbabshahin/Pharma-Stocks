export interface AreaCodeRequiredFields {
  title: string;
  code: string;
  manager: string | AreaManager;
}

export interface AreaCode extends AreaCodeRequiredFields {
  _id?: string;
  marketingExpense?: number;
  color?: string;
  description?: string;
}

export interface AreaManager {
	_id: string;
	username: string;
	email: string;
	name: string;
}

