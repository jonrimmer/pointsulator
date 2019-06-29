import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import * as ManagersActions from './managers.actions';
import {
  switchMap,
  map,
  withLatestFrom,
  exhaustMap,
  catchError
} from 'rxjs/operators';
import { ManagersApiService } from './managers-api.service';
import { managerPageActions } from './managers-page/managers-page.actions';
import { EMPTY } from 'rxjs';
import { managerPageSelectors, State } from '../reducers';
import { Store, Action } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class ManagersEffects implements OnInitEffects {
  public loadManagers$ = createEffect(() =>
    this.actions.pipe(
      ofType(ManagersActions.loadManagers),
      switchMap(() =>
        this.managersApi.loadAll().pipe(
          map(ManagersActions.loadManagersSucess),
          catchError(() => EMPTY)
        )
      )
    )
  );

  saveManager$ = createEffect(() =>
    this.actions.pipe(
      ofType(managerPageActions.save),
      withLatestFrom(this.store.select(managerPageSelectors.getAdding)),
      exhaustMap(([{ row: manager }, adding]) =>
        adding
          ? this.managersApi
              .addManager(manager)
              .pipe(map(added => managerPageActions.addSuccess(added)))
          : this.managersApi.updateManager(manager).pipe(
              map(() =>
                managerPageActions.editSuccess({
                  id: manager.id,
                  changes: manager
                })
              ),
              catchError(() => EMPTY)
            )
      )
    )
  );

  constructor(
    private actions: Actions,
    private store: Store<State>,
    private readonly managersApi: ManagersApiService
  ) {}

  ngrxOnInitEffects(): Action {
    return ManagersActions.loadManagers();
  }
}
