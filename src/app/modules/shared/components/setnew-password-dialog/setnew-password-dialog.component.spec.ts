import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetnewPasswordDialogComponent } from './setnew-password-dialog.component';

describe('SetnewPasswordDialogComponent', () => {
  let component: SetnewPasswordDialogComponent;
  let fixture: ComponentFixture<SetnewPasswordDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetnewPasswordDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetnewPasswordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
