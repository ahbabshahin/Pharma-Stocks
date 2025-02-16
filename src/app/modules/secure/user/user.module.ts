import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as userComponents from './index';
import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { UserApiService } from '../../../service/user/user-api.service';
import { UserStoreService } from '../../../service/user/user-store.service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from '../../../store/effects/user.effect';
import { userStateName } from '../../../store/app.state';
import { userReducer } from '../../../store/reducers/user.reducer';
import { CommonComponentModule } from "../../../common-component/common-component.module";


@NgModule({
  declarations: [userComponents.components],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    StoreModule.forFeature(userStateName, userReducer),
    EffectsModule.forFeature(UserEffects),
    CommonComponentModule,
],
  providers: [UserApiService, UserStoreService],
})
export class UserModule {}
