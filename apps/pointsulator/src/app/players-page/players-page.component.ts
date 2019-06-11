import { Component, OnInit } from '@angular/core';
import { State, selectAllPlayers } from '../reducers';
import { Store } from '@ngrx/store';
import { loadPlayers } from './players-page.actions';
import { Observable } from 'rxjs';
import { PlayerDTO } from '@pointsulator/api-interface';

@Component({
  selector: 'pt-players-page',
  templateUrl: './players-page.component.html',
  styleUrls: ['./players-page.component.css']
})
export class PlayersPageComponent implements OnInit {
  players$: Observable<PlayerDTO[]>;

  constructor(private store: Store<State>) {}

  ngOnInit() {
    this.store.dispatch(loadPlayers());
    this.players$ = this.store.select(selectAllPlayers);
  }
}
