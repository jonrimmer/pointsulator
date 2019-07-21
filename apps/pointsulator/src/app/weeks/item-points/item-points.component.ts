import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

export interface ItemPoints {
  didNotPlay: boolean;
  goals: number;
  ownGoals: number;
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'tr[pt-item-points]',
  templateUrl: './item-points.component.html',
  styleUrls: ['./item-points.component.scss']
})
export class ItemPointsComponent implements OnInit {
  constructor() {}

  get isSub() {
    return this.form ? this.form.value.sub : false;
  }

  get isActive() {
    return this.form ? this.form.value.active : false;
  }

  get asset() {
    return this.form ? this.form.value.asset : null;
  }

  get points() {
    return this.form ? this.form.value.points : 0;
  }

  @Input()
  public form: FormGroup;

  ngOnInit() {}
}
