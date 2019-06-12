import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { AssetDTO } from '@pointsulator/api-interface';
import { createReducer, on, Action } from '@ngrx/store';
import * as AssetsActions from './assets.actions';

export interface State extends EntityState<AssetDTO> {}

export const adapter: EntityAdapter<AssetDTO> = createEntityAdapter<AssetDTO>();

export const initialState = adapter.getInitialState();

const assetsReducer = createReducer(
  initialState,
  on(AssetsActions.loadAssets, (state, { assets }) =>
    adapter.addAll(assets, state)
  )
);

export function reducer(state: State | undefined, action: Action) {
  return assetsReducer(state, action);
}

const { selectAll } = adapter.getSelectors();

export const selectAllAssets = selectAll;
