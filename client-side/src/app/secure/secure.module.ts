import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecureRoutingModule } from './secure-routing.module';
import { SidebarModule } from './sidebar/sidebar.module';
import { InvoiceModule } from './invoice/invoice.module';
import { SecureComponent } from './secure.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [SecureComponent],
  imports: [
    CommonModule,
    SecureRoutingModule,
    SidebarModule,
    InvoiceModule,
    SidebarComponent,
  ],
})
export class SecureModule {}
