import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWeekPageComponent } from './create-week-page.component';

describe('CreateWeekPageComponent', () => {
  let component: CreateWeekPageComponent;
  let fixture: ComponentFixture<CreateWeekPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateWeekPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWeekPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
