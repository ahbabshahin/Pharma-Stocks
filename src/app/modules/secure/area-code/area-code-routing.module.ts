import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreaCodeComponent } from './area-code.component';

const routes: Routes = [
	{
		path: '',
		component: AreaCodeComponent,
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AreaCodeRoutingModule { }
