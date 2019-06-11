import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { PlayerDTO } from '@pointsulator/api-interface';
import { createReducer, on, Action, select } from '@ngrx/store';
import * as PlayersActions from './players.actions';

export interface State extends EntityState<PlayerDTO> {}

export const adapter: EntityAdapter<PlayerDTO> = createEntityAdapter<
  PlayerDTO
>();

export const initialState = adapter.getInitialState();

const playersReducer = createReducer(
  initialState,
  on(PlayersActions.loadPlayers, (state, { players }) =>
    adapter.addAll(players, state)
  )
);

export function reducer(state: State | undefined, action: Action) {
  return playersReducer(state, action);
}

const { selectAll } = adapter.getSelectors();

export const selectAllPlayers = selectAll;
