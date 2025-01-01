import { Component } from '@angular/core';
import { Customer } from '../../../../store/models/customer.model';
import { CommonService } from '../../../../service/common/common.service';
import { CustomerStoreService } from '../../../../service/customer/customer-store.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrl: './new-customer.component.scss',
})
export class NewCustomerComponent {
  customer!: Customer;
  form!: FormGroup;

  constructor(
    private commonService: CommonService,
    private customerStore: CustomerStoreService,
    private formBuilder: FormBuilder,
    private drawerRef: NzDrawerRef,
  ) {}

  ngOnInit(){
    this.initialize();
  }

  initialize(){
    this.initializeForm();
  }

  initializeForm(){
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      contacts: ['', [Validators.required]],
      email: [''],
      address: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  onSubmit(){
    console.log('form ', this.form.value);
    let formRes: Customer = this.form?.value;
    const payload: Customer = formRes;

    this.commonService.presentLoading()
    if(this.customer){

    }else{
      this.customerStore.addCustomer(payload)
    }
    this.drawerRef.close();
  }

  ngOnDestroy(){}
}
