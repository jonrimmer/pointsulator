import { Component, OnInit, OnDestroy } from '@angular/core';
import { State } from '../../reducers';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { TeamSheetDTO } from '@pointsulator/api-interface';
import { map } from 'rxjs/operators';
import { selectTeamSheet } from '../team-sheet.selectors';

@Component({
  selector: 'pt-team-sheet-page',
  templateUrl: './team-sheet-page.component.html',
  styleUrls: ['./team-sheet-page.component.css']
})
export class TeamSheetPageComponent implements OnInit, OnDestroy {
  private subs = new Subscription();
  public teamSheet$: Observable<TeamSheetDTO>;

  constructor(
    private readonly store: Store<State>,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.subs.add(
      this.route.paramMap
        .pipe(map(params => params.get('teamSheetId')))
        .subscribe(teamSheetId => {
          if (teamSheetId) {
            this.teamSheet$ = this.store.select(
              selectTeamSheet(Number.parseInt(teamSheetId, 10))
            );
          }
        })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
