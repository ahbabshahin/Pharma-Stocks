import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { InvoiceApiService } from '../../service/invoice/invoice-api.service';
import * as invoiceActions from '../../store/actions/invoice.action';
import { catchError, exhaustMap, map, mergeMap, of, tap } from 'rxjs';
import { InvoiceStoreService } from '../../service/invoice/invoice-store.service';
@Injectable()
export class InvoiceEffects {
  private actions$ = inject(Actions);
  constructor(
    private invoiceStore: InvoiceStoreService,
    private invoiceApi: InvoiceApiService
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
          map((res: any) =>{
            console.log('res: ', res);
            this.invoiceStore.addInvoiceSuccess(res?.body);
          })
        )
      })
    ),
    {dispatch: false}
  )
}
