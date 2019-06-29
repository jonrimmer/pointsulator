import { createAction, props } from '@ngrx/store';
import { AssetDTO } from '@pointsulator/api-interface';
import { Update } from '@ngrx/entity';

export const loadAssets = createAction('[Assets] Load assets');

export const loadAssetsSuccess = createAction(
  '[Assets API] Load assets',
  props<{ assets: AssetDTO[] }>()
);
