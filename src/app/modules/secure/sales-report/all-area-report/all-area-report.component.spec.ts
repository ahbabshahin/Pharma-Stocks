import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAreaReportComponent } from './all-area-report.component';

describe('AllAreaReportComponent', () => {
  let component: AllAreaReportComponent;
  let fixture: ComponentFixture<AllAreaReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllAreaReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllAreaReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
