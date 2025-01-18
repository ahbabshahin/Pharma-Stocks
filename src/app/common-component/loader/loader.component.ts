import { Component } from '@angular/core';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
@Component({
  selector: 'app-global-loader',
  standalone: true,
  imports: [NzSkeletonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {

}
