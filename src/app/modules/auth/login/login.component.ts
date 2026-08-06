import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginCred, User } from '../../../store/models/user.model';
import { AuthStoreService } from '../../../service/auth/auth-store.service';
import { CommonService } from '../../../service/common/common.service';
import { AuthApiService } from '../../../service/auth/auth-api.service';
import { SubSink } from 'subsink';
import { UserApiService } from '../../../service/user/user-api.service';
import { ActivatedRoute, Router } from '@angular/router';

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
	setupToken = '';
	constructor(
		private fb: FormBuilder,
		private authStore: AuthStoreService,
		private commonService: CommonService,
		private userApi: UserApiService,
		private route: ActivatedRoute,
		private router: Router,
	) {}

	ngOnInit() {
		this.initialize();
		this.setupToken =
			this.route.snapshot.queryParamMap.get('setupToken') || '';

		if (this.setupToken) {
			this.step = 3;
			this.router.navigate([], {
				relativeTo: this.route,
				queryParams: {},
				replaceUrl: true,
			});
		}
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
			confirmPassword: [
				'',
				[Validators.required, Validators.minLength(6)],
			],
		});
	}

	onInput(event: Event): void {
		const value = (event.target as HTMLInputElement).value;
		this.options = value
			? [value, value + value, value + value + value]
			: [];
	}

	checkUser() {
		if (this.usernameForm.invalid) return;
		this.commonService.presentLoading();

		this.username = this.usernameForm.value.username;
		this.username = this.username.trim();

		this.step = 2;
		this.commonService.dismissLoading();
	}

	// Step 2: Login
	onLogin() {
		if (this.passwordForm.invalid) return;
		let payload: LoginCred = {
			username: this.username,
			password: this.passwordForm?.value?.password,
		};
		this.commonService.presentLoading();
		this.authStore.login(payload);
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
		const payload = {
			token: this.setupToken,
			password: this.setPasswordForm?.value?.newPassword,
			confirmPassword: this.setPasswordForm?.value?.confirmPassword,
		};
		this.subs.sink = this.userApi.setPassword(payload).subscribe({
			next: (res) => {
				this.commonService.showSuccessToast(
					'Password set successfully! Please login.',
				);
				this.step = 1;
				this.setupToken = '';
				this.commonService.dismissLoading();
			},
			error: (err) => {
				this.commonService.showErrorToast(
					err?.error?.message || 'Error setting password',
				);
				this.commonService.dismissLoading();
			},
		});
	}

	ngOnDestroy() {
		this.subs.unsubscribe();
	}
}
