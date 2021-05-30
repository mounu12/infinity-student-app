import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPhoneNumberDialogComponent } from './edit-phone-number-dialog.component';

describe('EditPhoneNumberDialogComponent', () => {
  let component: EditPhoneNumberDialogComponent;
  let fixture: ComponentFixture<EditPhoneNumberDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPhoneNumberDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPhoneNumberDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
