import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as areaCodeIndex from '../index';
import { EffectsModule } from '@ngrx/effects';
import { AreaCodeEffect } from 'src/app/store/effects/area-code.effect';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
		EffectsModule.forFeature(AreaCodeEffect),
  ],
	providers: areaCodeIndex.providers,
})
export class AreaCodeStateModule { }
