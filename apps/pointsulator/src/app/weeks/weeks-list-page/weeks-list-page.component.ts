import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { WeekDTO } from '@pointsulator/api-interface';
import { WeeksApiService } from '../weeks-api.service';

@Component({
  selector: 'pt-weeks-list',
  templateUrl: './weeks-list-page.component.html',
  styleUrls: ['./weeks-list-page.component.scss']
})
export class WeeksListPageComponent implements OnInit {
  public weeks$: Observable<WeekDTO[]>;

  public displayedColumns = ['id', 'startDate', 'status'];

  constructor(private readonly weeksApi: WeeksApiService) {}

  ngOnInit(): void {
    this.weeks$ = this.weeksApi.getWeeks();
  }
}
