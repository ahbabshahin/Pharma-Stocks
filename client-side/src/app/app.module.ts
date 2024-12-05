import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SecureModule } from './secure/secure.module';
import { SharedModule } from './shared/shared.module';
import { SidebarModule } from './secure/sidebar/sidebar.module';
import { SidebarComponent } from './secure/sidebar/sidebar.component';
import { NzDrawerService } from 'ng-zorro-antd/drawer';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    RouterLink,
    RouterOutlet,
    RouterModule,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
    BrowserAnimationsModule,
    SecureModule,
    SharedModule,
    SidebarModule,
    SidebarComponent,
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
  providers: [NzDrawerService],
})
export class AppModule {}
