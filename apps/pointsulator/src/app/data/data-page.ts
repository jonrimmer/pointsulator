import { FormGroup } from '@angular/forms';
import { MatTable, MatSort } from '@angular/material';
import { ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { Subscription, Observable } from 'rxjs';
import { DataPageActions, DataPageSelectors } from './adapter';

export class DataPage<T extends { id: any }> implements OnInit, OnDestroy {
  public editingRow: T;
  public editForm: FormGroup;
  public dataSource: Observable<T[]>;

  private subs = new Subscription();

  @ViewChild(MatTable, { static: true }) dataTable: MatTable<T>;
  @ViewChild(MatSort, { static: true }) matSort: MatSort;

  constructor(
    public store: Store<State>,
    private dataActions: DataPageActions<T>,
    private dataSelectors: DataPageSelectors<T>
  ) {
    this.dataSource = this.store.select(this.dataSelectors.getRows);
  }

  ngOnInit(): void {
    this.subs.add(
      this.matSort.sortChange.subscribe(sort =>
        this.store.dispatch(this.dataActions.sort(sort))
      )
    );
    this.subs.add(
      this.store.select(this.dataSelectors.getEditingRow).subscribe(row => {
        this.editingRow = row;

        if (row) {
          this.editForm.setValue(row);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  editRow(row: T) {
    this.store.dispatch(this.dataActions.edit(row));
  }

  cancel() {
    this.store.dispatch(this.dataActions.cancelEdit());
  }

  isEditingRow = (_index: number, row: T) => {
    return row === this.editingRow;
  };

  addRow() {
    this.store.dispatch(this.dataActions.startAdding());
  }

  saveRow() {
    this.store.dispatch(this.dataActions.save(this.editForm.value));
  }
}
