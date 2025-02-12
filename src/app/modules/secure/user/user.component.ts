import { Component } from '@angular/core';
import { EditRolePayload, User } from '../../../store/models/user.model';
import { UserApiService } from '../../../service/user/user-api.service';
import { SubSink } from 'subsink';
import { CommonService } from '../../../service/common/common.service';
import { UserStoreService } from '../../../service/user/user-store.service';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NewUserComponent } from './new-user/new-user.component';

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
  constructor(
    private userApi: UserApiService,
    private commonService: CommonService,
    private userStore: UserStoreService,
    private drawerService: NzDrawerService,
  ){}

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

  addUser(user: User) {
    this.drawerService.create({
      nzTitle: 'New Invoice',
      nzClosable: true,
      nzMaskClosable: false,
      nzWidth: '100%',
      nzWrapClassName: 'full-drawer',
      // nzSize: 'large',
      nzContent: NewUserComponent,
      nzData: { user, total: this.total },
    });
  }

  async editRole(user: User){
    const ok = await this.commonService.showConfirmModal(
      `Are you sure, you want to make ${user?.name} as Admin?`
    );

    if(!ok) return;

    this.commonService.presentLoading();

    let payload : EditRolePayload = {
      _id: user?._id as string,
      role: user?.role === 'user' ? 'admin' : 'user'
    }
    this.userStore.editRole(payload);
  }

  async deleteUser(user: User){
    const ok = await this.commonService.showConfirmModal(
      `Are you sure, you want to delete ${user?.name}?`
    );

    if(!ok) return;

    this.commonService.presentLoading();

  }



  ngOnDestroy(){

  }
}
