import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as userComponents from './index';
import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { LoaderComponent } from '../../../common-component/loader/loader.component';
import { UserApiService } from '../../../service/user/user-api.service';
import { UserStoreService } from '../../../service/user/user-store.service';


@NgModule({
  declarations: [...userComponents.components],
  imports: [CommonModule, UserRoutingModule, SharedModule, LoaderComponent],
  providers: [UserApiService, UserStoreService],
})
export class UserModule {}
