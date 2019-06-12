import { Component, OnInit } from '@angular/core';
import { State, selectAllAssets } from '../../reducers';
import { Store } from '@ngrx/store';
import { loadAssets } from './assets-page.actions';
import { Observable } from 'rxjs';
import { AssetDTO } from '@pointsulator/api-interface';

@Component({
  selector: 'pt-assets-page',
  templateUrl: './assets-page.component.html',
  styleUrls: ['./assets-page.component.css']
})
export class AssetsPageComponent implements OnInit {
  assets$: Observable<AssetDTO[]>;

  constructor(private store: Store<State>) {}

  ngOnInit() {
    this.store.dispatch(loadAssets());
    this.assets$ = this.store.select(selectAllAssets);
  }
}
