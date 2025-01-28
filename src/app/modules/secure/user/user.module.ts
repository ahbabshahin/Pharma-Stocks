import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as userComponents from './index';
import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { LoaderComponent } from '../../../common-component/loader/loader.component';


@NgModule({
  declarations: [...userComponents.components],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    LoaderComponent,
  ],
})
export class UserModule {}
