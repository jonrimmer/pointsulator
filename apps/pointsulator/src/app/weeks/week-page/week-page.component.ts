import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { WeeksApiService } from '../weeks-api.service';
import { WeekDetailsDTO } from '@pointsulator/api-interface';
import { WeekFormComponent } from '../week-form/week-form.component';

@Component({
  selector: 'pt-week-page',
  templateUrl: './week-page.component.html',
  styleUrls: ['./week-page.component.scss']
})
export class WeekPageComponent implements OnInit, OnDestroy {
  public week$: Observable<WeekDetailsDTO>;
  private subs = new Subscription();

  @ViewChild(WeekFormComponent, { static: true })
  public weekForm: WeekFormComponent;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly weeksApi: WeeksApiService,
    private readonly router: Router
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

  save() {
    if (this.weekForm.form.valid) {
      this.weeksApi.saveWeek(this.weekForm.form.value).subscribe(() => {
        this.router.navigate(['..'], { relativeTo: this.route });
      });
    }
  }

  delete() {}
}
