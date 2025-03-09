import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { NoDataComponent } from './no-data/no-data.component';
import { BarGraphComponent } from './bar-graph/bar-graph.component';



@NgModule({
  declarations: [],
  imports: [CommonModule, LoaderComponent, NoDataComponent, BarGraphComponent],
  exports: [CommonModule, LoaderComponent, NoDataComponent, BarGraphComponent],
})
export class CommonComponentModule {}
