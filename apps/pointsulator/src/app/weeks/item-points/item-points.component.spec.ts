import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemPointsComponent } from './item-points.component';

describe('ItemPointsComponent', () => {
  let component: ItemPointsComponent;
  let fixture: ComponentFixture<ItemPointsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemPointsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
