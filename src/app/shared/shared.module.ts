import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { components } from '.';

@NgModule({
  declarations: [],
  imports: [CommonModule, ...components],
  exports: [...components],
})
export class SharedModule {}
