import { Component, OnInit, ViewChild } from '@angular/core';
import { State, selectAllAssets } from '../../reducers';
import { Store } from '@ngrx/store';
import * as AssetsPageActions from './assets-page.actions';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { AssetDTO, AssetType } from '@pointsulator/api-interface';
import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTable } from '@angular/material';
import { map } from 'rxjs/operators';

class AssetsDataSource implements DataSource<AssetDTO> {
  constructor(private source: Observable<AssetDTO[]>) {}

  addingRow = new BehaviorSubject<AssetDTO[]>([]);

  connect(collectionViewer: CollectionViewer): Observable<AssetDTO[] | readonly AssetDTO[]> {
    return combineLatest(
      this.addingRow,
      this.source
    ).pipe(map(([addingRow, source]) => [...addingRow, ...source]));
  }
  
  disconnect(collectionViewer: CollectionViewer): void {}

  public startAdding() {
    const newRow = {
      id: null,
      name: null,
      team: null,
      type: AssetType.Striker
    };

    this.addingRow.next([newRow]);

    return newRow
  }

  public stopAdding() {
    this.addingRow.next([]);
  }
}

@Component({
  selector: 'pt-assets-page',
  templateUrl: './assets-page.component.html',
  styleUrls: ['./assets-page.component.css']
})
export class AssetsPageComponent implements OnInit {
  dataSource: AssetsDataSource;

  displayedColumns = ['actions', 'id', 'team', 'type', 'name'];
  editColumns = ['editActions', 'id', 'editTeam', 'editType', 'editName']

  editingRow: AssetDTO;

  editForm = new FormGroup({
    id: new FormControl(null),
    name: new FormControl(null, Validators.required),
    team: new FormControl(null, Validators.required),
    type: new FormControl(null, Validators.required)
  });

  @ViewChild('dataTable', { static: true}) dataTable: MatTable<AssetDTO>;

  constructor(private store: Store<State>) {}

  ngOnInit() {
    this.store.dispatch(AssetsPageActions.loadAssets());
    this.dataSource = new AssetsDataSource(this.store.select(selectAllAssets));
  }

  editRow(asset: AssetDTO) {
    if (this.editingRow) {
      this.cancel();
    }

    this.editingRow = asset;
    this.editForm.setValue(asset);
    this.dataTable.renderRows();
  }

  cancel() {
    if (this.editingRow.id === null) {
      this.dataSource.stopAdding();
    }

    this.editingRow = null;
    this.dataTable.renderRows();
  }

  saveRow() {
    if (this.editingRow.id !== null) {
      this.store.dispatch(AssetsPageActions.updateAsset(this.editForm.value));
    }
    else {
      this.dataSource.stopAdding();
      this.store.dispatch(AssetsPageActions.addAsset({ asset: this.editForm.value }));
    }

    this.editingRow = null;
    this.dataTable.renderRows();
  }

  isEditingRow = (index: number, asset: AssetDTO) => {
    return asset === this.editingRow;
  }

  addAsset() {
    if (this.editingRow) {
      this.cancel();
    }

    this.editingRow = this.dataSource.startAdding();
    this.editForm.setValue(this.editingRow);
    this.dataTable.renderRows();
  }
}
