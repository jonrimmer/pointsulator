import { Component, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
  FormArray,
  FormGroup
} from '@angular/forms';
import {
  AssetType,
  TeamSheetItemDTO,
  WeekTeamSheetDTO
} from '@pointsulator/api-interface';
import { observeOn } from 'rxjs/operators';
import { asyncScheduler } from 'rxjs';
import { mapValues } from 'lodash';

interface AssetEvents {
  goals: number;
  assists: number;
  conceded: number;
  ownGoals: number;
  redCard: boolean;
}

@Component({
  selector: 'pt-team-points',
  templateUrl: './team-points.component.html',
  styleUrls: ['./team-points.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TeamPointsComponent,
      multi: true
    }
  ]
})
export class TeamPointsComponent implements OnInit, ControlValueAccessor {
  constructor() {}
  public keepers = new FormArray([]);
  public defence = new FormArray([]);
  public midfield = new FormArray([]);
  public forwards = new FormArray([]);

  assets = new FormGroup({
    [AssetType.Goalkeeper]: this.keepers,
    [AssetType.Defence]: this.defence,
    [AssetType.Midfielder]: this.midfield,
    [AssetType.Forward]: this.forwards
  });

  totalPoints = new FormControl(0);
  managerCtrl = new FormControl();
  startingPointsCtrl = new FormControl();

  form = new FormGroup({
    assets: this.assets,
    points: this.totalPoints
  });

  AssetType = AssetType;

  byType: Record<AssetType, TeamSheetItemDTO[]>;

  team: WeekTeamSheetDTO;

  onChange = (value: any) => {};
  onTouched = () => {};

  ngOnInit() {
    this.totalPoints.valueChanges
      .pipe(observeOn(asyncScheduler, 10))
      .subscribe(() => {
        if (this.onChange) {
          const { points, assets } = this.form.value;
          this.onChange({
            ...this.team,
            points,
            ...mapValues(assets, (items: any[]) =>
              items.map(item => ({
                id: item.asset.id,
                asset: item.asset,
                didNotPlay: item.didNotPlay,
                goals: item.events.goals,
                assists: item.events.assists,
                conceded: item.events.conceded,
                redCard: item.events.redCard
              }))
            )
          });
        }
      });
  }

  writeValue(obj: WeekTeamSheetDTO): void {
    this.team = obj;

    if (obj) {
      this.keepers.clear();
      this.defence.clear();
      this.midfield.clear();
      this.forwards.clear();

      Object.values(AssetType).forEach((type: AssetType) => {
        const array = this.assets.get(type) as FormArray;

        const ofType = obj[type];

        if (ofType) {
          ofType.forEach(item => {
            const ctrl = new FormGroup({
              id: new FormControl(item.id),
              asset: new FormControl(item.asset),
              substitute: new FormControl(item.substitute),
              didNotPlay: new FormControl(item.didNotPlay),
              active: new FormControl(!item.substitute),
              events: new FormGroup({
                goals: new FormControl(item.goals),
                assists: new FormControl(item.assists),
                conceded: new FormControl(item.conceded),
                redCard: new FormControl(item.redCard)
              }),
              points: new FormControl(0)
            });

            if (item.didNotPlay) {
              ctrl.get('events').disable();
            }

            ctrl
              .get('didNotPlay')
              .valueChanges.pipe(observeOn(asyncScheduler, 10))
              .subscribe(() => {
                this.recalcSubs(array);
                this.calcTeamPoints();
              });

            ctrl
              .get('events')
              .valueChanges.pipe(observeOn(asyncScheduler, 10))
              .subscribe(events => {
                this.calcAssetPoints(ctrl, events);
                this.calcTeamPoints();
              });

            this.calcAssetPoints(ctrl, ctrl.value.events);

            array.push(ctrl);
          });
        }
      });

      this.calcTeamPoints();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  recalcSubs(array: FormArray) {
    let toPlay = array.controls.filter(ctrl => !ctrl.value.sub).length;

    array.controls.forEach(ctrl => {
      const active = ctrl.get('active');
      const events = ctrl.get('events');

      if (toPlay > 0) {
        if (!ctrl.value.didNotPlay) {
          toPlay -= 1;
          active.setValue(true);
          events.enable();
        } else {
          active.setValue(false);
          events.setValue({
            goals: 0,
            conceded: 0,
            redCard: false,
            assists: 0
          });
          events.disable();
        }
      } else {
        active.setValue(false);
        events.setValue({
          goals: 0,
          conceded: 0,
          redCard: false,
          assists: 0
        });
        events.disable();
      }
    });
  }

  calcAssetPoints(
    ctrl: FormGroup,
    { goals, conceded, redCard, assists }: AssetEvents
  ) {
    let points = 0;

    if (!ctrl.value.didNotPlay) {
      const hatricks = Math.floor(goals / 3);

      switch (ctrl.value.asset.type as AssetType) {
        case AssetType.Goalkeeper:
          points = (goals + hatricks) * 10 + (conceded > 0 ? -conceded : 4);
          break;
        case AssetType.Defence:
          points = (goals + hatricks) * 5 + (conceded > 0 ? -conceded : 3);
          break;
        case AssetType.Midfielder:
          points = (goals + hatricks) * 4;
          break;
      }

      points += assists;

      if (redCard) {
        points -= 3;
      }
    }

    ctrl.patchValue({
      points
    });
  }

  calcTeamPoints() {
    let totalPoints = 0;

    Object.values(this.assets.controls).forEach((array: FormArray) => {
      array.controls
        .filter(ctrl => ctrl.value.active)
        .forEach(ctrl => {
          totalPoints += ctrl.value.points;
        });
    });

    this.form.get('points').setValue(totalPoints);
  }
}
