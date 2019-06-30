import { Component, OnInit } from '@angular/core';
import { State, assetsPageSelectors, selectManagerRefs } from '../../reducers';
import { Store } from '@ngrx/store';
import { assetPageActions } from './assets-page.actions';
import { AssetDTO, ManagerRef } from '@pointsulator/api-interface';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataPage } from '../../data/data-page';
import { Observable } from 'rxjs';

@Component({
  selector: 'pt-assets-page',
  templateUrl: './assets-page.component.html',
  styleUrls: ['./assets-page.component.css']
})
export class AssetsPageComponent extends DataPage<AssetDTO> implements OnInit {
  displayedColumns = ['actions', 'id', 'team', 'type', 'name', 'owner'];
  editColumns = [
    'editActions',
    'id',
    'editTeam',
    'editType',
    'editName',
    'editOwner'
  ];
  managers$: Observable<ManagerRef[]>;

  constructor(store: Store<State>) {
    super(store, assetPageActions, assetsPageSelectors);

    this.managers$ = this.store.select(selectManagerRefs);

    this.editForm = new FormGroup({
      id: new FormControl(null),
      name: new FormControl(null, Validators.required),
      team: new FormControl(null, Validators.required),
      type: new FormControl(null, Validators.required),
      owner: new FormControl(null)
    });
  }
}
