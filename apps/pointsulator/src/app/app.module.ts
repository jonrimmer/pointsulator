import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

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
  MatListModule,
  MatTableModule,
  MatSortModule,
  MatInputModule,
  MatFormFieldModule
} from '@angular/material';
import { AssetsPageComponent } from './assets/assets-page/assets-page.component';
import { AssetsEffects } from './assets/assets.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { WeeksListPageComponent } from './weeks/weeks-list-page/weeks-list-page.component';
import { WeekPageComponent } from './weeks/week-page/week-page.component';
import { ManagersPageComponent } from './managers/managers-page/managers-page.component';
import { ManagersEffects } from './managers/managers.effects';

export const ROUTES: Route[] = [
  {
    path: 'assets',
    component: AssetsPageComponent
  },
  {
    path: 'managers',
    component: ManagersPageComponent
  },
  {
    path: 'weeks',
    component: WeeksListPageComponent
  },
  {
    path: 'weeks/:id',
    component: WeekPageComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'weeks'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    AssetsPageComponent,
    WeeksListPageComponent,
    WeekPageComponent,
    ManagersPageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NoopAnimationsModule,
    RouterModule.forRoot(ROUTES),
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([AssetsEffects, ManagersEffects]),
    LayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatSortModule,
    FormsModule,
    ReactiveFormsModule,
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
