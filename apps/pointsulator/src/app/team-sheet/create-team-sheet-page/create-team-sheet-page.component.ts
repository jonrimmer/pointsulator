import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap, map } from 'rxjs/operators';
import { TeamSheetApiService } from '../team-sheet-api.service';
import { AssetsService } from '../../assets/assets.service';
import {
  AssetDTO,
  TeamSheetConfigDTO,
  AssetType,
  WeekDTO
} from '@pointsulator/api-interface';
import {
  TeamSheetFormComponent,
  TeamSheetFormItem
} from '../team-sheet-form/team-sheet-form.component';
import { FocusMonitor } from '@angular/cdk/a11y';
import { WeeksApiService } from '../../weeks/weeks-api.service';

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
  assets$: Observable<AssetDTO[]>;
  weeks$: Observable<WeekDTO[]>;
  managerId: number;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly assetsApi: AssetsService,
    private readonly teamSheetApi: TeamSheetApiService,
    private readonly weeksApi: WeeksApiService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.assets$ = this.route.paramMap.pipe(
      map(params => Number.parseInt(params.get('managerId'), 10)),
      tap(mangagerId => {
        this.managerId = mangagerId;
      }),
      switchMap(managerId => this.assetsApi.getForOwner(managerId))
    );
    this.weeks$ = this.weeksApi.getWeeks();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  save(form: TeamSheetFormComponent) {
    if (form.form.valid) {
      const precedences = {
        [AssetType.Goalkeeper]: 1,
        [AssetType.Defence]: 1,
        [AssetType.Midfielder]: 1,
        [AssetType.Forward]: 1
      };

      const config: TeamSheetConfigDTO = {
        managerId: this.managerId,
        items: form.assetsArray.value
          .filter((item: TeamSheetFormItem) => item.playing)
          .map((item: TeamSheetFormItem) => {
            const result = {
              assetId: item.asset.id,
              substitute: item.substitute,
              precedence: item.substitute ? precedences[item.asset.type] : null
            };

            if (item.substitute) {
              precedences[item.asset.type] += 1;
            }

            return result;
          }),
        validFrom: form.validFrom.value
      };

      this.teamSheetApi.create(config).subscribe(() => {
        this.router.navigate(['..'], { relativeTo: this.route });
      });
    } else {
      form.form.markAllAsTouched();
    }
  }
}
