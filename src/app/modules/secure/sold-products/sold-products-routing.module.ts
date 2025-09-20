import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SoldProductsComponent } from './sold-products.component';

const routes: Routes = [
  {
    path: '',
    component: SoldProductsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SoldProductsRoutingModule { }
