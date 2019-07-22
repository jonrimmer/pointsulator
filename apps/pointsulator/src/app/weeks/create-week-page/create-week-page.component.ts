import { Component, OnInit } from '@angular/core';
import { onlyFridays } from '../../utils/dates';
import { FormGroup, FormControl } from '@angular/forms';
import { DateTime } from 'luxon';
import { WeeksApiService } from '../weeks-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'pt-create-week-page',
  templateUrl: './create-week-page.component.html',
  styleUrls: ['./create-week-page.component.css']
})
export class CreateWeekPageComponent implements OnInit {
  constructor(
    private readonly weeksApi: WeeksApiService,
    private readonly router: Router
  ) {
    this.form = new FormGroup({
      commencing: new FormControl(
        DateTime.local()
          .set({ weekday: 5 })
          .toJSDate()
      )
    });
  }
  form: FormGroup;

  onlyFridays = onlyFridays;

  ngOnInit() {}

  save() {
    if (this.form.valid) {
      this.weeksApi.createWeek(this.form.value.commencing).subscribe(result => {
        this.router.navigate(['/weeks', result.id]);
      });
    }
  }
}
