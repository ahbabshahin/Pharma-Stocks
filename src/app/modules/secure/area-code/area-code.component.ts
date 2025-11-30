import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AreaCodeListComponent } from 'src/app/modules/secure/area-code/area-code-list/area-code-list.component';
import { AreaCodeStoreService } from 'src/app/service/area-code/area-code-store.service';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import { LoaderComponent } from 'src/app/common-component/loader/loader.component';

@Component({
	standalone: true,
	selector: 'app-area-code',
	templateUrl: './area-code.component.html',
	styleUrl: './area-code.component.scss',
	imports: [CommonModule, AreaCodeListComponent, LoaderComponent],
})
export class AreaCodeComponent {
	unsubscribe$: any = new Subject<void>();
	loader$: Observable<boolean> = of(true);
	constructor(private areaCodeStore: AreaCodeStoreService) {}

	ngOnInit() {
		this.intitalize();
	}

	intitalize() {
		this.getLoader();
		this.isAreaCodeLoaded();
	}

	getLoader(){
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

	ngOnDestroy() {
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}
}
