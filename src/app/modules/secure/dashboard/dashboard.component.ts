import { Component } from '@angular/core';
import { BusinessService } from '../../../service/business/business.service';
import { Business } from '../../../store/models/business.model';
import { SubSink } from 'subsink';
import { InvoiceApiService } from '../../../service/invoice/invoice-api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  subs = new SubSink();
  business!: Business;
  constructor(
    private businessService: BusinessService,
    private invoiceApiService: InvoiceApiService,
    ) {}

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.getBusiness();
    // this.getSalesReportByPrice();
  }

  getBusiness() {
    const business = this.businessService.getBusiness();

    if (business) this.business = business;
  }


  ngOnDestroy() {}
}
