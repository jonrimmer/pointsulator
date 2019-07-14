import { Component, OnInit, Input, ViewChild, OnChanges } from '@angular/core';
import {
  AssetDTO,
  AssetType,
  WeekDTO,
  TeamSheetDTO
} from '@pointsulator/api-interface';
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  ValidatorFn,
  ValidationErrors
} from '@angular/forms';
import { MatTable } from '@angular/material';
import { onlyFridays } from '../../utils/dates';

const isSingular = (asset: AssetDTO) =>
  asset.type === AssetType.Defence || asset.type === AssetType.Goalkeeper;

const assetTypeOrder = [
  AssetType.Goalkeeper,
  AssetType.Defence,
  AssetType.Midfielder,
  AssetType.Forward
];
export interface TeamSheetFormItem {
  asset: AssetDTO;
  playing: boolean;
  substitute: boolean;
}

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
  styleUrls: ['./team-sheet-form.component.scss']
})
export class TeamSheetFormComponent implements OnInit, OnChanges {
  @Input('assets')
  public set assetsInput(assets: AssetDTO[]) {
    this.assets = assets;
    this.assetsArray.clear();

    if (assets) {
      assets.forEach(asset => {
        const playingCtrl = new FormControl(false);
        const subCtrl = new FormControl({ value: false, disabled: true });

        const ctrl = new FormGroup({
          asset: new FormControl(asset),
          playing: playingCtrl,
          substitute: subCtrl,
          precedence: new FormControl()
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

          setTimeout(() => this.sort(), 0);
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

          setTimeout(() => this.sort(), 0);
        });

        this.assetsArray.push(ctrl);
      });

      this.dataTable.renderRows();
    }
  }

  constructor() {}
  public validFrom = new FormControl(null, [Validators.required]);
  public assetsArray = new FormArray([], { validators: legalTeamValidator });
  public displayedColumns = [
    'precedence',
    'name',
    'type',
    'team',
    'playing',
    'substitute'
  ];

  public form = new FormGroup({
    validFrom: this.validFrom,
    assets: this.assetsArray
  });

  @ViewChild('dataTable', { static: true })
  dataTable: MatTable<any>;

  assets: AssetDTO[];

  @Input()
  public weeks: WeekDTO[];

  @Input()
  public teamSheet: TeamSheetDTO;

  onlyFridays = onlyFridays;

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

  ngOnInit() {}

  ngOnChanges(): void {
    if (this.assets && this.teamSheet && this.weeks) {
      this.applySheet();
    }
  }

  sort() {
    this.assetsArray.controls.sort((a, b) => {
      const itemA = a.value as TeamSheetFormItem;
      const itemB = b.value as TeamSheetFormItem;

      if (itemA.asset.type !== itemB.asset.type) {
        return (
          assetTypeOrder[itemA.asset.type] - assetTypeOrder[itemB.asset.type]
        );
      }

      if (itemA.playing) {
        if (!itemB.playing) {
          return -1;
        }

        if (itemA.substitute) {
          if (!itemB.substitute) {
            return 1;
          }
        } else if (itemB.substitute) {
          return -1;
        }
      } else if (itemB.playing) {
        return 1;
      }

      return 0;
    });

    this.dataTable.renderRows();
  }

  increasePrecedence(index: number) {
    const item = this.assetsArray.controls[index];
    const itemValue = item.value as TeamSheetFormItem;

    if (index === 0) {
      return;
    }

    const above = this.assetsArray.controls[index - 1];
    const aboveValue = above.value as TeamSheetFormItem;

    if (
      aboveValue.asset.type === itemValue.asset.type &&
      aboveValue.substitute
    ) {
      this.assetsArray.controls[index - 1] = item;
      this.assetsArray.controls[index] = above;
    }

    this.dataTable.renderRows();
  }

  decreasePrecedence(index: number) {
    const item = this.assetsArray.controls[index];
    const itemValue = item.value as TeamSheetFormItem;

    if (index === this.assetsArray.controls.length - 1) {
      return;
    }

    const below = this.assetsArray.controls[index + 1];
    const belowValue = below.value as TeamSheetFormItem;

    if (
      belowValue.asset.type === itemValue.asset.type &&
      belowValue.substitute
    ) {
      this.assetsArray.controls[index + 1] = item;
      this.assetsArray.controls[index] = below;
    }

    this.dataTable.renderRows();
  }

  applySheet() {
    this.validFrom.setValue(this.teamSheet.validFrom);

    this.assetsArray.controls.forEach(ctrl => {
      const ctrlValue = ctrl.value as TeamSheetFormItem;

      const sheetAsset = this.teamSheet.items.find(
        item => item.asset.id === ctrlValue.asset.id
      );

      if (sheetAsset) {
        ctrl.patchValue({
          playing: true,
          substitute: sheetAsset.substitute
        });
      }
    });
  }
}
