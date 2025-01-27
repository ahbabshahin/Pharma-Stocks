import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as userComponents from './index';
import { UserRoutingModule } from './user-routing.module';


@NgModule({
  declarations: [...userComponents.components],
  imports: [CommonModule, UserRoutingModule],
})
export class UserModule {}
