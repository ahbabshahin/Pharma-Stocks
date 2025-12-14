import { Injectable } from '@angular/core';
import { LoaderModalComponent } from '../../common-component/loader-modal/loader-modal.component';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ToastrService } from 'ngx-toastr';
import { NzNotificationPlacement, NzNotificationService } from 'ng-zorro-antd/notification';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { first, map, Observable, take } from 'rxjs';
@Injectable({
	providedIn: 'root',
})
export class CommonService {
	private loaderModal: NzModalRef<LoaderModalComponent> | null = null;
	constructor(
		private modalService: NzModalService,
		private toastr: ToastrService,
		private notification: NzNotificationService,
		private breakPointObserver: BreakpointObserver
	) {}

	presentLoading(loading_text: string = 'Please wait...') {
		if (this.loaderModal) return;
		this.loaderModal = this.modalService.create({
			nzContent: LoaderModalComponent,
			nzClassName: 'loader-modal',
			nzWidth: null as unknown as number,
			nzMaskClosable: true,
			nzFooter: null,
			nzCentered: true,
			nzCancelText: null,
			nzClosable: false,
			// nzData:loading_text    // for v15.1.0
		});
		// for v15.1.0 no need for this
		const comp: any = this.loaderModal.getContentComponent();
		comp.text = loading_text;
	}

	dismissLoading() {
		if (this.loaderModal) {
			this.loaderModal.destroy();
			this.loaderModal = null;
		}
	}

	showConfirmModal(title: string): Promise<boolean> {
		return new Promise((resolve) => {
			this.modalService.confirm({
				nzTitle: title,
				nzOkText: 'Yes',
				nzOkType: 'primary',
				nzOkDanger: true,
				nzCancelText: 'No',
				nzClosable: false,
				nzCentered: true,
				nzOnOk: () => resolve(true),
				nzOnCancel: () => resolve(false),
			});
		});
	}

	showInfoModal(title: string, message?: string) {
		this.modalService.info({
			nzTitle: title,
			nzContent: message || '',
			// nzOnOk: () => console.log('Info OK')
		});
	}

	private showToast(
		type: string,
		msg: string,
		duration: number,
		placement: NzNotificationPlacement = 'topRight'
	): void {
		this.notification.create(type, '', msg, {
			nzDuration: duration,
			nzPlacement: placement,
		});
	}

	showSuccessToast(message: string = 'Successful') {
		this.showToast('success', message, 3000);
	}

	showErrorToast(message: string = 'Something went wrong') {
		this.showToast('error', message, 3000);
	}

	showSuccessModal(
		message: string = 'Successful',
		title: string = 'Success'
	) {
		this.modalService.success({
			nzTitle: title,
			nzContent: message,
			nzClosable: false,
			nzCentered: true,
		});
	}
	showErrorModal(
		message: string = 'Something went wrong',
		title: string = 'Error'
	) {
		this.modalService.error({
			nzTitle: title,
			nzContent: message,
			nzClosable: false,
			nzCentered: true,
		});
	}
	showWarningModal(
		message: string = 'Please follow the instructions',
		title: string = 'Warning'
	) {
		this.modalService.warning({
			nzTitle: title,
			nzContent: message,
			nzClosable: false,
			nzCentered: true,
		});
	}

	decodeJWT() {
		const token = sessionStorage.getItem('accessToken');
		if (token) {
			const base64Url = token.split('.')[1]; // Get the payload part
			const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Replace URL-safe characters
			const decodedPayload = JSON.parse(window.atob(base64)); // Decode and parse JSON
			return decodedPayload;
		}
	}

	isItAMobile$(): Observable<boolean> {
		return this.breakPointObserver
			.observe([
				Breakpoints.HandsetPortrait,
				Breakpoints.HandsetLandscape,
			])
			.pipe(
				// Use 'first()' to get the initial match and complete the observable
				first(),
				// Use map to transform the ObserverResponse into a simple boolean
				map((observer) => observer.matches)
			);
	}
}
