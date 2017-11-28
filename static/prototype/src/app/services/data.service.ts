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

  topics: Observable<ITopic[]>;
  persons: Observable<IPerson[]>;
  years: Observable<IYear[]>;
  items: Observable<IItem[]>;
  networkLinks: Observable<INetworkLink[]>;
  personYears: Observable<IYear[][]>;
  totalResults: Observable<number>;

  private _topics: BehaviorSubject<ITopic[]>;
  private _persons: BehaviorSubject<IPerson[]>;
  private _years: BehaviorSubject<IYear[]>;
  private _items: BehaviorSubject<IItem[]>;
  private _networkLinks: BehaviorSubject<INetworkLink[]>;
  private _personYears: BehaviorSubject<IYear[][]>;
  private _totalResults: BehaviorSubject<number>;

  private load: any = {};

  private year: Array<IYear>;

  private dataStore: {
    persons: IPerson[],
    defaultPersons: IPerson[],
    personsAvailable: boolean,
    personsRequired: boolean,

    topics: ITopic[],
    defaultTopics: ITopic[],
    topicsAvailable: boolean,
    topicsRequired: boolean,

    years: IYear[],
    defaultYears: IYear[],
    yearsAvailable: boolean,
    yearsRequired: boolean,

    items: IItem[],
    defaultItems: IItem[]
    itemsAvailable: boolean,
    itemsRequired: boolean,

    networkLinks: INetworkLink[],
    defaultNetworkLinks: INetworkLink[],
    networkLinksAvailable: boolean,
    networkLinksRequired: boolean

    personYears: IYear[][],
    defaultPersonYears: IYear[][],
    personYearsAvailable: boolean,
    personYearsRequired: boolean,

    totalResults: number
  };

  constructor(
    private api: ApiService,
    private selection: SelectionService
  ) {
    this.dataStore = {
      persons: [], defaultPersons: [], personsAvailable: false, personsRequired: false,
      topics: [], defaultTopics: [], topicsAvailable: false, topicsRequired: false,
      years: [], defaultYears: [], yearsAvailable: false, yearsRequired: false,
      items: [], defaultItems: [], itemsAvailable: false, itemsRequired: false,
      networkLinks: [], defaultNetworkLinks: [], networkLinksAvailable: false, networkLinksRequired: false,
      personYears: [], defaultPersonYears: [], personYearsAvailable: false, personYearsRequired: false,
      totalResults: 0
    };

    this._topics = <BehaviorSubject<ITopic[]>>new BehaviorSubject([]);
    this._persons = <BehaviorSubject<IPerson[]>>new BehaviorSubject([]);
    this._years = <BehaviorSubject<IYear[]>>new BehaviorSubject([]);
    this._items = <BehaviorSubject<IItem[]>>new BehaviorSubject([]);
    this._networkLinks = <BehaviorSubject<INetworkLink[]>>new BehaviorSubject([]);
    this._personYears = <BehaviorSubject<IYear[][]>>new BehaviorSubject([]);
    this._totalResults = <BehaviorSubject<number>>new BehaviorSubject(0);

    this.topics = this._topics.asObservable();
    this.persons = this._persons.asObservable();
    this.years = this._years.asObservable();
    this.items = this._items.asObservable();
    this.networkLinks = this._networkLinks.asObservable();
    this.personYears = this._personYears.asObservable();
    this.totalResults = this._totalResults.asObservable();

    this.api.getYears()
      .subscribe(data => {
        this.dataStore.years = data;
        this.dataStore.defaultYears = data;
        this._years.next(Object.assign({}, this.dataStore).years);
        this.dataStore.totalResults = data.length > 0 ? data.map(d => d.count).reduce((a, c) => a + c) : 0;
        this._totalResults.next(Object.assign({}, this.dataStore).totalResults);
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
    this.dataStore.totalResults = years_.length > 0 ? years_.map(d => d.count).reduce((a, c) => a + c) : 0;
    this._years.next(Object.assign({}, this.dataStore).years);
    this._totalResults.next(Object.assign({}, this.dataStore).totalResults);
  }

  setTopic(topics_: ITopic[]): void {
    this.dataStore.topics = topics_;
    this._topics.next(Object.assign({}, this.dataStore).topics);
  }

  setPerson(persons_: IPerson[]): void {
    console.log('updateperson');
    this.dataStore.persons = persons_;
    this._persons.next(Object.assign({}, this.dataStore).persons);
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
    this.dataStore.personsAvailable =
    this.dataStore.topicsAvailable =
    this.dataStore.yearsAvailable =
    this.dataStore.itemsAvailable =
    this.dataStore.networkLinksAvailable =
    this.dataStore.personYearsAvailable = false;

    this.filterData();
  }

  setRoute(route): void {
    let piwikDescription;
    switch (route) {
      case 'index':
        this.dataStore.personsRequired = true;
        this.dataStore.topicsRequired = true;
        this.dataStore.yearsRequired = true;
        this.dataStore.itemsRequired = true;
        this.dataStore.networkLinksRequired = false;
        this.dataStore.personYearsRequired = false;
        piwikDescription = 'StartView';
        break;
      case 'topic':
        this.dataStore.personsRequired = true;
        this.dataStore.topicsRequired = true;
        this.dataStore.yearsRequired = true;
        this.dataStore.itemsRequired = true;
        this.dataStore.networkLinksRequired = true;
        this.dataStore.personYearsRequired = false;
        piwikDescription = 'TopicDetailView';
        break;
      case 'person':
        this.dataStore.personsRequired = true;
        this.dataStore.topicsRequired = true;
        this.dataStore.yearsRequired = true;
        this.dataStore.itemsRequired = true;
        this.dataStore.networkLinksRequired = false;
        this.dataStore.personYearsRequired = true;
        piwikDescription = 'PersonDetailView';
        break;
      case 'results':
        this.dataStore.personsRequired = true;
        this.dataStore.topicsRequired = true;
        this.dataStore.yearsRequired = true;
        this.dataStore.itemsRequired = true;
        this.dataStore.networkLinksRequired = false;
        this.dataStore.personYearsRequired = false;
        break;
    }
    trackPiwik('setRoute', piwikDescription);
    this.filterData();
  }

  filterData(): void {
    const filter = this.selection.getSelection();

    let person_id = filter['person_id'];
    let topic_id = filter['topic_id'];
    const min_year = filter['min_year'];
    const max_year = filter['max_year'];

    const hasPerson = person_id !== null;
    const hasTopic = topic_id !== null;
    const hasYear = min_year !== null && max_year !== null;

    // Fuuuu JS.
    // console.log(String(null) !== null, null !== null);
    person_id = String(person_id);
    topic_id = String(topic_id);

    const {
      personsAvailable, personsRequired,
      topicsAvailable, topicsRequired,
      yearsAvailable, yearsRequired,
      itemsAvailable, itemsRequired,
      networkLinksAvailable, networkLinksRequired,
      personYearsAvailable, personYearsRequired
    } = this.dataStore;

    this.load = {
      person: !personsAvailable && personsRequired,
      topic: !topicsAvailable && topicsRequired,
      year: !yearsAvailable && yearsRequired,
      items: !itemsAvailable && itemsRequired,
      network: !networkLinksAvailable && networkLinksRequired,
      personYears: !personYearsAvailable && personYearsRequired
    };

    if (!hasPerson && !hasTopic && hasYear) {
      this.filterDataByYear(min_year, max_year);
      trackPiwik('filterData', 'filterDataByYear', ['Y' + min_year, 'Y' + max_year]);
    } else if (hasPerson && !hasTopic && !hasYear) {
      this.filterDataByPerson(person_id);
      trackPiwik('filterData', 'filterDataByYear', 'P' + person_id);
    } else if (!hasPerson && hasTopic && !hasYear) {
      this.filterDataByTopic(topic_id);
      trackPiwik('filterData', 'filterDataByYear', 'T' + topic_id);
    } else if (hasPerson && !hasTopic && hasYear) {
      this.filterDataByYearAndPerson(min_year, max_year, person_id);
      trackPiwik('filterData', 'filterDataByYearAndPerson', ['P' + person_id, 'Y' + min_year, 'Y' + max_year]);
    } else if (!hasPerson && hasTopic && hasYear) {
      this.filterDataByYearAndTopic(min_year, max_year, topic_id);
      trackPiwik('filterData', 'filterDataByYearAndTopic', ['T' + topic_id, 'Y' + min_year, 'Y' + max_year]);
    } else if (hasPerson && hasTopic && !hasYear) {
      this.filterDataByPersonAndTopic(person_id, topic_id);
      trackPiwik('filterData', 'filterDataByPersonAndTopic', ['P' + person_id, 'T' + topic_id]);
    } else if (hasPerson && hasTopic && hasYear) {
      this.filterDataByYearAndPersonAndTopic(min_year, max_year, person_id, topic_id);
      trackPiwik('filterData', 'filterDataByYearAndPersonAndTopic', ['P' + person_id, 'T' + topic_id, 'Y' + min_year, 'Y' + max_year]);
    } else {
      trackPiwik('filterData', 'Start Filter');
      const { defaultItems, defaultTopics, defaultYears, defaultPersons, defaultNetworkLinks, defaultPersonYears } = this.dataStore;

      if (this.load.person) this.setPerson(defaultPersons);
      if (this.load.topic) this.setTopic(defaultTopics);
      if (this.load.year) this.setYear(defaultYears);
      if (this.load.items) this.setItems(defaultItems);
      if (this.load.network) this.setNetworkLinks(defaultNetworkLinks);
      if (this.load.personYears) this.setPersonYears(defaultPersonYears);
    }

    if (personsRequired) this.dataStore.personsAvailable = true;
    if (topicsRequired) this.dataStore.topicsAvailable = true;
    if (yearsRequired) this.dataStore.yearsAvailable = true;
    if (itemsRequired) this.dataStore.itemsAvailable = true;
    if (networkLinksRequired) this.dataStore.networkLinksAvailable = true;
    if (personYearsRequired) this.dataStore.personYearsAvailable = true;
  }

  filterDataByPerson(personID: string): void {
    const { topic, year, items, network } = this.load;
    if (topic) this.api.filterDataByPersonResultTopic(personID).subscribe(data => this.setTopic(data));
    if (year) this.api.filterDataByPersonResultYear(personID).subscribe(data => this.setYear(data));
    if (items) this.api.filterDataByPersonResultItems(personID).subscribe(data => this.setItems(data));
    if (network) this.api.getTopicNetworkFilterPerson(personID).subscribe(data => this.setNetworkLinks(data));
  }

  filterDataByTopic(topicID: string): void {
    if (this.load.person) {
      this.api.filterDataByTopicResultPerson(topicID).subscribe(data => {
        if (this.load.personYears) this.api.getYearsForMultiplePersonsFilterTopics(data.map(d => d.id), topicID).subscribe(years => this.setPersonYears(years));
        return this.setPerson(data);
      });
    }
    if (this.load.topic) {
      this.api.filterDataByTopicResultTopic(topicID).subscribe(data => {
        data.push({id: +topicID, keyword: '', count: 1});
        this.setTopic(data);
      });
    }
    if (this.load.year) this.api.filterDataByTopicResultYear(topicID).subscribe(data => this.setYear(data));
    if (this.load.items) this.api.filterDataByTopicResultItems(topicID).subscribe(data => this.setItems(data));
    if (this.load.network) this.api.getTopicNetworkFilterTopic(topicID).subscribe(data => this.setNetworkLinks(data));
  }

  filterDataByYear(minYear: number, maxYear: number): void {
    if (this.load.person) {
      this.api.filterDataByYearResultPerson(minYear, maxYear).subscribe(data => {
        if (this.load.personYears) this.api.getYearsForMultiplePersons(data.map(d => d.id)).subscribe(years => this.setPersonYears(years));
        return this.setPerson(data);
      });
    }
    if (this.load.topic) this.api.filterDataByYearResultTopic(minYear, maxYear).subscribe(data => this.setTopic(data));
    if (this.load.items) this.api.filterDataByYearResultItems(minYear, maxYear).subscribe(data => this.setItems(data));
    if (this.load.network) this.api.getTopicNetworkFilterYear(minYear, maxYear).subscribe(data => this.setNetworkLinks(data));
  }

  filterDataByYearAndPerson(minYear: number, maxYear: number, personID: string): void {
    if (this.load.year) this.api.filterDataForYearPersonResultYear(minYear, maxYear, personID).subscribe(data => this.setYear(data));
    if (this.load.topic) this.api.filterDataForYearPersonResultTopic(minYear, maxYear, personID).subscribe(data => this.setTopic(data));
    if (this.load.items) this.api.filterDataForYearPersonResultItems(minYear, maxYear, personID).subscribe(data => this.setItems(data));
    if (this.load.network) this.api.getTopicNetworkFilterYearPerson(minYear, maxYear, personID).subscribe(data => this.setNetworkLinks(data));
  }

  filterDataByPersonAndTopic(personID: string, topicID: string): void {
    if (this.load.year) this.api.filterDataForPersonTopicResultYear(personID, topicID).subscribe(data => this.setYear(data));
    if (this.load.topic) this.api.filterDataForPersonTopicResultTopic(personID, topicID).subscribe(data => this.setTopic(data));
    if (this.load.items) this.api.filterDataForPersonTopicResultItems(personID, topicID).subscribe(data => this.setItems(data));
    if (this.load.network) this.api.getTopicNetworkFilterPersonTopic(personID, topicID).subscribe(data => this.setNetworkLinks(data));
  }

  filterDataByYearAndTopic(minYear: number, maxYear: number, topicID: string): void {
    if (this.load.year) this.api.filterDataForYearTopicResultYear(minYear, maxYear, topicID).subscribe(data => this.setYear(data));
    if (this.load.person) this.api.filterDataForYearTopicResultPerson(minYear, maxYear, topicID).subscribe(data => this.setPerson(data));
    if (this.load.items) this.api.filterDataForYearTopicResultItems(minYear, maxYear, topicID).subscribe(data => this.setItems(data));
    if (this.load.topic) this.api.filterDataForYearTopicResultTopic(minYear, maxYear, topicID).subscribe(data => this.setTopic(data));
    if (this.load.network) this.api.getTopicNetworkFilterYearTopic(minYear, maxYear, topicID).subscribe(data => this.setNetworkLinks(data));
  }

  filterDataByYearAndPersonAndTopic(minYear: number, maxYear: number, personID: string, topicID: string): void {
    if (this.load.year) this.api.filterDataForYearPersonTopicResultYear(minYear, maxYear, personID, topicID).subscribe(data => this.setYear(data));
    if (this.load.items) this.api.filterDataForYearPersonTopicResultItems(minYear, maxYear, personID, topicID).subscribe(data => this.setItems(data));
    if (this.load.topic) this.api.filterDataForYearPersonTopicResultTopic(minYear, maxYear, personID, topicID).subscribe(data => this.setTopic(data));
    if (this.load.network) this.api.getTopicNetworkFilterYearPersonTopic(minYear, maxYear, personID, topicID).subscribe(data => this.setNetworkLinks(data));
  }

}
