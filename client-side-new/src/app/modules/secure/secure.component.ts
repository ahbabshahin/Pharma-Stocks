import { Component } from '@angular/core';
import { SubSink } from 'subsink';
import { AuthStoreService } from '../../service/auth/auth-store.service';
import { CommonService } from '../../service/common/common.service';
import { User } from '../../store/models/user.model';

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
  constructor(
    private authStore: AuthStoreService,
    private commonService: CommonService
  ){}

  ngOnInit() {
    console.log('secure');
    this.initialize();
  }

  initialize(){
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
    this.subs.sink = this.authStore.getUser().subscribe((res: User[]) =>{
      console.log('user ', res);
    })
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }
}
