import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterOutlet } from '@angular/router';
import { SidebarRoutingModule } from './sidebar-routing.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { InvoiceEffects } from '../../store/effects/invoice.effect';
import { invoiceReducer } from '../../store/reducers/invoice.reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    RouterOutlet,
    SidebarRoutingModule,
    StoreModule.forFeature('invoice', invoiceReducer),
    EffectsModule.forFeature([InvoiceEffects]),
  ],
})
export class SidebarModule {}
