import { Component, OnInit, Input } from '@angular/core';
import {
  WeekDetailsDTO,
  TeamSheetItemDTO,
  AssetType
} from '@pointsulator/api-interface';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { countBy } from 'ramda';
import { ItemPoints } from '../item-points/item-points.component';

const itemGroup = (item: TeamSheetItemDTO) =>
  new FormGroup({
    item: new FormControl(item),
    didNotPlay: new FormControl(false),
    goals: new FormControl(0),
    ownGoals: new FormControl(0),
    conceded: new FormControl(0),
    redCard: new FormControl(false)
  });

@Component({
  selector: 'pt-week-form',
  templateUrl: './week-form.component.html',
  styleUrls: ['./week-form.component.scss']
})
export class WeekFormComponent implements OnInit {
  week: WeekDetailsDTO;

  form: FormGroup;
  teams = new FormArray([]);

  @Input('week')
  public set weekInput(value: WeekDetailsDTO) {
    this.week = value;

    if (value) {
      this.teams.clear();
      this.teams.controls.push(
        ...value.teams.map(team => new FormControl(team))
      );
    }
  }

  constructor() {
    this.form = new FormGroup({
      teams: this.teams
    });
  }

  ngOnInit() {}
}
