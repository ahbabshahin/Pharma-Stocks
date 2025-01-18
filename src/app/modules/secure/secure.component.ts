import { Component } from '@angular/core';
import { SubSink } from 'subsink';
import { AuthStoreService } from '../../service/auth/auth-store.service';
import { CommonService } from '../../service/common/common.service';
import { User } from '../../store/models/user.model';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { SidebarComponent } from '../../common-component/sidebar/sidebar.component';
import { Business } from '../../store/models/business.model';

@Component({
  selector: 'app-secure',
  templateUrl: './secure.component.html',
  styleUrl: './secure.component.scss',
})
export class SecureComponent {
  subs = new SubSink();
  decodedToken!: {
    name: string,
    userId: string,
    role: string
  };
  business!: Business;
  constructor(
    private authStore: AuthStoreService,
    private commonService: CommonService,
    private drawerService: NzDrawerService,
  ){}

  ngOnInit() {
    console.log('secure');
    this.initialize();
  }

  initialize(){
    this.business = {
      name: 'Nutri-Heal Pharma Ltd',
      contact: '01854462840',
      address: 'Airport road, Sylhet 3100',
      description: 'Marketing Agent',
      post_code: '3100',
    };

    if (!localStorage.getItem('business'))
      localStorage.setItem('business', JSON.stringify(this.business));
    // this.getUser();
    this.decodedToken = this.commonService.decodeJWT();
    console.log('token ', this.decodedToken);
    if(this.decodedToken?.userId){
      this.loadUser();
      this.getUser();
    }
  }

  loadUser(){
    this.authStore.loadUser(this.decodedToken?.userId);
  }

  getUser(){
    this.subs.sink = this.authStore.getUser().subscribe((res: User) =>{
      console.log('user ', res);
    })
  }

  sidebar(){
    this.drawerService.create({
        // nzTitle: 'New Invoice',
        nzClosable: true,
        nzMaskClosable: false,
        nzWrapClassName: 'md-drawer',
        // nzSize: 'large',
        nzContent: SidebarComponent,
      });
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }
}
