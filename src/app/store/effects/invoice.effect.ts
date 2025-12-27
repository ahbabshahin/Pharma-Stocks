import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { InvoiceApiService } from '../../service/invoice/invoice-api.service';
import * as invoiceActions from '../../store/actions/invoice.action';
import { catchError, exhaustMap, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { InvoiceStoreService } from '../../service/invoice/invoice-store.service';
import { CommonService } from '../../service/common/common.service';
import { Invoice } from '../models/invoice.model';
import { Update } from '@ngrx/entity';
import { Customer } from '../models/customer.model';

@Injectable()
export class InvoiceEffects {
  private actions$ = inject(Actions);
  constructor(
    private invoiceStore: InvoiceStoreService,
    private invoiceApi: InvoiceApiService,
    private commonService: CommonService,
  ) {}

  loadInvoice$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(invoiceActions.loadInvoice),
        mergeMap((action) => {
          return this.invoiceApi.getInvoices(action.params,).pipe(
            map((res: any) => {
              this.invoiceStore.setLoader(false);
              this.invoiceStore.loadInvoiceSuccess(
                res?.body,
                res?.total,
                action.isMore
              );
              this.invoiceStore.setSubLoader(false)
            }),
            catchError(() =>{
              this.commonService.showErrorToast('Invoice load failed');
            this.invoiceStore.loadInvoiceFail('failed');
              this.invoiceStore.setSubLoader(false)
              return of()
            })
          );
        })
      ),
    { dispatch: false }
  );

  addInvoice$ = createEffect(
    () =>  this.actions$.pipe(
      ofType(invoiceActions.addInvoice),
      exhaustMap((action: any) =>{
        return this.invoiceApi.addInvoice(action.payload).pipe(
          map((res: Invoice<Customer>) => {
            this.invoiceStore.addInvoiceSuccess(res);
            this.commonService.dismissLoading();
            this.commonService.showSuccessToast('Add invoice successful');
          }),
          catchError((err) => {
            const errMsg = err?.error?.message ?? 'Add invoice failed'
            this.commonService.dismissLoading();
            this.invoiceStore.addInvoiceFail('failed')
            this.commonService.showErrorToast(errMsg);
            return of();
          })
        );
      })
    ),
    {dispatch: false}
  )

  updateInvoice$ = createEffect(
    () =>  this.actions$.pipe(
      ofType(invoiceActions.updateInvoice),
      exhaustMap((action: any) =>{
        return this.invoiceApi.updateInvoice(action.payload).pipe(
          map((res: Invoice<Customer>) => {
            let response : Update<Invoice<Customer>> = {
              id: res._id as string,
              changes: {
                ...res
              }
            }
            this.invoiceStore.updateInvoiceSuccess(response);
            this.commonService.dismissLoading();
            this.commonService.showSuccessToast('update invoice successful');
          }),
          catchError((err) => {
            const errMsg = err?.error?.message ?? 'update invoice failed';
            this.commonService.dismissLoading();
            this.invoiceStore.updateInvoiceFail('failed');
            this.commonService.showErrorToast(errMsg);
            return of();
          })
        );
      })
    ),
    {dispatch: false}
  );

  deleteInvoice$ = createEffect(
    () => this.actions$.pipe(
      ofType(invoiceActions.deleteInvoice),
      exhaustMap((action: any) => {
        return this.invoiceApi.deleteInvoice(action.id).pipe(
          map((res: any) =>{
            this.invoiceStore.deleteInvoiceSuccess(action.id);
            this.commonService.showSuccessToast('Invice delete successful');
            this.commonService.dismissLoading();
          }),
          catchError((err) =>{
            this.commonService.showErrorToast('Invice delete failed');
            this.invoiceStore.deleteInvoiceFail('failed');
            this.commonService.dismissLoading();
            return of()
          })
        )
      })
    ),

    {dispatch: false}
  );

  searchInvoice$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(invoiceActions.searchInvoice),
        switchMap((action) => {
          return this.invoiceApi.searchInvoice(action.params,).pipe(
            map((res: any) => {
              this.invoiceStore.setLoader(false);
              this.invoiceStore.loadInvoiceSuccess(
                res?.body,
                res?.total,
                action.isMore
              );
              this.invoiceStore.setSubLoader(false)
            }),
            catchError(() =>{
              this.commonService.showErrorToast('Invoice search failed');
              this.invoiceStore.loadInvoiceFail('failed');
              this.invoiceStore.setSubLoader(false)
              return of()
            })
          );
        })
      ),
    { dispatch: false }
  );
}
