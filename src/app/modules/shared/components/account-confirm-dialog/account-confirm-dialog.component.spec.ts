import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountConfirmDialogComponent } from './account-confirm-dialog.component';

describe('AccountConfirmDialogComponent', () => {
  let component: AccountConfirmDialogComponent;
  let fixture: ComponentFixture<AccountConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountConfirmDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
