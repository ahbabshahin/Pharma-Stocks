import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { components } from './index';


@NgModule({
  declarations: [],
  imports: [CommonModule, ...components],
  exports: [CommonModule, ...components],
})
export class CommonComponentModule {}
