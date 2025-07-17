import { Component } from '@angular/core';
import { EditRolePayload, User } from '../../../store/models/user.model';
import { SubSink } from 'subsink';
import { CommonService } from '../../../service/common/common.service';
import { UserStoreService } from '../../../service/user/user-store.service';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NewUserComponent } from './new-user/new-user.component';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  user!: any;
  users: User[] = [];
  subs = new SubSink();
  params = {
    page: 1,
    limit: 10,
  };
  total: number = 0;
  isMore: boolean = false;
  loader$: Observable<boolean> = of(true);
  subloader$: Observable<boolean> = of(false);
  constructor(
    private commonService: CommonService,
    private userStore: UserStoreService,
    private drawerService: NzDrawerService
  ) {}

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.getLoader();
    this.isUserLoaded();
    this.getUsers();
  }

  getLoader() {
    this.loader$ = this.userStore.getUserLoader();
    this.subloader$ = this.userStore.getUserSubLoader();
  }

  isUserLoaded() {
    this.subs.sink = this.userStore.getUserLoaded().subscribe({
      next: (loaded: boolean) => {
        if (!loaded) this.loadUsers();
      },
    });
  }

  loadUsers() {
    this.userStore.loadUsers(this.params, this.isMore);
  }

  getUsers() {
    this.subs.sink = this.userStore.getUsers().subscribe({
      next: (res: User[]) => {

        this.users = res;
        this.getTotalUser();
        // this.total = res?.total
        // this.loader = false;
      },
      error: () => {
        // this.loader = false;
      },
    });
  }

  getTotalUser() {
    this.subs.sink = this.userStore.getTotalUser().subscribe({
      next: (res: number) => {
        this.total = res;
      },
      error: () => {
        this.commonService.showErrorToast('');
      },
    });
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

  async editRole(user: User) {
    const ok = await this.commonService.showConfirmModal(
      `Are you sure, you want to make ${user?.name} as Admin?`
    );

    if (!ok) return;

    this.commonService.presentLoading();

    let payload: EditRolePayload = {
      _id: user?._id as string,
      role: user?.role === 'office' ? 'admin' : 'office',
    };
    this.userStore.editRole(payload);
  }

  editUser(user?: User) {

    this.drawerService.create({
      nzTitle: `${user ? 'Update' : 'Add'} user`,
      nzClosable: true,
      nzMaskClosable: false,
      nzWidth: '100%',
      // nzWrapClassName: 'md-drawer',
      nzContent: NewUserComponent,
      nzData: { user },
    });
  }

  async deleteUser(user: User) {
    const ok = await this.commonService.showConfirmModal(
      `Are you sure, you want to delete ${user?.name}?`
    );

    if (!ok) return;

    this.commonService.presentLoading();
    this.userStore.deleteUser(user._id as string);
  }

  async showLogs(user: User) {
    const { LogComponent } = await import(
      '../../../common-component/log/log.component'
    );
    this.drawerService.create({
      nzTitle: 'Activity Logs',
      nzWidth: '100%',
      nzWrapClassName: 'full-drawer',
      nzContent: LogComponent,
      nzData: {
        logs: user?.activity_log,
      },
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
