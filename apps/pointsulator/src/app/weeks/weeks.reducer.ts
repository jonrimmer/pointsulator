import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { WeekDTO } from '@pointsulator/api-interface';
import { Action, createReducer } from '@ngrx/store';

export interface WeeksState extends EntityState<WeekDTO> {}

export const adapter = createEntityAdapter<WeekDTO>();

const initialState = adapter.getInitialState();

const weeksReducer = createReducer(initialState);

export function reducer(state: WeeksState | undefined, action: Action) {
  return weeksReducer(state, action);
}

const { selectAll } = adapter.getSelectors();

export const selectAllWeeks = selectAll;
