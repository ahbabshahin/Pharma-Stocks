import { Injectable } from '@angular/core';
import { CommonService } from '../common/common.service';

@Injectable({
  providedIn: 'root',
})
export class BusinessService {
  constructor(private commonService: CommonService) {}

  getBusiness() {
    let business: string = localStorage.getItem('business') as string;
    if (business) return JSON.parse(business);
    else {
      this.commonService.showErrorToast('Business not found');
      return undefined;
    }
  }
}
