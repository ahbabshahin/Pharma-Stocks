import { Injectable } from '@angular/core';
import { LoaderModalComponent } from '../../common-component/loader-modal/loader-modal.component';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ToastrService } from 'ngx-toastr';
import { NzNotificationPlacement, NzNotificationService } from 'ng-zorro-antd/notification';
@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private loaderModal: NzModalRef<LoaderModalComponent> | null = null;
  constructor(
    private modalService: NzModalService,
    private toastr: ToastrService,
    private notification: NzNotificationService
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

  decodeJWT() {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      const base64Url = token.split('.')[1]; // Get the payload part
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Replace URL-safe characters
      const decodedPayload = JSON.parse(window.atob(base64)); // Decode and parse JSON
      return decodedPayload;
    }
  }
}
