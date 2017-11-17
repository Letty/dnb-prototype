import {Injectable, EventEmitter} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {ApiService} from '../services/api.service';
import {SelectionService} from './selection.service';
import {IPerson, ITopic, IYear, IItem, INetworkLink} from '../app.interfaces';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class DataService {
  public loadingData$: EventEmitter<string>;

  topics: Observable<ITopic[]>;
  persons: Observable<IPerson[]>;
  years: Observable<IYear[]>;
  items: Observable<IItem[]>;
  networkLinks: Observable<INetworkLink[]>;

  private _topics: BehaviorSubject<ITopic[]>;
  private _persons: BehaviorSubject<IPerson[]>;
  private _years: BehaviorSubject<IYear[]>;
  private _items: BehaviorSubject<IItem[]>;
  private _networkLinks: BehaviorSubject<INetworkLink[]>;

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
      networkLinks: [], defaultNetworkLinks: [], networkLinksAvailable: false, networkLinksRequired: false
    };

    this._topics = <BehaviorSubject<ITopic[]>>new BehaviorSubject([]);
    this._persons = <BehaviorSubject<IPerson[]>>new BehaviorSubject([]);
    this._years = <BehaviorSubject<IYear[]>>new BehaviorSubject([]);
    this._items = <BehaviorSubject<IItem[]>>new BehaviorSubject([]);
    this._networkLinks = <BehaviorSubject<INetworkLink[]>>new BehaviorSubject([]);

    this.topics = this._topics.asObservable();
    this.persons = this._persons.asObservable();
    this.years = this._years.asObservable();
    this.items = this._items.asObservable();
    this.networkLinks = this._networkLinks.asObservable();

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
      }, err => console.log('error while loading default topics'));
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
  }

  setItems(items_: IItem[]): void {
    this.dataStore.items = items_;
    this._items.next(Object.assign({}, this.dataStore).items);
  }

  setNetworkLinks(networkLinks_: INetworkLink[]): void {
    console.log(networkLinks_);
    this.dataStore.networkLinks = networkLinks_;
    this._networkLinks.next(Object.assign({}, this.dataStore).networkLinks);
  }

  setFilter(): void {
    this.dataStore.personsAvailable =
    this.dataStore.topicsAvailable =
    this.dataStore.yearsAvailable =
    this.dataStore.itemsAvailable =
    this.dataStore.networkLinksAvailable = false;

    this.filterData();
  }

  setRoute(route): void {
    switch (route) {
      case 'index':
        this.dataStore.personsRequired = true;
        this.dataStore.topicsRequired = true;
        this.dataStore.yearsRequired = true;
        this.dataStore.itemsRequired = true;
        this.dataStore.networkLinksRequired = false;
        break;
      case 'topic':
        this.dataStore.personsRequired = false;
        this.dataStore.topicsRequired = true;
        this.dataStore.yearsRequired = true;
        this.dataStore.itemsRequired = true;
        this.dataStore.networkLinksRequired = true;
        break;
      case 'person':
        this.dataStore.personsRequired = true;
        this.dataStore.topicsRequired = false;
        this.dataStore.yearsRequired = true;
        this.dataStore.itemsRequired = true;
        this.dataStore.networkLinksRequired = false;
        break;
    }
    this.filterData();
  }

  filterData(): void {
    const filter = this.selection.getSelection();

    const hasPerson = filter['person_id'] !== null;
    const hasTopic = filter['topic_id'] !== null;
    const hasYear = filter['min_year'] !== null && filter['max_year'] !== null;

    this.load = {
      person: !this.dataStore.personsAvailable && this.dataStore.personsRequired,
      topic: !this.dataStore.topicsAvailable && this.dataStore.topicsRequired,
      year: !this.dataStore.yearsAvailable && this.dataStore.yearsRequired,
      items: !this.dataStore.itemsAvailable && this.dataStore.itemsRequired,
      network: !this.dataStore.networkLinksAvailable && this.dataStore.networkLinksRequired
    };

    if (!hasPerson && !hasTopic && hasYear) {
      this.filterDataByYear(filter['min_year'], filter['max_year']);
    } else if (hasPerson && !hasTopic && !hasYear) {
      this.filterDataByPerson(String(filter['person_id']));
    } else if (!hasPerson && hasTopic && !hasYear) {
      this.filterDataByTopic(String(filter['topic_id']));
    } else if (hasPerson && !hasTopic && hasYear) {
      this.filterDataByYearAndPerson(filter['min_year'], filter['max_year'], String(filter['person_id']));
    } else if (!hasPerson && hasTopic && hasYear) {
      this.filterDataByYearAndTopic(filter['min_year'], filter['max_year'], filter['topic_id']);
    } else if (hasPerson && hasTopic && !hasYear) {
      this.filterDataByPersonAndTopic(filter['person_id'], filter['topic_id']);
    } else if (hasPerson && hasTopic && hasYear) {
      this.filterDataByYearAndPersonAndTopic(filter['min_year'], filter['max_year'], filter['person_id'], filter['topic_id']);
    } else {
      // default values
      this.setItems(this.dataStore.defaultItems);
      this.setTopic(this.dataStore.defaultTopics);
      this.setYear(this.dataStore.defaultYears);
      this.setPerson(this.dataStore.defaultPersons);
      this.setNetworkLinks(this.dataStore.defaultNetworkLinks);
    }

    if (this.dataStore.personsRequired) this.dataStore.personsAvailable = true;
    if (this.dataStore.topicsRequired) this.dataStore.topicsAvailable = true;
    if (this.dataStore.yearsRequired) this.dataStore.yearsAvailable = true;
    if (this.dataStore.itemsRequired) this.dataStore.itemsAvailable = true;
    if (this.dataStore.networkLinksRequired) this.dataStore.networkLinksAvailable = true;
  }

  filterDataByPerson(personID: string): void {
    if (this.load.topic) this.api.filterDataByPersonResultTopic(personID).subscribe(data => this.setTopic(data));
    if (this.load.year) this.api.filterDataByPersonResultYear(personID).subscribe(data => this.setYear(data));
    if (this.load.items) this.api.filterDataByPersonResultItems(personID).subscribe(data => this.setItems(data));
    if (this.load.network) this.api.getTopicNetworkFilterPerson(personID).subscribe(data => this.setNetworkLinks(data));
  }

  filterDataByTopic(topicID: string): void {
    if (this.load.person) this.api.filterDataByTopicResultPerson(topicID).subscribe(data => this.setPerson(data));
    if (this.load.year) this.api.filterDataByTopicResultYear(topicID).subscribe(data => this.setYear(data));
    if (this.load.items) this.api.filterDataByTopicResultItems(topicID).subscribe(data => this.setItems(data));
  }

  filterDataByYear(minYear: number, maxYear: number): void {
    if (this.load.person) this.api.filterDataByYearResultPerson(minYear, maxYear).subscribe(data => this.setPerson(data));
    if (this.load.topic) this.api.filterDataByYearResultTopic(minYear, maxYear).subscribe(data => this.setTopic(data));
    if (this.load.items) this.api.filterDataByYearResultItems(minYear, maxYear).subscribe(data => this.setItems(data));
    if (this.load.network) this.api.getTopicNetworkFilterYear(minYear, maxYear).subscribe(data => this.setNetworkLinks(data));
  }

  filterDataByYearAndPerson(minYear: number, maxYear: number, personID: string): void {
    if (this.load.year) this.api.filterDataForYearPersonResultYear(minYear, maxYear, personID).subscribe(data => this.setYear(data));
    if (this.load.topic) this.api.filterDataForYearPersonResultTopic(minYear, maxYear, personID).subscribe(data => this.setTopic(data));
    if (this.load.items) this.api.filterDataForYearPersonResultItems(minYear, maxYear, personID).subscribe(data => this.setItems(data));
  }

  filterDataByPersonAndTopic(personID: string, topicID: string): void {
    if (this.load.year) this.api.filterDataForPersonTopicResultYear(personID, topicID).subscribe(data => this.setYear(data));
    if (this.load.items) this.api.filterDataForPersonTopicResultItems(personID, topicID).subscribe(data => this.setItems(data));
  }

  filterDataByYearAndTopic(minYear: number, maxYear: number, topicID: string): void {
    if (this.load.year) this.api.filterDataForYearTopicResultYear(minYear, maxYear, topicID).subscribe(data => this.setYear(data));
    if (this.load.items) this.api.filterDataForYearTopicResultItems(minYear, maxYear, topicID).subscribe(data => this.setItems(data));
  }

  filterDataByYearAndPersonAndTopic(minYear: number, maxYear: number, personID: string, topicID: string): void {
    if (this.load.year) this.api.filterDataForYearPersonTopicResultYear(minYear, maxYear, personID, topicID).subscribe(data => this.setYear(data));
    if (this.load.items) this.api.filterDataForYearPersonTopicResultItems(minYear, maxYear, personID, topicID).subscribe(data => this.setItems(data));
  }

}
