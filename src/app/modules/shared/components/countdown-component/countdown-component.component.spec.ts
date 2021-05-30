import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountdownComponentComponent } from './countdown-component.component';

describe('CountdownComponentComponent', () => {
  let component: CountdownComponentComponent;
  let fixture: ComponentFixture<CountdownComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountdownComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountdownComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
