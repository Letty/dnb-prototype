import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {TimelineComponent} from './components/timeline.component';
import {PersonComponent} from './components/person.component';
import {TopicComponent} from './components/topic.component';
import {ApiService} from './services/api.service';
import {SelectionService} from './services/selection.service';
import {DataService} from "./services/data.service";


@NgModule({
  declarations: [
    AppComponent,
    TimelineComponent,
    PersonComponent,
    TopicComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [
    ApiService,
    DataService,
    SelectionService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
