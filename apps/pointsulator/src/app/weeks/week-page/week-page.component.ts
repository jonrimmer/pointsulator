import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { WeeksApiService } from '../weeks-api.service';
import { WeekDetailsDTO } from '@pointsulator/api-interface';

@Component({
  selector: 'pt-week-page',
  templateUrl: './week-page.component.html',
  styleUrls: ['./week-page.component.scss']
})
export class WeekPageComponent implements OnInit, OnDestroy {
  public week$: Observable<WeekDetailsDTO>;
  private subs = new Subscription();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly weeksApi: WeeksApiService
  ) {}

  ngOnInit(): void {
    this.week$ = this.route.params.pipe(
      map(params => params.weekId),
      switchMap(weekId => this.weeksApi.getWeekById(weekId))
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
