import { Component, OnInit, ViewChild } from '@angular/core';
import { ManagerDTO } from '@pointsulator/api-interface';
import { State, managerPageSelectors } from '../../reducers';
import { Store } from '@ngrx/store';
import { MatSort } from '@angular/material';
import { DataPage } from '../../data/data-page';
import { managerPageActions } from './managers-page.actions';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'pt-managers-page',
  templateUrl: './managers-page.component.html',
  styleUrls: ['./managers-page.component.css']
})
export class ManagersPageComponent extends DataPage<ManagerDTO>
  implements OnInit {
  displayedColumns = ['actions', 'id', 'name', 'teamName'];
  editColumns = ['editActions', 'id', 'editName', 'editTeamName'];

  @ViewChild(MatSort, { static: true }) matSort: MatSort;

  constructor(store: Store<State>) {
    super(store, managerPageActions, managerPageSelectors);

    this.editForm = new FormGroup({
      id: new FormControl(null),
      name: new FormControl(null),
      teamName: new FormControl(null),
      squad: new FormControl(null)
    });
  }
}
