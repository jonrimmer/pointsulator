import { Component, OnInit } from '@angular/core';
import { State, assetsPageSelectors } from '../../reducers';
import { Store } from '@ngrx/store';
import { assetPageActions } from './assets-page.actions';
import { AssetDTO } from '@pointsulator/api-interface';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataPage } from '../../data/data-page';

@Component({
  selector: 'pt-assets-page',
  templateUrl: './assets-page.component.html',
  styleUrls: ['./assets-page.component.css']
})
export class AssetsPageComponent extends DataPage<AssetDTO> implements OnInit {
  displayedColumns = ['actions', 'id', 'team', 'type', 'name'];
  editColumns = ['editActions', 'id', 'editTeam', 'editType', 'editName'];

  constructor(store: Store<State>) {
    super(store, assetPageActions, assetsPageSelectors);

    this.editForm = new FormGroup({
      id: new FormControl(null),
      name: new FormControl(null, Validators.required),
      team: new FormControl(null, Validators.required),
      type: new FormControl(null, Validators.required),
      owner: new FormControl(null)
    });
  }
}
