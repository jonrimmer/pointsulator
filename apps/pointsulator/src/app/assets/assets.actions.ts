import { createAction, props } from '@ngrx/store';
import { AssetDTO } from '@pointsulator/api-interface';
import { Update } from '@ngrx/entity';

export const loadAssets = createAction(
  '[Assets API] Load assets',
  props<{ assets: AssetDTO[] }>()
);

export const saveAsset = createAction(
  '[Assets API] Save asset',
  props<{ asset: Update<AssetDTO> }>()
);

export const addAsset = createAction(
  '[Assets API] Add asset',
  props<{ asset: AssetDTO }>()
);
