import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CommonService } from '../../service/common/common.service';
import { CustomerStoreService } from '../../service/customer/customer-store.service';
import { CustomerApiService } from '../../service/customer/customer-api.service';
import * as customerActions from '../../store/actions/customer.action';
import { catchError, map, mergeMap, of } from 'rxjs';
import { Customer } from '../models/customer.model';
import { Update } from '@ngrx/entity';

@Injectable()
export class CustomerEffects {
  constructor(
    private actions$: Actions,
    private commonService: CommonService,
    private customerStore: CustomerStoreService,
    private customerApi: CustomerApiService
  ) {}

  loadCustomer$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(customerActions.loadCustomer),
        mergeMap((action) => {
        console.log('action ', action);
          return this.customerApi.getCustomers(action.params).pipe(
            map((res: any) => {
              this.customerStore.loadCustomerSuccess(
                res?.body ?? [],
                res?.total ?? 0,
                action.isMore
              );
              if(action.isMore) this.customerStore.setCustomerSubLoader(false);
            }),
            catchError(() => {
              if (action.isMore) this.customerStore.setCustomerSubLoader(false);
              this.customerStore.loadCustomerFail('Customer load failed');
              return of();
            })
          );
        })
      ),
    { dispatch: false }
  );

  // Add Customer Effect
  addCustomer$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(customerActions.addCustomer),
        mergeMap((action) => {
          return this.customerApi.addCustomer(action.payload).pipe(
            map((res: Customer) => {
              this.customerStore.addCustomerSuccess(res);
              this.commonService.dismissLoading();
            }),
            catchError((err) => {
              const errorMessage =
                err?.error?.message || 'Customer addition failed';
              this.customerStore.addCustomerFail('Customer addition failed');
              this.commonService.showErrorModal(errorMessage);
              this.commonService.dismissLoading();
              return of(err);
            })
          );
        })
      ),
    { dispatch: false }
  );

  // Update Customer Effect
  updateCustomer$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(customerActions.updateCustomer),
        mergeMap((action) => {
          return this.customerApi.updateCustomer(action.payload).pipe(
            map((res: Customer) => {
              let response: Update<Customer> = {
                id: res?._id as string,
                changes: {
                  ...res,
                },
              };
              this.customerStore.updateCustomerSuccess(response);
              this.commonService.dismissLoading();
            }),
            catchError((err) => {
              this.customerStore.updateCustomerFail('Customer update failed');
              const errorMessage =
                err?.error?.message || 'Customer update failed';
              this.commonService.showErrorModal(errorMessage);
              this.commonService.dismissLoading();

              return of(err);
            })
          );
        })
      ),
    { dispatch: false }
  );

  // Delete Customer Effect
  deleteCustomer$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(customerActions.deleteCustomer),
        mergeMap((action) => {
          return this.customerApi.deleteCustomer(action.id).pipe(
            map(() => {
              this.customerStore.deleteCustomerSuccess(action.id);
              this.commonService.dismissLoading();
              this.commonService.showSuccessToast('Customer delete successful');

            }),
            catchError(() => {
              this.customerStore.deleteCustomerFail('Customer deletion failed');
              this.commonService.showErrorToast('Customer delete failed');
              this.commonService.dismissLoading();
              return of();
            })
          );
        })
      ),
    { dispatch: false }
  );

  // Search Customer Effect
  searchCustomer$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(customerActions.searchCustomer),
        mergeMap((action) => {
          return this.customerApi.searchCustomer(action.params).pipe(
            map((res: any) => {
              this.customerStore.searchCustomerSuccess(res?.body ?? []);
            }),
            catchError(() => {
              this.customerStore.searchCustomerFail('Customer search failed');
              return of();
            })
          );
        })
      ),
    { dispatch: false }
  );
}
