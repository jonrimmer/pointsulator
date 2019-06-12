import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromAssets from '../assets/assets.reducer';

export interface State {
  assets: fromAssets.State;
}

export const reducers: ActionReducerMap<State> = {
  assets: fromAssets.reducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production
  ? []
  : [];

export const selectAssetsState = createFeatureSelector<fromAssets.State>(
  'assets'
);

export const selectAllAssets = createSelector(
  selectAssetsState,
  fromAssets.selectAllAssets
);
