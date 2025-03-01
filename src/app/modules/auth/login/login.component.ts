import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginCred, User } from '../../../store/models/user.model';
import { AuthStoreService } from '../../../service/auth/auth-store.service';
import { CommonService } from '../../../service/common/common.service';
import { AuthApiService } from '../../../service/auth/auth-api.service';
import { SubSink } from 'subsink';
import { UserApiService } from '../../../service/user/user-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  step: number = 1;
  usernameForm: FormGroup;
  passwordForm: FormGroup;
  setPasswordForm: FormGroup;
  passwordVisible: boolean = false;
  newPasswordVisible = false;
  confirmPasswordVisible = false;
  options: string[] = [];
  username: string;
  subs = new SubSink();
  user: User;
  constructor(
    private fb: FormBuilder,
    private authStore: AuthStoreService,
    private commonService: CommonService,
    private authApi: AuthApiService,
    private userApi: UserApiService,
  ) {}

  ngOnInit() {
    this.initialize();
  }
  initialize() {
    this.initializeForm();
  }

  initializeForm() {
    this.usernameForm = this.fb.group({
      username: ['', Validators.required],
    });

    this.passwordForm = this.fb.group({
      password: ['', Validators.required],
    });

    this.setPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.options = value ? [value, value + value, value + value + value] : [];
  }

  checkUser() {
    if (this.usernameForm.invalid) return;
    this.commonService.presentLoading();

    this.username = this.usernameForm.value.username;
    this.username = this.username.trim();

    this.subs.sink = this.authApi.checkUserExist(this.username).subscribe({
      next: (res: User) => {
        if (res) {
          if (res?.isPasswordSet) {
            this.step = 2; // Go to password entry
          } else {
            this.step = 3; // Go to set password
          }
          this.user = res;
        } else {
          this.commonService.showErrorToast('User does not exist');
        }
        this.commonService.dismissLoading();
      },
      error:(err) => {
        this.commonService.dismissLoading();
        console.error('Error checking user:', err);
        this.commonService.showErrorToast('User does not exist');
      }
    });
  }

  // Step 2: Login
  onLogin() {
    if (this.passwordForm.invalid) return;
    let payload: LoginCred = {
      username: this.username,
      password: this.passwordForm?.value?.password,
    }
    this.commonService.presentLoading();
    this.authStore.login(payload)
  }

  get passwordsDoNotMatch(): boolean {
    return (
      this.setPasswordForm.get('newPassword')?.value !==
      this.setPasswordForm.get('confirmPassword')?.value
    );
  }

  // Step 3: Set new password
  setNewPassword() {
    if (this.setPasswordForm.invalid) return;
    this.commonService.presentLoading();
    let payload: LoginCred = {
      username: this.username,
      password: this.setPasswordForm?.value?.newPassword,
    }
    this.subs.sink = this.userApi.setPassword(this.user?._id as string, payload).subscribe({
      next:(res) => {
        this.commonService.showSuccessToast('Password set successfully! Please login.');
        this.step = 1; // Go back to username section
        this.commonService.dismissLoading();
      },
      error:(err) => {
        console.error('Error setting password:', err);
        this.commonService.showErrorToast('Error setting password');
        this.commonService.dismissLoading();
      }
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
