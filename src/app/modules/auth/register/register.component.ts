import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../service/common/common.service';
import { RegisterCred } from '../../../store/models/user.model';
import { AuthStoreService } from '../../../service/auth/auth-store.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private authStore: AuthStoreService,
  ) {}

  ngOnInit() {
    this.initialize();
  }

  initialize(){
    this.initializeForm();
  }

  initializeForm(){
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {

    const formRes: {
      name: string,
      username:  string,
      email: string,
      password:  string,
      confirmPassword?:  string,
    } = this.registerForm?.value;

    if(formRes?.password !== formRes?.confirmPassword) {
      this.commonService.showErrorToast(
        `Passwords do not match`,
      );
      return
    }else{
      delete formRes.confirmPassword;
      let payload: RegisterCred = formRes;
      payload = {
        ...payload,
        username: payload?.username?.trim(),
      }

      this.commonService.presentLoading();
      this.authStore.register(payload);
    }
  }

  ngOnDestroy() {
  }
}
