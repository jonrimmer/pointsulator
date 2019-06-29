import { EntityState } from '@ngrx/entity';
import {
  createAction,
  Selector,
  createSelector,
  ActionCreator,
  Action,
  createReducer,
  on
} from '@ngrx/store';
import { Sort } from '@angular/material';
import {
  EntitySelectors,
  EntityAdapter,
  Update
} from '@ngrx/entity/src/models';

export interface DataPageState<T> extends EntityState<T> {
  editing: T;
  adding: boolean;
  sort: Sort;
}

export interface DataPageActions<T> {
  addSuccess: ActionCreator<string, (added: T) => { added: T } & Action>;
  editSuccess: ActionCreator<
    string,
    (update: Update<T>) => { update: Update<T> } & Action
  >;
  edit: ActionCreator<string, (row: T) => { row: T } & Action>;
  startAdding: ActionCreator<string, () => Action>;
  save: ActionCreator<string, (row: T) => { row: T } & Action>;
  cancelEdit: ActionCreator<string, () => Action>;
  sort: ActionCreator<string, (sort: Sort) => { sort: Sort } & Action>;
}

export function createDataPageActions<T>(
  source: string,
  entityName: string
): DataPageActions<T> {
  return {
    addSuccess: createAction(`[${source}] Add success`, (added: T) => ({
      added
    })),
    editSuccess: createAction(
      `[${source}] Edit success`,
      (update: Update<T>) => ({
        update
      })
    ),
    edit: createAction(`[${source}] Edit ${entityName}`, (row: T) => ({
      row
    })),
    startAdding: createAction(`[${source}] Start adding`),
    save: createAction(`[${source}] Save ${entityName}`, (row: T) => ({
      row
    })),
    cancelEdit: createAction(`[${source}] Cancel editing`),
    sort: createAction(`[${source}] Sort table`, (sort: Sort) => ({ sort }))
  };
}

export interface DataPageSelectors<T> {
  getRows: Selector<any, T[]>;
  getEditingRow: Selector<any, T>;
  getAdding: Selector<any, boolean>;
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

export function createDataPageSelectors<T>(
  featureSelector: Selector<any, DataPageState<T>>,
  entitySelectors: EntitySelectors<T, EntityState<T>>
): DataPageSelectors<T> {
  const getEntities = createSelector(
    featureSelector,
    entitySelectors.selectAll
  );

  const getSort = createSelector(
    featureSelector,
    state => state.sort
  );

  const getSortedEntities = createSelector(
    getEntities,
    getSort,
    (rows, sort) => {
      if (!(sort && sort.active)) {
        return rows;
      }

      const data = rows.slice();
      const isAsc = sort.direction === 'asc';

      data.sort((a, b) => compare(a[sort.active], b[sort.active], isAsc));

      return data;
    }
  );

  const getAdding = createSelector(
    featureSelector,
    state => state.adding
  );

  const getEditingRow = createSelector(
    featureSelector,
    state => state.editing
  );

  const getRows = createSelector(
    getSortedEntities,
    getAdding,
    getEditingRow,
    (sorted, adding, editing) => {
      return adding ? [editing, ...sorted] : [...sorted];
    }
  );

  return {
    getRows,
    getEditingRow,
    getAdding
  };
}

export function createDataPageReducer<T>(
  initialState: DataPageState<T>,
  adapter: EntityAdapter<T>,
  actions: DataPageActions<T>,
  creator: () => T
) {
  return createReducer(
    initialState,
    on(actions.editSuccess, (state, { update }) =>
      adapter.updateOne(update, { ...state, editing: null })
    ),
    on(actions.addSuccess, (state, { added }) =>
      adapter.addOne(added, { ...state, editing: null, adding: false })
    ),
    on(actions.sort, (state, { sort }) => ({
      ...state,
      sort
    })),
    on(actions.edit, (state, { row }) => ({
      ...state,
      adding: false,
      editing: row
    })),
    on(actions.startAdding, state => ({
      ...state,
      editing: creator(),
      adding: true
    })),
    on(actions.cancelEdit, state => ({
      ...state,
      editing: null,
      adding: false
    }))
  );
}
