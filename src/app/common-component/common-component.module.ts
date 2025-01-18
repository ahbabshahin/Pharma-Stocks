import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { NoDataComponent } from './no-data/no-data.component';



@NgModule({
  declarations: [],
  imports: [CommonModule, LoaderComponent, NoDataComponent,],
  exports: [CommonModule, LoaderComponent, NoDataComponent,],
})
export class CommonComponentModule {}
