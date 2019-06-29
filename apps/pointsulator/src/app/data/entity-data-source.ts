import { DataSource } from '@angular/cdk/table';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { MatSort } from '@angular/material';
import { CollectionViewer } from '@angular/cdk/collections';
import { startWith, map } from 'rxjs/operators';

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

export class EntityDataSource<T> implements DataSource<T> {
  constructor(private source: Observable<T[]>, private sort: MatSort, private creator: () => T) {}

  addingRow = new BehaviorSubject<T[]>([]);

  connect(collectionViewer: CollectionViewer): Observable<T[] | readonly T[]> {
    return combineLatest(
      this.addingRow,
      combineLatest(this.source, this.sort.sortChange.asObservable().pipe(startWith(null))).pipe(map(([source, sort]) => {
        if (!(sort &&sort.active)) {
          return source;
        }

        const data = source.slice();
        const isAsc = sort.direction === 'asc';

        data.sort((a, b) => compare(a[sort.active], b[sort.active], isAsc));

        return data;
      }))
    ).pipe(map(([addingRow, source]) => [...addingRow, ...source]));
  }
  
  disconnect(collectionViewer: CollectionViewer): void {}

  public startAdding() {
    const newRow = this.creator();

    this.addingRow.next([newRow]);

    return newRow
  }

  public stopAdding() {
    this.addingRow.next([]);
  }
}