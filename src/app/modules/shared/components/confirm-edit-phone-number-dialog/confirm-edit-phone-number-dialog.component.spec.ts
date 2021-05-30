import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmEditPhoneNumberDialogComponent } from './confirm-edit-phone-number-dialog.component';

describe('ConfirmEditPhoneNumberDialogComponent', () => {
  let component: ConfirmEditPhoneNumberDialogComponent;
  let fixture: ComponentFixture<ConfirmEditPhoneNumberDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmEditPhoneNumberDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmEditPhoneNumberDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
