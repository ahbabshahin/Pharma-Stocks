import { isDevMode, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SecureModule } from './secure/secure.module';
import { SharedModule } from './shared/shared.module';
import { SidebarModule } from './secure/sidebar/sidebar.module';
import { SidebarComponent } from './secure/sidebar/sidebar.component';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { CustomSerializer } from './store/router/custom-serializer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { HttpClientModule } from '@angular/common/http';
import { Config } from './config';
import { InvoiceEffects } from './store/effects/invoice.effect';
import { invoiceReducer } from './store/reducers/invoice.reducer';
import { appReducer } from './store/app.state';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    RouterLink,
    RouterOutlet,
    RouterModule,
    BrowserAnimationsModule,
    SecureModule,
    SharedModule,
    SidebarModule,
    SidebarComponent,
    HttpClientModule,
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    StoreModule.forRoot(appReducer, {
      runtimeChecks: {
        strictActionImmutability: true,
        strictStateImmutability: true,
        strictActionWithinNgZone: true,
        strictActionTypeUniqueness: true,
      },
    }),
    EffectsModule.forRoot([InvoiceEffects]),
    StoreRouterConnectingModule.forRoot({
      serializer: CustomSerializer,
    }),
    StoreRouterConnectingModule.forRoot(),
  ],
  exports: [
    RouterLink,
    RouterOutlet,
    RouterModule,
    SharedModule,
    SecureModule,
    SidebarModule,
  ],
  bootstrap: [AppComponent],
  providers: [NzDrawerService, Config],
})
export class AppModule {}
