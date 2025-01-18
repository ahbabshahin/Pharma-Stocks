import { Component, Input } from '@angular/core';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

@Component({
  selector: 'app-global-no-data',
  standalone: true,
  imports: [NzEmptyModule],
  templateUrl: './no-data.component.html',
  styleUrl: './no-data.component.scss',
})
export class NoDataComponent {
  @Input() bodyText: string = `No data found`
}
