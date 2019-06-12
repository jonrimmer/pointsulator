import { createAction, props } from '@ngrx/store';
import { AssetDTO } from '@pointsulator/api-interface';

export const loadAssets = createAction(
  '[Assets API] Load assets',
  props<{ assets: AssetDTO[] }>()
);
