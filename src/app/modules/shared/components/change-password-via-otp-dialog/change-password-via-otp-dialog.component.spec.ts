import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordViaOtpDialogComponent } from './change-password-via-otp-dialog.component';

describe('ChangePasswordViaOtpDialogComponent', () => {
  let component: ChangePasswordViaOtpDialogComponent;
  let fixture: ComponentFixture<ChangePasswordViaOtpDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangePasswordViaOtpDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordViaOtpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
