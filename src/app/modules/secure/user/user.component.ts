import { Component } from '@angular/core';
import { User } from '../../../store/models/user.model';
import { UserApiService } from '../../../service/user/user-api.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  user!: any;
  loader: boolean = true;
  users: User[] = [];
  subs = new SubSink();
  params = {
    page: 1,
    limit: 10
  }
  total: number = 0;
  constructor(private userApi: UserApiService){}

  ngOnInit(){
    this.initialize();
  }

  initialize(){
    this.getUsers();
  }

  getUsers(){
    this.subs.sink = this.userApi
      .getUsers(this.params)
      .subscribe({ next: (res: any) => {
        this.users = res.body;
        this.total = res?.total
        this.loader = false;
      }, error: () => {
        this.loader = false;
      } });
  }

  editRole(user: User){

  }

  ngOnDestroy(){

  }
}
