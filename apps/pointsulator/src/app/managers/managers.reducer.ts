import { createEntityAdapter } from '@ngrx/entity';
import { ManagerDTO } from '@pointsulator/api-interface';
import { createReducer, on, Action } from '@ngrx/store';
import * as ManagersActions from './managers.actions';
import { DataPageState, createDataPageReducer } from '../data/adapter';
import { managerPageActions } from './managers-page/managers-page.actions';

export interface ManagersState extends DataPageState<ManagerDTO> {}

export const adapter = createEntityAdapter<ManagerDTO>();

export const initialState: DataPageState<ManagerDTO> = {
  ...adapter.getInitialState(),
  adding: false,
  editing: null,
  sort: null
};

const managersReducer = createReducer(
  initialState,
  on(ManagersActions.loadManagersSucess, (state, { managers }) =>
    adapter.addAll(managers, state)
  )
);

const managersPageReducer = createDataPageReducer<ManagerDTO>(
  initialState,
  adapter,
  managerPageActions,
  () => ({
    id: null,
    name: null,
    teamName: null,
    squad: null
  })
);

export function reducer(state: ManagersState | undefined, action: Action) {
  return managersPageReducer(managersReducer(state, action), action);
}

export const entitySelectors = adapter.getSelectors();
