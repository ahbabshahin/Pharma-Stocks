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
  step: number = 1;
  usernameForm: FormGroup;
  passwordForm: FormGroup;
  setPasswordForm: FormGroup;
  passwordVisible: boolean = false;
  options: string[] = [];
  username: string;
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
    this.usernameForm = this.fb.group({
      username: ['', Validators.required],
    });

    this.passwordForm = this.fb.group({
      password: ['', Validators.required],
    });

    this.setPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.options = value ? [value, value + value, value + value + value] : [];
  }

  checkUser() {
    if (this.usernameForm.invalid) return;

    this.username = this.usernameForm.value.username;

    // this.http.post('/api/check-user', { username: this.username }).subscribe(
    //   (res: any) => {
    //     if (res.exists) {
    //       if (res.hasPassword) {
    //         this.step = 2; // Go to password entry
    //       } else {
    //         this.step = 3; // Go to set password
    //       }
    //     } else {
    //       alert('User does not exist');
    //     }
    //   },
    //   (err) => {
    //     console.error('Error checking user:', err);
    //   }
    // );
  }

  // Step 2: Login
  onLogin() {
    if (this.passwordForm.invalid) return;

    // this.http.post('/api/login', {
    //   username: this.username,
    //   password: this.passwordForm.value.password,
    // }).subscribe(
    //   (res) => {
    //     console.log('Login successful', res);
    //     // Redirect or store token
    //   },
    //   (err) => {
    //     console.error('Login failed', err);
    //   }
    // );
  }

  // Step 3: Set new password
  setNewPassword() {
    if (this.setPasswordForm.invalid) return;

    // this.http.post('/api/set-password', {
    //   username: this.username,
    //   newPassword: this.setPasswordForm.value.newPassword,
    // }).subscribe(
    //   (res) => {
    //     alert('Password set successfully! Please login.');
    //     this.step = 1; // Go back to username section
    //   },
    //   (err) => {
    //     console.error('Error setting password:', err);
    //   }
    // );
  }

  ngOnDestroy() {}
}
