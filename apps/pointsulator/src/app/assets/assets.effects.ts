import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { exhaustMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { AssetsService } from './assets.service';
import * as AssetsActions from './assets.actions';
import { EMPTY } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { assetPageActions } from './assets-page/assets-page.actions';
import { State, assetsPageSelectors } from '../reducers';

@Injectable({
  providedIn: 'root'
})
export class AssetsEffects implements OnInitEffects {
  loadPlayers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AssetsActions.loadAssets),
      exhaustMap(() =>
        this.assetsService.getAll().pipe(
          map(assets => AssetsActions.loadAssetsSuccess({ assets })),
          catchError(() => EMPTY)
        )
      )
    )
  );

  saveAsset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(assetPageActions.save),
      withLatestFrom(this.store.select(assetsPageSelectors.getAdding)),
      exhaustMap(([{ row: asset }, adding]) =>
        adding
          ? this.assetsService
              .addAsset(asset)
              .pipe(map(added => assetPageActions.addSuccess(added)))
          : this.assetsService.updateAsset(asset).pipe(
              map(() =>
                assetPageActions.editSuccess({ id: asset.id, changes: asset })
              ),
              catchError(() => EMPTY)
            )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private readonly assetsService: AssetsService
  ) {}

  ngrxOnInitEffects(): Action {
    return AssetsActions.loadAssets();
  }
}
