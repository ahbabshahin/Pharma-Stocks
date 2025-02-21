import { Component } from '@angular/core';
import { User } from '../../../../store/models/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserStoreService } from '../../../../service/user/user-store.service';
import { CommonService } from '../../../../service/common/common.service';
import { NzDrawerRef } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.scss'
})
export class NewUserComponent {
  user!: User;
  total!: number;
  userForm!: FormGroup;
  isEdit = false;

  constructor(
    private formBuilder: FormBuilder,
    private userStore: UserStoreService,
    private commonService: CommonService,
    private drawerRef: NzDrawerRef,
  ) {}

  ngOnInit(): void {
    this.initialize();
    if (this.user) {
      this.isEdit = true;
      this.populateForm();
    }
  }

  initialize(){
    this.initializeForm();
  }

  initializeForm(){
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      role: ['user'],
    });
  }

  populateForm(){
    this.userForm.patchValue({
      ...this.user
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      console.log(this.isEdit ? 'Update User' : 'Add User', this.userForm.value);
      let payload: User = {
        ...this.userForm?.value
      }
      this.commonService.presentLoading();
      if (this.user) {
        payload = {
         ...payload,
          _id: this.user._id,
        };
        this.userStore.updateUser(payload);
      }
      else this.userStore.addUser(payload);
      this.drawerRef.close();
    }
  }

  onCancel(): void {
    this.userForm.reset();
  }

  noOnDestroy(){}
}
