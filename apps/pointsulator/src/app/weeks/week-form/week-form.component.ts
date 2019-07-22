import { Component, OnInit, Input } from '@angular/core';
import { WeekDetailsDTO } from '@pointsulator/api-interface';
import { FormGroup, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'pt-week-form',
  templateUrl: './week-form.component.html',
  styleUrls: ['./week-form.component.scss']
})
export class WeekFormComponent implements OnInit {
  week: WeekDetailsDTO;

  public form: FormGroup;

  idCtrl = new FormControl();
  teamsCtrl = new FormArray([]);

  @Input('week')
  public set weekInput(value: WeekDetailsDTO) {
    this.week = value;

    if (value) {
      this.teamsCtrl.clear();
      value.teams.forEach(team => this.teamsCtrl.push(new FormControl(team)));
      this.idCtrl.setValue(value.id);
    }
  }

  constructor() {
    this.form = new FormGroup({
      id: this.idCtrl,
      teams: this.teamsCtrl
    });

    this.form.valueChanges.subscribe(value => {
      console.log(value);
    });
  }

  ngOnInit() {}
}
