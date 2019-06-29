import { createAction, props } from '@ngrx/store';
import { ManagerDTO } from '@pointsulator/api-interface';

export const loadManagers = createAction('[Managers] Load managers');

export const loadManagersSucess = createAction(
  '[Managers] Load success',
  (managers: ManagerDTO[]) => ({ managers })
);
