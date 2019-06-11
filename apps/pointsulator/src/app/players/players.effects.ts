import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as PlayersPageActions from '../players-page/players-page.actions';
import { exhaustMap, map, catchError } from 'rxjs/operators';
import { PlayersService } from './players.service';
import * as PlayersActions from './players.actions';
import { EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayersEffects {
  loadPlayers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayersPageActions.loadPlayers),
      exhaustMap(() =>
        this.playersService.getAll().pipe(
          map(players => PlayersActions.loadPlayers({ players })),
          catchError(() => EMPTY)
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private readonly playersService: PlayersService
  ) {}
}
