import { Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { WeekDTO } from '@pointsulator/api-interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { WeeksState } from '../weeks.reducer';
import { selectAllWeeks } from '../../reducers';

class WeeksDataSource implements DataSource<WeekDTO> {
  constructor(private source: Observable<WeekDTO[]>) {}

  connect() {
    return this.source;
  }

  disconnect() {}
}

@Component({
  selector: 'pt-weeks-list',
  templateUrl: './weeks-list-page.component.html',
  styleUrls: ['./weeks-list-page.component.scss']
})
export class WeeksListPageComponent implements OnInit {
  dataSource: WeeksDataSource;

  constructor(private readonly store: Store<WeeksState>) {}

  ngOnInit(): void {
    this.dataSource = new WeeksDataSource(this.store.select(selectAllWeeks));
  }
}
