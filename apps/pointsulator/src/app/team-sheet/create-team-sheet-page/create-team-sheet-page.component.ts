import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap, map } from 'rxjs/operators';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import * as TeamSheetActions from '../team-sheet.actions';
import { TeamSheetApiService } from '../team-sheet-api.service';
import { AssetsService } from '../../assets/assets.service';
import { AssetDTO } from '@pointsulator/api-interface';
import {
  TeamSheetFormComponent,
  TeamSheetFormItem
} from '../team-sheet-form/team-sheet-form.component';

interface Week {
  num: number;
  date: number;
}

@Component({
  selector: 'pt-create-team-sheet-page',
  templateUrl: './create-team-sheet-page.component.html',
  styleUrls: ['./create-team-sheet-page.component.css']
})
export class CreateTeamSheetPageComponent implements OnInit, OnDestroy {
  subs = new Subscription();
  weeks: Week[] = [];
  assets$: Observable<AssetDTO[]>;
  managerId: number;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly assetsApi: AssetsService,
    private readonly teamSheetApi: TeamSheetApiService,
    private readonly router: Router
  ) {
    let seasonStart = Date.now();

    for (let i = 0; i < 10; i++) {
      this.weeks.push({
        num: i + 1,
        date: seasonStart
      });

      seasonStart += 1000 * 60 * 60 * 24 * 7;
    }
  }

  ngOnInit() {
    this.assets$ = this.route.paramMap.pipe(
      map(params => Number.parseInt(params.get('managerId'), 10)),
      tap(mangagerId => {
        this.managerId = mangagerId;
      }),
      switchMap(managerId => this.assetsApi.getForOwner(managerId))
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  save(form: TeamSheetFormComponent) {
    const config = {
      managerId: this.managerId,
      items: form.assetsArray.value
        .filter((item: TeamSheetFormItem) => item.playing)
        .map((item: TeamSheetFormItem) => ({
          assetId: item.asset.id,
          substitute: item.substitute
        })),
      validFrom: form.week.value
    };

    this.teamSheetApi.create(config).subscribe(() => {
      this.router.navigate(['..']);
    });
  }
}
