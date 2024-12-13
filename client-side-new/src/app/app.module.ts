import { isDevMode, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsConfig, StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppComponent } from './app.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr, ToastrModule } from 'ngx-toastr';

registerLocaleData(en);


@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
    BrowserModule,
    RouterModule,
    RouterOutlet,
    HttpClientModule,
    StoreModule.forRoot(),
    EffectsModule.forRoot(),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    FormsModule,
    ToastrModule.forRoot(),
  ],
  exports: [RouterModule, RouterOutlet, HttpClientModule],
  bootstrap: [AppComponent],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    provideAnimationsAsync(),
    provideHttpClient(),
    provideToastr(),
  ],
})
export class AppModule {}
