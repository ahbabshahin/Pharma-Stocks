import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as userComponents from './index';
import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { CommonComponentModule } from "../../../common-component/common-component.module";
import { UserStateModule } from './user-state/user-state.module';
import { LoaderComponent } from 'src/app/common-component/loader/loader.component';
import { NoDataComponent } from 'src/app/common-component/no-data/no-data.component';


@NgModule({
  declarations: [userComponents.components],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
	UserStateModule,
	LoaderComponent,
	NoDataComponent,
],
})
export class UserModule {}
