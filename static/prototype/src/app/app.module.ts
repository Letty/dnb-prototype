import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpModule} from '@angular/http';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {DnbHeaderComponent} from './components/dnb-header/dnb-header.component';
import {ResultsListComponent} from './components/results-list/results-list.component';
import {ResultsDetailComponent} from './components/results-detail/results-detail.component';
import {PersonComponent} from './components/person/person.component';
import {YearsComponent} from './components/years/years.component';
import {TopicDetailComponent} from './components/topic-detail/topic-detail.component';
import {SearchComponent} from './components/search/search.component';
import {AccordionSectionComponent} from './components/accordion-section/accordion-section.component';
import {CollapsedTagsComponent} from './components/collapsed-tags/collapsed-tags.component';
import {InformationModalComponent} from './components/information-modal/information-modal.component';

import {ApiService} from './services/api.service';
import {SelectionService} from './services/selection.service';
import {DataService} from './services/data.service';
import {RouterService} from './services/router.service';

import { MasonryModule } from 'angular2-masonry';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    ResultsListComponent,
    PersonComponent,
    YearsComponent,
    DnbHeaderComponent,
    TopicDetailComponent,
    ResultsDetailComponent,
    SearchComponent,
    AccordionSectionComponent,
    CollapsedTagsComponent,
    InformationModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    MasonryModule,
    FormsModule
  ],
  providers: [
    ApiService,
    DataService,
    SelectionService,
    RouterService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
