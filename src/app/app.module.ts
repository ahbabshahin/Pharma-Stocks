import { isDevMode, NgModule, APP_INITIALIZER, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsConfig, StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppComponent } from './app.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { IconsProviderModule } from './icons-provider.module';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr, ToastrModule } from 'ngx-toastr';
import { HttpTokenInterceptor } from './interceptor/http.interceptor';
import { Config } from './config';
import { appReducer, AppState, authStateName, metaReducers } from './store/app.state';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { authReducer } from './store/reducers/auth.reducer';
import { AuthEffects } from './store/effects/auth.effect';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './modules/auth/auth.module';
import { SalesReportEffects } from './store/effects/sales-report.effect';
import { NotificationEffects } from './store/effects/notification.effect';
import { LayoutModule } from '@angular/cdk/layout';
registerLocaleData(en);

export function loadConfig(config: Config): () => Promise<void> {
  return () => config.loadConfig();
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
    BrowserModule,
    RouterModule,
    RouterOutlet,
    HttpClientModule,
    StoreModule.forRoot(appReducer, { metaReducers }),
    EffectsModule.forRoot([AuthEffects, SalesReportEffects, NotificationEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    IconsProviderModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    SharedModule,
	LayoutModule,
  ],
  exports: [RouterModule, RouterOutlet, HttpClientModule],
  bootstrap: [AppComponent],
  providers: [
    AppState,
    Config,
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfig,
      deps: [Config],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true,
    },
    { provide: NZ_I18N, useValue: en_US },
	{provide: DEFAULT_CURRENCY_CODE, useValue:'৳'},
    provideAnimationsAsync(),
    provideHttpClient(),
    // provideToastr(),
    DatePipe,
  ],
})
export class AppModule {}
