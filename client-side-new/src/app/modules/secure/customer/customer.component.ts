import { Component } from '@angular/core';
import { CommonService } from '../../../service/common/common.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent {
  subs = new SubSink();

  constructor(private commonService: CommonService,){}

  ngOnInit(){
    this.initialize();
  }

  initialize(){
    console.log('Customer initialize');
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }
}
