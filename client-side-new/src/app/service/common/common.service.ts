import { Injectable } from '@angular/core';
import { LoaderModalComponent } from '../../common-component/loader-modal/loader-modal.component';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private loaderModal: NzModalRef<LoaderModalComponent> | null = null;
  constructor(
    private modalService: NzModalService,
    private toastr:ToastrService,
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

  showSuccessToast(message: string = 'Successful'){
    this.toastr.success(message, 'Success');
  }

  showErrorToast(message: string = 'Something went wrong'){
    console.log('message: ', message);
    this.toastr.error(message, 'Error');
  }
}
