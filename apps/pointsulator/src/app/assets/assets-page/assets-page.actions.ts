import { createAction, props } from '@ngrx/store';
import { AssetDTO } from '@pointsulator/api-interface';

export const loadAssets = createAction('[Assets Page] Load assets');

export const updateAsset = createAction(
  '[Assets Page] Update asset',
  (asset: AssetDTO) => ({ asset })
);

export const addAsset = createAction(
  '[Assets Page] Add asset',
  props<{ asset: AssetDTO }>()
);
