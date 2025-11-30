import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AreaCodeRoutingModule } from './area-code-routing.module';
import { AreaCodeStateModule } from './area-code-state/area-code-state.module';


@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		AreaCodeRoutingModule,
		AreaCodeStateModule,
	],
})
export class AreaCodeModule {}
