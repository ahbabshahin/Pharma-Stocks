import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from 'src/app/store/effects/user.effect';
import { UserApiService } from 'src/app/service/user/user-api.service';
import { UserStoreService } from 'src/app/service/user/user-store.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
	EffectsModule.forFeature(UserEffects),
  ],
  providers:[UserApiService, UserStoreService],
})
export class UserStateModule { }
