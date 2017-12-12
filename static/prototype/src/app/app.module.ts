import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpModule} from '@angular/http';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {DnbHeaderComponent} from './components/dnb-header/dnb-header.component';
import {ResultsComponent} from './components/results/results.component';
import {ResultComponent} from './components/result/result.component';
import {PersonsComponent} from './components/persons/persons.component';
import {YearsComponent} from './components/years/years.component';
import {TopicsComponent} from './components/topics/topics.component';
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
    ResultsComponent,
    PersonsComponent,
    YearsComponent,
    DnbHeaderComponent,
    TopicsComponent,
    ResultComponent,
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
