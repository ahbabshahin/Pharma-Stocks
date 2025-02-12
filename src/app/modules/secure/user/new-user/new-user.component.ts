import { Component } from '@angular/core';
import { User } from '../../../../store/models/user.model';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.scss'
})
export class NewUserComponent {
  user!: User;
  total!: number;
}
