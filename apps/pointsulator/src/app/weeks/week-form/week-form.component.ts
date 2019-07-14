import { Component, OnInit, Input } from '@angular/core';
import {
  WeekDetailsDTO,
  TeamSheetItemDTO,
  AssetType
} from '@pointsulator/api-interface';
import { FormGroup, FormArray, FormControl } from '@angular/forms';

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

    this.teams.clear();

    value.teams.forEach(team => {
      const keeper = new FormArray([]);
      const defence = new FormArray([]);
      const midfield = new FormArray([]);
      const forwards = new FormArray([]);

      const group = new FormGroup({
        keeper,
        defence,
        midfield,
        forwards
      });

      team.items.forEach(item => {
        const ctrl = itemGroup(item);

        switch (item.asset.type) {
          case AssetType.Goalkeeper:
            keeper.controls.push(ctrl);
            return;
          case AssetType.Defence:
            defence.controls.push(ctrl);
            return;
          case AssetType.Midfielder:
            midfield.controls.push(ctrl);
            return;
          case AssetType.Forward:
            forwards.controls.push(ctrl);
            return;
        }
      });

      this.teams.push(group);
    });
  }

  constructor() {
    this.form = new FormGroup({
      teams: this.teams
    });
  }

  ngOnInit() {}
}
