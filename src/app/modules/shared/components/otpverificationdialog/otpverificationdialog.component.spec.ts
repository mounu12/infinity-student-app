import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpverificationdialogComponent } from './otpverificationdialog.component';

describe('OtpverificationdialogComponent', () => {
  let component: OtpverificationdialogComponent;
  let fixture: ComponentFixture<OtpverificationdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtpverificationdialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtpverificationdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
