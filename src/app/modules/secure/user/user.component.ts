import { Component } from '@angular/core';
import { User } from '../../../store/models/user.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  user!: any;
  loader: boolean = true;
  users: User[] = [];
  ngOnInit(){

  }

  editRole(user: User){

  }

  ngOnDestroy(){

  }
}
