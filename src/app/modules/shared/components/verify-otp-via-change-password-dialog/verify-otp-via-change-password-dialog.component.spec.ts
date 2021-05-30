import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyOtpViaChangePasswordDialogComponent } from './verify-otp-via-change-password-dialog.component';

describe('VerifyOtpViaChangePasswordDialogComponent', () => {
  let component: VerifyOtpViaChangePasswordDialogComponent;
  let fixture: ComponentFixture<VerifyOtpViaChangePasswordDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyOtpViaChangePasswordDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyOtpViaChangePasswordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
