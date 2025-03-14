import { Component } from '@angular/core';
import { BusinessService } from '../../../service/business/business.service';
import { Business } from '../../../store/models/business.model';
import { SubSink } from 'subsink';
import { Router } from '@angular/router';
import { AuthStoreService } from '../../../service/auth/auth-store.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  loader: boolean = true;
  subs = new SubSink();
  business!: Business;
  isAdmin: boolean = false;
  constructor(
    private businessService: BusinessService,
    private router: Router,
    private authStore: AuthStoreService,
  ) {}

  ngOnInit() {
    this.initialize();
  }

  async initialize() {
    await this.isAdminUser();
    this.getBusiness();
  }

  async isAdminUser() {
    console.log('admin');
    this.isAdmin = await this.authStore.isAdminUser();
    console.log('this.isAdmin: ', this.isAdmin);
  }

  getBusiness() {
    const business = this.businessService.getBusiness();

    if (business) this.business = business;
  }

  salesReport() {
    this.router.navigate(['/sales-report']);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
