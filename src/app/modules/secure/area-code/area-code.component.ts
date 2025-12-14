import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AreaCodeListComponent } from 'src/app/modules/secure/area-code/area-code-list/area-code-list.component';
import { AreaCodeStoreService } from 'src/app/service/area-code/area-code-store.service';
import { lastValueFrom, Observable, of, Subject, takeUntil } from 'rxjs';
import { LoaderComponent } from 'src/app/common-component/loader/loader.component';
import { AreaCode } from 'src/app/store/models/area-code.model';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonService } from '../../../service/common/common.service';

@Component({
	standalone: true,
	selector: 'app-area-code',
	templateUrl: './area-code.component.html',
	styleUrl: './area-code.component.scss',
	imports: [
		CommonModule,
		AreaCodeListComponent,
		LoaderComponent,
		NzButtonModule,
	],
})
export class AreaCodeComponent {
	unsubscribe$: any = new Subject<void>();
	loader$: Observable<boolean> = of(true);
	isMobile: boolean = false;
	constructor(
		private areaCodeStore: AreaCodeStoreService,
		private drawerService: NzDrawerService,
		private commonService: CommonService
	) {}

	ngOnInit() {
		this.intitalize();
	}

	intitalize() {
		this.getLoader();
		this.isAreaCodeLoaded();
		this.getScreenSize();
	}

	async getScreenSize() {
		this.isMobile = await lastValueFrom(this.commonService.isItAMobile$());
	}

	getLoader() {
		const { getAreaCodeLoader } = this.areaCodeStore;
		this.loader$ = getAreaCodeLoader();
	}

	isAreaCodeLoaded() {
		const { getAreaCodeLoaded } = this.areaCodeStore;

		getAreaCodeLoaded()
			.pipe(takeUntil(this.unsubscribe$))
			.subscribe({
				next: (loaded: boolean) => {
					if (!loaded) {
						this.loadAreaCodes();
					}
				},
			});
	}

	loadAreaCodes() {
		this.areaCodeStore.loadAreaCodes();
	}

	async addAreaCode(area?: AreaCode) {
		const { NewAreaCodeComponent } = await import(
			'src/app/modules/secure/area-code/new-area-code/new-area-code.component'
		);
		this.drawerService.create({
			nzTitle: `${area ? 'Update': 'New'} Area Code`,
			nzClosable: true,
			nzMaskClosable: false,
			nzWidth: this.isMobile ? '100%' : '50%',
			nzWrapClassName: 'full-drawer',
			nzContent: NewAreaCodeComponent,
			nzData: { area },
		});
	}

	ngOnDestroy() {
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}
}
