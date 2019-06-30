import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, filter } from 'rxjs/operators';
import { AssetDTO } from '@pointsulator/api-interface';
import { selectAssetForManager, State } from '../../reducers';
import { Store } from '@ngrx/store';
import { FormGroup, FormControl } from '@angular/forms';

interface Week {
  num: number;
  date: number;
}

@Component({
  selector: 'pt-create-team-sheet-page',
  templateUrl: './create-team-sheet-page.component.html',
  styleUrls: ['./create-team-sheet-page.component.css']
})
export class CreateTeamSheetPageComponent implements OnInit {
  subs = new Subscription();
  weeks: Week[] = [];
  form = new FormGroup({
    week: new FormControl()
  });

  public assets$: Observable<AssetDTO[]>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly store: Store<State>
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
    this.subs.add(
      this.route.paramMap
        .pipe(
          map(params => params.get('managerId')),
          filter(managerId => !!managerId)
        )
        .subscribe(managerId => {
          this.assets$ = this.store.select(
            selectAssetForManager(Number.parseInt(managerId, 10))
          );
        })
    );
  }
}
