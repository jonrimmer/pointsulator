import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromAssets from '../assets/assets.reducer';
import * as fromWeeks from '../weeks/weeks.reducer';
import * as fromManagers from '../managers/managers.reducer';
import { createDataPageSelectors } from '../data/adapter';

export interface State {
  assets: fromAssets.AssetsState;
  weeks: fromWeeks.WeeksState;
  managers: fromManagers.ManagersState;
}

export const reducers: ActionReducerMap<State> = {
  assets: fromAssets.reducer,
  weeks: fromWeeks.reducer,
  managers: fromManagers.reducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production
  ? []
  : [];

export const selectAssetsState = createFeatureSelector<fromAssets.AssetsState>(
  'assets'
);

export const selectAllAssets = createSelector(
  selectAssetsState,
  fromAssets.entitySelectors.selectAll
);

export const assetsPageSelectors = createDataPageSelectors(
  selectAssetsState,
  fromAssets.entitySelectors
);

export const selectWeeksState = createFeatureSelector<fromWeeks.WeeksState>(
  'weeks'
);

export const selectAllWeeks = createSelector(
  selectWeeksState,
  fromWeeks.selectAllWeeks
);

export const selectManagersState = createFeatureSelector<
  fromManagers.ManagersState
>('managers');

export const selectAllManagers = createSelector(
  selectManagersState,
  fromManagers.entitySelectors.selectAll
);

export const managerPageSelectors = createDataPageSelectors(
  selectManagersState,
  fromManagers.entitySelectors
);
