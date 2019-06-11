import { createAction, props } from '@ngrx/store';
import { PlayerDTO } from '@pointsulator/api-interface';

export const loadPlayers = createAction(
  '[Players API] Load Players',
  props<{ players: PlayerDTO[] }>()
);
