import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaCodeComponent } from './area-code.component';

describe('AreaCodeComponent', () => {
  let component: AreaCodeComponent;
  let fixture: ComponentFixture<AreaCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaCodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AreaCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
