import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpLoginDialogComponent } from './otp-login-dialog.component';

describe('OtpLoginDialogComponent', () => {
  let component: OtpLoginDialogComponent;
  let fixture: ComponentFixture<OtpLoginDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtpLoginDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtpLoginDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
