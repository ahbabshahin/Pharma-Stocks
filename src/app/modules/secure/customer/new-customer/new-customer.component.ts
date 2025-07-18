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
    if(this.customer) this.populateForm();
  }

  initializeForm(){
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      contacts: ['',],
      email: [''],
      address: ['', [Validators.required, Validators.minLength(3)]],
      areaCode: ['', [Validators.minLength(3)]],
      sn: [this.customerStore.generateSerialNumber()],
    });
  }

  populateForm(){
    this.form.patchValue({
      ...this.customer,
      sn: this.customer?.sn ? this.customer.sn : this.customerStore.generateSerialNumber(),
    });
  }

  onSubmit(){

    let formRes: Customer = this.form?.value;
    let payload: Customer = formRes;

    this.commonService.presentLoading()
    if(this.customer){
      payload = {
        ...this.customer,
        ...payload,
      }

      //
      this.customerStore.updateCustomer(payload);
    }else{
      this.customerStore.addCustomer(payload)
    }
    this.drawerRef.close();
  }

  ngOnDestroy(){}
}
