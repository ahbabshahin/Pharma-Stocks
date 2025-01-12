import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecureRoutingModule } from './secure-routing.module';
import { SecureComponent } from './secure.component';
import { SharedModule } from '../../shared/shared.module';
import { SidebarComponent } from '../../common-component/sidebar/sidebar.component';
import { StoreModule } from '@ngrx/store';
import { appReducer } from '../../store/app.state';

@NgModule({
  declarations: [SecureComponent],
  imports: [
    CommonModule,
    SecureRoutingModule,
    SharedModule,
    SidebarComponent,
    // StoreModule.forFeature('secure', appReducer),
  ],
})
export class SecureModule {}
