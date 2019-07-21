import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamPointsComponent } from './team-points.component';

describe('TeamPointsComponent', () => {
  let component: TeamPointsComponent;
  let fixture: ComponentFixture<TeamPointsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamPointsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
