import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { AuthStoreService } from '../../service/auth/auth-store.service';
import { SubSink } from 'subsink';
import { User } from '../../store/models/user.model';
import { Observable, of } from 'rxjs';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  subs = new SubSink();
  user$: Observable<User> = of();

  constructor(
    private router: Router,
    private authStore: AuthStoreService,
    private drawerRef: NzDrawerRef,
  ) {}

  routes: { label: string; path: string }[] = [
    { label: 'dashboard', path: '/dashboard' },
    { label: 'stocks', path: '/stocks' },
    { label: 'invoice', path: '/invoice' },
    { label: 'customer', path: '/customer' },
    { label: 'profile', path: '/profile' },
  ];

  ngOnInit(){
    this.initialize();
  }

  initialize(){
    this.getUser()
  }

  getUser(){
    this.user$ = this.authStore.getUser();
  }

  onRouteChange(path: string){
    this.router.navigate([path]);
    this.drawerRef.close();
  }


  ngOnDestroy(){

  }
}
