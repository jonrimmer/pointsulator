import { createAction } from '@ngrx/store';
import { AssetDTO } from '@pointsulator/api-interface';
import { createDataPageActions } from '../../data/adapter';

export const updateAsset = createAction(
  '[Assets Page] Update asset',
  (asset: AssetDTO) => ({ asset })
);

export const addAsset = createAction(
  '[Assets Page] Add asset',
  (asset: AssetDTO) => ({ asset })
);

export const assetPageActions = createDataPageActions<AssetDTO>(
  'Assets Page',
  'asset'
);
