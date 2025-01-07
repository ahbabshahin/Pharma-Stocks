import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { InvoiceApiService } from '../../service/invoice/invoice-api.service';
import * as invoiceActions from '../../store/actions/invoice.action';
import { catchError, exhaustMap, map, mergeMap, of, tap } from 'rxjs';
import { InvoiceStoreService } from '../../service/invoice/invoice-store.service';
import { CommonService } from '../../service/common/common.service';
import { Invoice } from '../models/invoice.model';
import { Update } from '@ngrx/entity';

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
        mergeMap((action: { params: { [key: string]: any } }) => {
          return this.invoiceApi.getInvoices(action.params).pipe(
            map((res: any) => {
              console.log('res: ', res);
              this.invoiceStore.setLoader(false);
              this.invoiceStore.loadInvoiceSuccess(res?.body, res?.total);
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
          map((res: Invoice) => {
            console.log('res: ', res);
            this.invoiceStore.addInvoiceSuccess(res);
            this.commonService.dismissLoading();
            this.commonService.showSuccessToast('Add invoice successful');
          }),
          catchError((err) => {
            const errMsg = err?.error?.message ?? 'Add invoice failed'
            this.commonService.dismissLoading();
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
          map((res: Invoice) => {
            console.log('res: ', res);
            let response : Update<Invoice> = {
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
            this.commonService.showErrorToast(errMsg);
            return of();
          })
        );
      })
    ),
    {dispatch: false}
  )
}
