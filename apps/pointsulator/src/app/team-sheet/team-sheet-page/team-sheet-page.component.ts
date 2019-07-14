import { Component, OnInit, OnDestroy } from '@angular/core';
import { State } from '../../reducers';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { TeamSheetDTO, AssetDTO, WeekDTO } from '@pointsulator/api-interface';
import { map, tap, switchMap } from 'rxjs/operators';
import { selectTeamSheet } from '../team-sheet.selectors';
import { AssetsService } from '../../assets/assets.service';
import { TeamSheetApiService } from '../team-sheet-api.service';
import { WeeksApiService } from '../../weeks/weeks-api.service';

@Component({
  selector: 'pt-team-sheet-page',
  templateUrl: './team-sheet-page.component.html',
  styleUrls: ['./team-sheet-page.component.css']
})
export class TeamSheetPageComponent implements OnInit, OnDestroy {
  private subs = new Subscription();
  public teamSheet$: Observable<TeamSheetDTO>;
  public assets$: Observable<AssetDTO[]>;
  public weeks$: Observable<WeekDTO[]>;
  public managerId: number;

  constructor(
    private readonly store: Store<State>,
    private readonly route: ActivatedRoute,
    private assetsApi: AssetsService,
    private teamSheetApi: TeamSheetApiService,
    private weeksApi: WeeksApiService
  ) {}

  ngOnInit() {
    this.assets$ = this.route.paramMap.pipe(
      map(params => Number.parseInt(params.get('managerId'), 10)),
      tap(mangagerId => {
        this.managerId = mangagerId;
      }),
      switchMap(managerId => this.assetsApi.getForOwner(managerId))
    );

    this.teamSheet$ = this.route.paramMap.pipe(
      map(params => Number.parseInt(params.get('teamSheetId'), 10)),
      switchMap(id => this.teamSheetApi.getById(id))
    );

    this.weeks$ = this.weeksApi.getWeeks();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  save() {}

  delete() {}
}
