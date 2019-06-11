import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { AppEffects } from './app.effects';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, NoopAnimationsModule, StoreModule.forRoot(reducers, { metaReducers }), EffectsModule.forRoot([AppEffects])],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
