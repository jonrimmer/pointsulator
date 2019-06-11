import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromPlayers from '../players/players.reducer';

export interface State {
  players: fromPlayers.State;
}

export const reducers: ActionReducerMap<State> = {
  players: fromPlayers.reducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production
  ? []
  : [];

export const selectPlayersState = createFeatureSelector<fromPlayers.State>(
  'players'
);

export const selectAllPlayers = createSelector(
  selectPlayersState,
  fromPlayers.selectAllPlayers
);
