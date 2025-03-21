import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SharedModule } from '../../shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { authStateName } from '../../store/app.state';
import { authReducer } from '../../store/reducers/auth.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from '../../store/effects/auth.effect';
import * as authComponents from './index';
import { UserApiService } from '../../service/user/user-api.service';

@NgModule({
  declarations: [...authComponents.components],
  imports: [CommonModule, AuthRoutingModule, SharedModule,
    // StoreModule.forFeature(authStateName, authReducer),
    // EffectsModule.forFeature([AuthEffects])
  ],
  providers: [UserApiService],

})
export class AuthModule {}
