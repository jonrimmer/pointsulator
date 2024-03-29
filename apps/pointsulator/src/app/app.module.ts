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
  MatFormFieldModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatNativeDateModule
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
import { TeamSheetEffects } from './team-sheet/team-sheet.effects';
import { TeamSheetPageComponent } from './team-sheet/team-sheet-page/team-sheet-page.component';
import { TeamSheetListPageComponent } from './team-sheet/team-sheet-list-page/team-sheet-list-page.component';
import { CreateTeamSheetPageComponent } from './team-sheet/create-team-sheet-page/create-team-sheet-page.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { TeamSheetFormComponent } from './team-sheet/team-sheet-form/team-sheet-form.component';
import { CreateWeekPageComponent } from './weeks/create-week-page/create-week-page.component';
import { WeekFormComponent } from './weeks/week-form/week-form.component';
import { TeamPointsComponent } from './weeks/team-points/team-points.component';
import { ItemPointsComponent } from './weeks/item-points/item-points.component';
import { SquadsPageComponent } from './squads/squads-page/squads-page.component';
import { AssetNamePipe } from './asset-name.pipe';
import { AssetTypePipe } from './pipes/asset-type.pipe';

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
    path: 'managers/:managerId/team-sheets',
    component: TeamSheetListPageComponent
  },
  {
    path: 'managers/:managerId/team-sheets/add',
    component: CreateTeamSheetPageComponent
  },
  {
    path: 'managers/:managerId/team-sheets/:teamSheetId',
    component: TeamSheetPageComponent
  },
  {
    path: 'weeks',
    component: WeeksListPageComponent
  },
  {
    path: 'weeks/add',
    component: CreateWeekPageComponent
  },
  {
    path: 'weeks/:weekId',
    component: WeekPageComponent
  },
  {
    path: 'squads',
    component: SquadsPageComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'assets'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    AssetsPageComponent,
    WeeksListPageComponent,
    WeekPageComponent,
    ManagersPageComponent,
    TeamSheetPageComponent,
    TeamSheetListPageComponent,
    CreateTeamSheetPageComponent,
    PageHeaderComponent,
    TeamSheetFormComponent,
    CreateWeekPageComponent,
    WeekFormComponent,
    TeamPointsComponent,
    ItemPointsComponent,
    SquadsPageComponent,
    AssetNamePipe,
    AssetTypePipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NoopAnimationsModule,
    RouterModule.forRoot(ROUTES),
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([AssetsEffects, ManagersEffects, TeamSheetEffects]),
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
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
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
