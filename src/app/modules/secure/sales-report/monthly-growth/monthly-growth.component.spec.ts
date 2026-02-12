import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyGrowthComponent } from './monthly-growth.component';

describe('MonthlyGrowthComponent', () => {
  let component: MonthlyGrowthComponent;
  let fixture: ComponentFixture<MonthlyGrowthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyGrowthComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MonthlyGrowthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
