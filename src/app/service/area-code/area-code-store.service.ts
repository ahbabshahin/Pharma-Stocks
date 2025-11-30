import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { AreaCodeState } from 'src/app/store/reducers/area-code.reducer';
import { Observable } from 'rxjs';
import * as areaCodeSelectors from 'src/app/store/selectors/area-code.selector';
import * as areaCodeActions from 'src/app/store/actions/area-code.action';
import { AreaCode } from 'src/app/store/models/area-code.model';
@Injectable()
export class AreaCodeStoreService {
	constructor(private store: Store<AreaCodeState>) {}

	dispatch = (action: Action) => this.store.dispatch(action);
	select = (selector: any) => this.store.select(selector);

	loadAreaCodes() {
		this.dispatch(areaCodeActions.loadAreaCodes());
	}

	addAreaCode(payload: AreaCode) {
		this.dispatch(areaCodeActions.addAreaCode({ payload }));
	}

	updateAreaCode(payload: AreaCode) {
		this.dispatch(areaCodeActions.updateAreaCode({ payload }));
	}

	deleteAreaCode(id: string) {
		this.dispatch(areaCodeActions.deleteAreaCode({ id }));
	}

	getAreaCodeLoader = (): Observable<boolean> =>
		this.select(areaCodeSelectors.getAreaCodeLoader);
	getAreaCodeAddLoader = (): Observable<boolean> =>
		this.select(areaCodeSelectors.getAreaCodeAddLoader);
	getAreaCodeUpdateLoader = (): Observable<boolean> =>
		this.select(areaCodeSelectors.getAreaCodeUpdateLoader);
	getAreaCodeDeleteLoader = (): Observable<boolean> =>
		this.select(areaCodeSelectors.getAreaCodeDeleteLoader);
	getAreaCodeSubLoader = (): Observable<boolean> =>
		this.select(areaCodeSelectors.getAreaCodeSubLoader);

	getAreaCodeLoaded = (): Observable<boolean> =>
		this.select(areaCodeSelectors.getAreaCodeLoaded);

	getTotalAreaCode = (): Observable<number> =>
		this.select(areaCodeSelectors.getTotalAreaCode);

	getAllAreaCodes = (): Observable<AreaCode[]> =>
		this.select(areaCodeSelectors.getAllAreaCodes);

	getAreaCode = (id: string): Observable<AreaCode> =>
		this.select(areaCodeSelectors.getAreaCode(id));

	getAreaCodeError = (): Observable<string> =>
		this.select(areaCodeSelectors.getAreaCodeError);
}
