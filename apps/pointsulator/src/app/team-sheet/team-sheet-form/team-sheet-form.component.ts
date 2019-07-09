import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {
  AssetDTO,
  AssetType,
  TeamSheetConfigDTO
} from '@pointsulator/api-interface';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatTable } from '@angular/material';

const isSingular = (asset: AssetDTO) =>
  asset.type === AssetType.Defence || asset.type === AssetType.Goalkeeper;

export interface TeamSheetFormItem {
  asset: AssetDTO;
  playing: boolean;
  substitute: boolean;
}

@Component({
  selector: 'pt-team-sheet-form',
  templateUrl: './team-sheet-form.component.html',
  styleUrls: ['./team-sheet-form.component.css']
})
export class TeamSheetFormComponent implements OnInit {
  public week = new FormControl(null, [Validators.required]);
  public assetsArray = new FormArray([]);
  public displayedColumns = ['name', 'type', 'team', 'playing', 'substitute'];

  public form = new FormGroup({
    week: this.week,
    assets: this.assetsArray
  });

  @ViewChild('dataTable', { static: true })
  dataTable: MatTable<any>;

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
}
