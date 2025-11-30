import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAreaCodeComponent } from './new-area-code.component';

describe('NewAreaCodeComponent', () => {
  let component: NewAreaCodeComponent;
  let fixture: ComponentFixture<NewAreaCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewAreaCodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewAreaCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
