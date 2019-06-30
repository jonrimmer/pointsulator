import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State, selectTeamSheets } from '../../reducers';
import { ActivatedRoute } from '@angular/router';
import { map, filter } from 'rxjs/operators';
import * as TeamSheetActions from '../team-sheet.actions';
import { TeamSheetDTO } from '@pointsulator/api-interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'pt-team-sheet-list-page',
  templateUrl: './team-sheet-list-page.component.html',
  styleUrls: ['./team-sheet-list-page.component.css']
})
export class TeamSheetListPageComponent implements OnInit {
  teamSheets$: Observable<TeamSheetDTO[]>;

  displayedColumns = ['id', 'validFrom'];

  constructor(
    private readonly store: Store<State>,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.teamSheets$ = this.store.select(selectTeamSheets);
    this.route.paramMap
      .pipe(
        map(params => params.get('managerId')),
        filter(managerId => !!managerId)
      )
      .subscribe(managerId => {
        this.store.dispatch(
          TeamSheetActions.loadTeamSheets(Number.parseInt(managerId, 10))
        );
      });
  }
}
