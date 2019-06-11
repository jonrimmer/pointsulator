import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { LayoutModule } from '@angular/cdk/layout';
import {
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule
} from '@angular/material';
import { PlayersPageComponent } from './players-page/players-page.component';
import { PlayersEffects } from './players/players.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';

export const ROOTS = [
  {
    path: 'players',
    component: PlayersPageComponent
  }
];

@NgModule({
  declarations: [AppComponent, PlayersPageComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    NoopAnimationsModule,
    RouterModule.forRoot(ROOTS),
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([PlayersEffects]),
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
