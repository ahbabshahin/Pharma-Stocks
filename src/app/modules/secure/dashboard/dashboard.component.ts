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
  isAmount: boolean = true;
  constructor(
    private businessService: BusinessService,
    private router: Router,
    private authStore: AuthStoreService
  ) {}

  ngOnInit() {
    this.initialize();
  }

  async initialize() {
    await this.isAdminUser();
    this.getBusiness();
  }

  async isAdminUser() {
    this.isAdmin = await this.authStore.isAdminUser();
    this.loader = false;
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
