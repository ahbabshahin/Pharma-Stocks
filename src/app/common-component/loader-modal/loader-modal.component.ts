import { Component } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
@Component({
  selector: 'app-loader-modal',
  standalone: true,
  imports: [NzSpinModule, NzIconModule,],
  templateUrl: './loader-modal.component.html',
  styleUrl: './loader-modal.component.scss',
})
export class LoaderModalComponent {}
