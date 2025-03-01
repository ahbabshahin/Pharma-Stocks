import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { AuthStoreService } from '../../service/auth/auth-store.service';
import { SubSink } from 'subsink';
import { User } from '../../store/models/user.model';
import { Observable, of } from 'rxjs';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  user$: Observable<User> = of();
  filteredRoutes: { label: string; path: string }[] = [];

  // Define all routes
  routes: { label: string; path: string; roles: string[] }[] = [
    { label: 'dashboard', path: '/dashboard', roles: ['admin', 'office'] },
    { label: 'stocks', path: '/stocks', roles: ['admin', 'office'] },
    { label: 'invoice', path: '/invoice', roles: ['admin', 'office', 'field'] },
    { label: 'customer', path: '/customer', roles: ['admin',] },
    { label: 'user', path: '/user', roles: ['admin',] },
    { label: 'profile', path: '/profile', roles: ['admin', 'office', 'field', 'delivery'] },
  ];

  constructor(
    private router: Router,
    private authStore: AuthStoreService,
    private drawerRef: NzDrawerRef
  ) {}

  ngOnInit(): void {
    this.initialize();
  }

  initialize(): void {
    this.getUser();
  }

  getUser(): void {
    this.user$ = this.authStore.getUser();
    this.subs.sink = this.user$.pipe(filter(Boolean)).subscribe((user) => {
      this.filteredRoutes = this.routes.filter((route) =>
        route.roles.includes(user.role as string)
      );
    });
  }

  onRouteChange(path: string): void {
    this.router.navigate([path]);
    this.drawerRef.close();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
