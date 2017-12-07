import {Injectable, EventEmitter} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {ApiService} from '../services/api.service';
import {SelectionService} from './selection.service';
import {IPerson, ITopic, IYear, IItem, INetworkLink} from '../app.interfaces';
import {Observable} from 'rxjs/Observable';

import {trackPiwik} from './piwikTracking';

@Injectable()
export class DataService {
  public loadingData$: EventEmitter<string>;

  topics: Observable<ITopic[]>; private _topics: BehaviorSubject<ITopic[]>;
  persons: Observable<IPerson[]>; private _persons: BehaviorSubject<IPerson[]>;
  years: Observable<IYear[]>; private _years: BehaviorSubject<IYear[]>;
  items: Observable<IItem[]>; private _items: BehaviorSubject<IItem[]>;
  networkLinks: Observable<INetworkLink[]>; private _networkLinks: BehaviorSubject<INetworkLink[]>;
  personYears: Observable<IYear[][]>; private _personYears: BehaviorSubject<IYear[][]>;

  private page = 0;
  private route = 'index';

  private dataStore: {
    persons: IPerson[],
    defaultPersons: IPerson[],

    topics: ITopic[],
    defaultTopics: ITopic[],

    years: IYear[],
    defaultYears: IYear[],

    items: IItem[],
    defaultItems: IItem[]

    networkLinks: INetworkLink[],
    defaultNetworkLinks: INetworkLink[]

    personYears: IYear[][],
    defaultPersonYears: IYear[][]
  };

  constructor(
    private api: ApiService,
    private selection: SelectionService
  ) {
    this.dataStore = {
      persons: [], defaultPersons: [],
      topics: [], defaultTopics: [],
      years: [], defaultYears: [],
      items: [], defaultItems: [],
      networkLinks: [], defaultNetworkLinks: [],
      personYears: [], defaultPersonYears: []
    };

    this._topics = <BehaviorSubject<ITopic[]>>new BehaviorSubject([]);
    this._persons = <BehaviorSubject<IPerson[]>>new BehaviorSubject([]);
    this._years = <BehaviorSubject<IYear[]>>new BehaviorSubject([]);
    this._items = <BehaviorSubject<IItem[]>>new BehaviorSubject([]);
    this._networkLinks = <BehaviorSubject<INetworkLink[]>>new BehaviorSubject([]);
    this._personYears = <BehaviorSubject<IYear[][]>>new BehaviorSubject([]);

    this.topics = this._topics.asObservable();
    this.persons = this._persons.asObservable();
    this.years = this._years.asObservable();
    this.items = this._items.asObservable();
    this.networkLinks = this._networkLinks.asObservable();
    this.personYears = this._personYears.asObservable();

    this.loadingData$ = new EventEmitter();

    this.api.getYears()
      .subscribe(data => {
        this.dataStore.years = data;
        this.dataStore.defaultYears = data;
        this._years.next(Object.assign({}, this.dataStore).years);
      }, err => console.log('error while loading default year'));

    this.api.getPersons()
      .subscribe(data => {
        this.dataStore.persons = data;
        this.dataStore.defaultPersons = data;
        this._persons.next(Object.assign({}, this.dataStore).persons);

        this.api.getYearsForMultiplePersons(data.map(d => d.id))
          .subscribe(years => {
            this.dataStore.personYears = years;
            this.dataStore.defaultPersonYears = years;
            this._personYears.next(Object.assign({}, this.dataStore).personYears);
          }, err => console.log('error while loading default personYears'));
      }, err => console.log('error while loading default persons'));

    this.api.getTopics()
      .subscribe(data => {
        this.dataStore.topics = data;
        this.dataStore.defaultTopics = data;
        this._topics.next(Object.assign({}, this.dataStore).topics);
      }, err => console.log('error while loading default topics'));

    this.api.getResults()
      .subscribe(data => {
        this.dataStore.items = data;
        this.dataStore.defaultItems = data;
        this._items.next(Object.assign({}, this.dataStore).items);
      }, err => console.log('error while loading start results'));

    this.api.getTopTopicConnections()
      .subscribe(data => {
        this.dataStore.networkLinks = data;
        this.dataStore.defaultNetworkLinks = data;
        this._networkLinks.next(Object.assign({}, this.dataStore).networkLinks);
      }, err => console.log('error while loading default networkLinks'));
  }

  setYear(years_: IYear[]): void {
    this.dataStore.years = years_;
    this._years.next(Object.assign({}, this.dataStore).years);
  }

  setTopic(topics_: ITopic[]): void {
    this.dataStore.topics = topics_;
    this._topics.next(Object.assign({}, this.dataStore).topics);
  }

  setPerson(persons_: IPerson[]): void {
    this.dataStore.persons = persons_;
    this._persons.next(Object.assign({}, this.dataStore).persons);
    if (this.route === 'person') this.requestTimelines();
  }

  setItems(items_: IItem[]): void {
    this.dataStore.items = items_;
    this._items.next(Object.assign({}, this.dataStore).items);
  }

  setNetworkLinks(networkLinks_: INetworkLink[]): void {
    this.dataStore.networkLinks = networkLinks_;
    this._networkLinks.next(Object.assign({}, this.dataStore).networkLinks);
  }

  setPersonYears(years_: IYear[][]): void {
    this.dataStore.personYears = years_;
    this._personYears.next(Object.assign({}, this.dataStore).personYears);
  }

  setFilter(): void {
    this.page = 0;
    this.requestData();
    if (this.route === 'topic') this.requestLinks();
  }

  setRoute(route): void {
    this.route = route;
    if (route === 'topic') {
      this.requestLinks();
    } else if (route === 'person') {
      this.requestTimelines();
    }
  }

  getFilter (): any {
    const {personId, topicId, minYear, maxYear} = this.selection.getSelection();
    return {
      personId: String(personId),
      topicId: String(topicId),
      minYear,
      maxYear,
      filterPerson: personId !== null,
      filterTopic: topicId !== null,
      filterYear: minYear !== null && maxYear !== null
    };
  }

  requestData(): void {
    const {personId, topicId, minYear, maxYear, filterPerson, filterTopic, filterYear} = this.getFilter();

    this.loadingData$.emit('data');

    const setPerson = data => this.setPerson(data);
    const setTopic = data => this.setTopic(data);
    const setYear = data => this.setYear(data);
    const setItems = data => this.setItems(data);

    if (filterPerson && filterTopic && filterYear) {
      trackPiwik('filterData', 'filterDataByYearAndPersonAndTopic', ['P' + personId, 'T' + topicId, 'Y' + minYear, 'Y' + maxYear]);
      this.api.filterDataForYearPersonTopicResultPerson(minYear, maxYear, personId, topicId).subscribe(setPerson);
      this.api.filterDataForYearPersonTopicResultTopic(minYear, maxYear, personId, topicId).subscribe(setTopic);
      this.api.filterDataForYearPersonTopicResultYear(personId, topicId).subscribe(setYear);
      this.api.filterDataForYearPersonTopicResultItems(minYear, maxYear, personId, topicId).subscribe(setItems);
    } else if (filterPerson && filterTopic) {
      trackPiwik('filterData', 'filterDataByPersonAndTopic', ['P' + personId, 'T' + topicId]);
      this.api.filterDataForPersonTopicResultPerson(personId, topicId).subscribe(setPerson);
      this.api.filterDataForPersonTopicResultTopic(personId, topicId).subscribe(setTopic);
      this.api.filterDataForPersonTopicResultYear(personId, topicId).subscribe(setYear);
      this.api.filterDataForPersonTopicResultItems(personId, topicId).subscribe(setItems);
    } else if (filterPerson && filterYear) {
      trackPiwik('filterData', 'filterDataByYearAndPerson', ['P' + personId, 'Y' + minYear, 'Y' + maxYear]);
      this.api.filterDataForYearPersonResultPerson(minYear, maxYear, personId).subscribe(setPerson);
      this.api.filterDataForYearPersonResultTopic(minYear, maxYear, personId).subscribe(setTopic);
      this.api.filterDataForYearPersonResultYear(personId).subscribe(setYear);
      this.api.filterDataForYearPersonResultItems(minYear, maxYear, personId).subscribe(setItems);
    } else if (filterTopic && filterYear) {
      trackPiwik('filterData', 'filterDataByYearAndTopic', ['T' + topicId, 'Y' + minYear, 'Y' + maxYear]);
      this.api.filterDataForYearTopicResultPerson(minYear, maxYear, topicId).subscribe(setPerson);
      this.api.filterDataForYearTopicResultTopic(minYear, maxYear, topicId).subscribe(setTopic);
      this.api.filterDataForYearTopicResultYear(topicId).subscribe(setYear);
      this.api.filterDataForYearTopicResultItems(minYear, maxYear, topicId).subscribe(setItems);
    } else if (filterPerson) {
      trackPiwik('filterData', 'filterDataByYear', 'P' + personId);
      this.api.filterDataByPersonResultPerson(personId).subscribe(setPerson);
      this.api.filterDataByPersonResultTopic(personId).subscribe(setTopic);
      this.api.filterDataByPersonResultYear(personId).subscribe(setYear);
      this.api.filterDataByPersonResultItems(personId).subscribe(setItems);
    } else if (filterTopic) {
      trackPiwik('filterData', 'filterDataByYear', 'T' + topicId);
      this.api.filterDataByTopicResultPerson(topicId).subscribe(setPerson);
      this.api.filterDataByTopicResultTopic(topicId).subscribe(setTopic);
      this.api.filterDataByTopicResultYear(topicId).subscribe(setYear);
      this.api.filterDataByTopicResultItems(topicId).subscribe(setItems);
    } else if (filterYear) {
      trackPiwik('filterData', 'filterDataByYear', ['Y' + minYear, 'Y' + maxYear]);
      this.api.filterDataByYearResultPerson(minYear, maxYear).subscribe(setPerson);
      this.api.filterDataByYearResultTopic(minYear, maxYear).subscribe(setTopic);
      this.api.filterDataByYearResultItems(minYear, maxYear).subscribe(setItems);
      this.setYear(this.dataStore.defaultYears);
    } else {
      trackPiwik('filterData', 'Start Filter');
      const {defaultItems, defaultTopics, defaultYears, defaultPersons, defaultNetworkLinks, defaultPersonYears} = this.dataStore;
      this.setPerson(defaultPersons);
      this.setTopic(defaultTopics);
      this.setYear(defaultYears);
      this.setItems(defaultItems);
      this.setPersonYears(defaultPersonYears);
    }
  }

  requestTimelines() {
    const {personId, topicId, minYear, maxYear, filterPerson, filterTopic, filterYear} = this.getFilter();
    const setLinks = data => this.setPersonYears(data);
    const persons = this.dataStore.persons;

    this.loadingData$.emit('timelines');

    if (filterTopic) {
      this.api.getYearsForMultiplePersonsFilterTopics(persons.map(d => d.id), topicId).subscribe(setLinks);
    } else if (filterYear || filterPerson) {
      this.api.getYearsForMultiplePersons(persons.map(d => d.id)).subscribe(setLinks);
    } else {
      this.setPersonYears(this.dataStore.defaultPersonYears);
    }
  }

  requestLinks() {
    const {personId, topicId, minYear, maxYear, filterPerson, filterTopic, filterYear} = this.getFilter();
    const setLinks = data => this.setNetworkLinks(data);

    this.loadingData$.emit('links');

    if (filterPerson && filterTopic && filterYear) {
      this.api.getTopicNetworkFilterYearPersonTopic(minYear, maxYear, personId, topicId).subscribe(setLinks);
    } else if (filterPerson && filterTopic) {
      this.api.getTopicNetworkFilterPersonTopic(personId, topicId).subscribe(setLinks);
    } else if (filterPerson && filterYear) {
      this.api.getTopicNetworkFilterYearPerson(minYear, maxYear, personId).subscribe(setLinks);
    } else if (filterTopic && filterYear) {
      this.api.getTopicNetworkFilterYearTopic(minYear, maxYear, topicId).subscribe(setLinks);
    } else if (filterPerson) {
      this.api.getTopicNetworkFilterPerson(personId).subscribe(setLinks);
    } else if (filterTopic) {
      this.api.getTopicNetworkFilterTopic(topicId).subscribe(setLinks);
    } else if (filterYear) {
      this.api.getTopicNetworkFilterYear(minYear, maxYear).subscribe(setLinks);
    } else {
      this.setNetworkLinks(this.dataStore.defaultNetworkLinks);
    }
  }

  requestResultsForNextPage () {
    const {personId, topicId, minYear, maxYear, filterPerson, filterTopic, filterYear} = this.getFilter();
    const {items} = this.dataStore;
    this.page += 1;

    if (filterPerson && filterTopic && filterYear) {
      this.api.filterDataForYearPersonTopicResultItems(minYear, maxYear, personId, topicId, this.page)
        .subscribe(data => this.setItems([...items, ...data]));
    } else if (filterPerson && filterTopic) {
      this.api.filterDataForPersonTopicResultItems(personId, topicId, this.page)
        .subscribe(data => this.setItems([...items, ...data]));
    } else if (filterPerson && filterYear) {
      this.api.filterDataForYearPersonResultItems(minYear, maxYear, personId, this.page)
        .subscribe(data => this.setItems([...items, ...data]));
    } else if (filterTopic && filterYear) {
      this.api.filterDataForYearTopicResultItems(minYear, maxYear, topicId, this.page)
        .subscribe(data => this.setItems([...items, ...data]));
    } else if (filterPerson) {
      this.api.filterDataByPersonResultItems(personId, this.page)
        .subscribe(data => this.setItems([...items, ...data]));
    } else if (filterTopic) {
      this.api.filterDataByTopicResultItems(topicId, this.page)
        .subscribe(data => this.setItems([...items, ...data]));
    } else if (filterYear) {
      this.api.filterDataByYearResultItems(minYear, maxYear, this.page)
        .subscribe(data => this.setItems([...items, ...data]));
    } else {
      this.api.getResultsForPage(this.page)
        .subscribe(data => this.setItems([...items, ...data]));
    }
  }
}
