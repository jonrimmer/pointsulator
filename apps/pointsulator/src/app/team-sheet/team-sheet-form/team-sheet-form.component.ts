import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AssetDTO, AssetType } from '@pointsulator/api-interface';
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  ValidatorFn,
  ValidationErrors
} from '@angular/forms';
import { MatTable, MatSort, Sort } from '@angular/material';

const isSingular = (asset: AssetDTO) =>
  asset.type === AssetType.Defence || asset.type === AssetType.Goalkeeper;

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

function compareBoolean(
  a: boolean,
  b: boolean,
  a_id: number,
  b_id: number,
  isAsc: boolean
) {
  const result = a
    ? b
      ? compare(a_id, b_id, true)
      : 1
    : b
    ? -1
    : compare(a_id, b_id, true);
  return isAsc ? result : result * -1;
}

export interface TeamSheetFormItem {
  asset: AssetDTO;
  playing: boolean;
  substitute: boolean;
}

const SORTS = {
  name: (value: TeamSheetFormItem) => value.asset.name,
  type: (value: TeamSheetFormItem) => value.asset.type,
  team: (value: TeamSheetFormItem) => value.asset.team,
  playing: (value: TeamSheetFormItem) => value.playing,
  substitute: (value: TeamSheetFormItem) => value.substitute
};

export const legalTeamValidator: ValidatorFn = (
  control: FormArray
): ValidationErrors | null => {
  let def = 0;
  let keeper = 0;
  let mid = 0;
  let attack = 0;

  control.value.forEach((item: TeamSheetFormItem) => {
    if (item.playing && !item.substitute) {
      switch (item.asset.type) {
        case AssetType.Defence:
          def += 1;
          break;
        case AssetType.Goalkeeper:
          keeper += 1;
          break;
        case AssetType.Midfielder:
          mid += 1;
          break;
        case AssetType.Forward:
          attack += 1;
          break;
      }
    }
  });

  const errors: ValidationErrors = {};
  const outfield = mid + attack;

  if (keeper !== 1) {
    errors.keeper = true;
  }

  if (def !== 1) {
    errors.defence = true;
  }

  if (
    outfield !== 6 ||
    !(
      (mid === 5 && attack === 1) ||
      (mid === 4 && attack === 2) ||
      (mid === 3 && attack === 3)
    )
  ) {
    errors.formation = true;
  }

  if (Object.keys(errors).length > 0) {
    return errors;
  }

  return null;
};

@Component({
  selector: 'pt-team-sheet-form',
  templateUrl: './team-sheet-form.component.html',
  styleUrls: ['./team-sheet-form.component.css']
})
export class TeamSheetFormComponent implements OnInit {
  public week = new FormControl(null, [Validators.required]);
  public assetsArray = new FormArray([], { validators: legalTeamValidator });
  public displayedColumns = ['name', 'type', 'team', 'playing', 'substitute'];

  public form = new FormGroup({
    week: this.week,
    assets: this.assetsArray
  });

  @ViewChild('dataTable', { static: true })
  dataTable: MatTable<any>;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @Input()
  public set assets(assets: AssetDTO[]) {
    this.assetsArray.clear();

    if (assets) {
      assets.forEach(asset => {
        const playingCtrl = new FormControl(false);
        const subCtrl = new FormControl({ value: false, disabled: true });

        const ctrl = new FormGroup({
          asset: new FormControl(asset),
          playing: playingCtrl,
          substitute: subCtrl
        });

        playingCtrl.valueChanges.subscribe(playing => {
          let isSub = false;

          if (playing && isSingular(asset)) {
            const count = this.assetsOfTypePlaying(asset.type);
            isSub = count > 0;
          }

          subCtrl.reset({
            value: isSub,
            disabled: !playing
          });
        });

        subCtrl.valueChanges.subscribe(isSub => {
          if (!isSub && isSingular(asset) && playingCtrl.value) {
            this.assetsOfType(asset.type).forEach(c => {
              const { playing, substitute } = c.value;
              if (ctrl !== c && playing && !substitute) {
                c.patchValue({
                  substitute: true
                });
              }
            });
          }
        });

        this.assetsArray.push(ctrl);
      });

      this.dataTable.renderRows();
    }
  }

  @Input()
  public weeks: {
    num: number;
    date: number;
  }[];

  assetsOfTypePlaying(type: AssetType) {
    return this.assetsOfType(type).filter(
      ({ value }) => value.playing && !value.substitute
    ).length;
  }

  assetsOfType(type: AssetType) {
    return this.assetsArray.controls.filter(
      ({ value }) => value.asset.type === type
    );
  }

  constructor() {}

  ngOnInit() {}

  onSort(sort: Sort) {
    if (!sort.active) {
      return;
    }

    const cmpFn = SORTS[sort.active];
    const isAsc = sort.direction === 'asc';

    switch (sort.active) {
      case 'name':
      case 'type':
      case 'team':
        this.assetsArray.controls.sort((ca, cb) =>
          compare(cmpFn(ca.value), cmpFn(cb.value), isAsc)
        );
        break;
      default:
        this.assetsArray.controls.sort((ca, cb) =>
          compareBoolean(
            cmpFn(ca.value),
            cmpFn(cb.value),
            ca.value.asset.id,
            cb.value.asset.id,
            isAsc
          )
        );
    }

    this.dataTable.renderRows();
  }
}
