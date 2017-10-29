import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {DnbHeaderComponent} from './components/dnb-header/dnb-header.component';
import {ResultsHeaderComponent} from './components/results-header/results-header.component';
import {PersonComponent} from './components/person.component';
import {TopicComponent} from './components/topic.component';
import {ChartTimelineComponent} from './components/chart-timeline/chart-timeline.component';

import {ApiService} from './services/api.service';
import {SelectionService} from './services/selection.service';
import {DataService} from './services/data.service';


@NgModule({
  declarations: [
    AppComponent,
    ResultsHeaderComponent,
    PersonComponent,
    TopicComponent,
    ChartTimelineComponent,
    DnbHeaderComponent
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
