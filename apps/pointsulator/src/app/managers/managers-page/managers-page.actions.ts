import { createAction } from '@ngrx/store';
import { ManagerDTO } from '@pointsulator/api-interface';
import { createDataPageActions } from '../../data/adapter';

export const addManager = createAction(
  '[Managers Page] Add manager',
  (manager: ManagerDTO) => ({ manager })
);

export const updateManager = createAction(
  '[Managers Page] Update manager',
  (manager: ManagerDTO) => ({ manager })
);

export const managerPageActions = createDataPageActions<ManagerDTO>(
  'Managers Page',
  'manager'
);
