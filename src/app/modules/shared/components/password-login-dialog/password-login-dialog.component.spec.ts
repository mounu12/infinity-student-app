import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordLoginDialogComponent } from './password-login-dialog.component';

describe('PasswordLoginDialogComponent', () => {
  let component: PasswordLoginDialogComponent;
  let fixture: ComponentFixture<PasswordLoginDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordLoginDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordLoginDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
