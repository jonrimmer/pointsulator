import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { AssetDTO } from '@pointsulator/api-interface';
import { createReducer, on, Action } from '@ngrx/store';
import * as AssetsActions from './assets.actions';
import { DataPageState, createDataPageReducer } from '../data/adapter';
import { assetPageActions } from './assets-page/assets-page.actions';
import { AssetType } from '@pointsulator/api-interface';

export interface AssetsState extends DataPageState<AssetDTO> {}

export const adapter: EntityAdapter<AssetDTO> = createEntityAdapter<AssetDTO>();

export const initialState: DataPageState<AssetDTO> = {
  ...adapter.getInitialState(),
  editing: null,
  adding: false,
  sort: null
};

const assetsReducer = createReducer(
  initialState,
  on(AssetsActions.loadAssetsSuccess, (state, { assets }) =>
    adapter.addAll(assets, state)
  )
);

const assetsPageReducer = createDataPageReducer<AssetDTO>(
  initialState,
  adapter,
  assetPageActions,
  () => ({
    id: null,
    name: null,
    team: null,
    owner: null,
    type: AssetType.Striker
  })
);

export function reducer(state: AssetsState | undefined, action: Action) {
  return assetsPageReducer(assetsReducer(state, action), action);
}

export const entitySelectors = adapter.getSelectors();
