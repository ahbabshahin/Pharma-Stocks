import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AreaCodeListComponent } from './area-code-list/area-code-list.component';

@Component({
  standalone: true,
  selector: 'app-area-code',
  templateUrl: './area-code.component.html',
  styleUrl: './area-code.component.scss',
  imports: [
    CommonModule,
    AreaCodeListComponent,
  ],
})
export class AreaCodeComponent {}
