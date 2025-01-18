import { Component } from '@angular/core';
import { BusinessService } from '../../../service/business/business.service';
import { Business } from '../../../store/models/business.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  business!: Business;
  constructor(private businessService: BusinessService){}

  ngOnInit(){
    this.initialize();
  }

  initialize(){
    this.getBusiness();
  }

  getBusiness(){
   const business = this.businessService.getBusiness();

   if(business) this.business = business;
  }

}
