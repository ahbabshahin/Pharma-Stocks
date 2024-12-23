import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginCred } from '../../../store/models/user.model';
import { AuthStoreService } from '../../../service/auth/auth-store.service';
import { CommonService } from '../../../service/common/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm!: FormGroup;
  passwordVisible: boolean = false;
  options: string[] = [];

  constructor(
    private fb: FormBuilder,
    private authStore: AuthStoreService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.initialize();
  }
  initialize() {
    this.initializeForm();
  }

  initializeForm() {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.options = value ? [value, value + value, value + value + value] : [];
  }

  onSubmit() {
    const payload: LoginCred = this.loginForm?.value;
    this.commonService.presentLoading();
    this.authStore.login(payload);
  }

  ngOnDestroy() {}
}
