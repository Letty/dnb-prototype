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

  private year: Array<IYear>;

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
  };

  constructor(private api: ApiService, private selection: SelectionService) {
    this.dataStore = {
      persons: [], defaultPersons: [],
      topics: [], defaultTopics: [],
      years: [], defaultYears: [],
      items: [], defaultItems: [],
      networkLinks: [], defaultNetworkLinks: []
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

  setFilter(): void {
    const filter = this.selection.getSelection();

    const hasPerson = filter['person_id'] !== null;
    const hasTopic = filter['topic_id'] !== null;
    const hasYear = filter['min_year'] !== null && filter['max_year'] !== null;

    if (!hasPerson && !hasTopic && hasYear) {
      // z: true  -  a: false  -  t: false
      this.filterDataByYear(filter['min_year'], filter['max_year']);

    } else if (hasPerson && !hasTopic && !hasYear) {
      // z: false  -  a: true  -  t: false
      this.filterDataByPerson(String(filter['person_id']));

    } else if (!hasPerson && hasTopic && !hasYear) {
      // z: false  -  a: false  -  t: true
      this.filterDataByTopic(String(filter['topic_id']));

    } else if (hasPerson && !hasTopic && hasYear) {
      // z: true  -  a: true  -  t: false
      this.filterDataByYearAndPerson(filter['min_year'], filter['max_year'], String(filter['person_id']));

    } else if (!hasPerson && hasTopic && hasYear) {
      // z: true  -  a: false  -  t: true
      this.filterDataByYearAndTopic(filter['min_year'], filter['max_year'], filter['topic_id']);

    } else if (hasPerson && hasTopic && !hasYear) {
      // z: false  -  a: true  -  t: true
      this.filterDataByPersonAndTopic(filter['person_id'], filter['topic_id']);

    } else if (hasPerson && hasTopic && hasYear) {
      // z: true  -  a: true  -  t: true
      this.filterDataByYearAndPersonAndTopic(filter['min_year'], filter['max_year'],
        filter['person_id'], filter['topic_id']);

    } else {
      // z: false  -  a: false  -  t: false
      // defaultwerte
      this.setItems(this.dataStore.defaultItems);
      this.setTopic(this.dataStore.defaultTopics);
      this.setYear(this.dataStore.defaultYears);
      this.setPerson(this.dataStore.defaultPersons);
    }
  }

  filterDataByPerson(personID: string): void {
    this.api.filterDataByPersonResultTopic(personID)
      .subscribe(data => this.setTopic(data));

    this.api.filterDataByPersonResultYear(personID)
      .subscribe(data => this.setYear(data));

    this.api.filterDataByPersonResultItems(personID)
      .subscribe(data => this.setItems(data));

    this.api.getTopicNetworkFilterPerson(personID)
      .subscribe(data => console.log(data))
  }

  filterDataByTopic(topicID: string): void {
    this.api.filterDataByTopicResultPerson(topicID)
      .subscribe(data => this.setPerson(data));

    this.api.filterDataByTopicResultYear(topicID)
      .subscribe(data => this.setYear(data));

    this.api.filterDataByTopicResultItems(topicID)
      .subscribe(data => this.setItems(data));
  }

  filterDataByYear(minYear: number, maxYear: number): void {
    this.api.filterDataByYearResultPerson(minYear, maxYear)
      .subscribe(data => this.setPerson(data));

    this.api.filterDataByYearResultTopic(minYear, maxYear)
      .subscribe(data => this.setTopic(data));

    this.api.filterDataByYearResultItems(minYear, maxYear)
      .subscribe(data => this.setItems(data));

    this.api.getTopicNetworkFilterYear(minYear, maxYear)
      .subscribe(data => console.log(data))
  }

  filterDataByYearAndPerson(minYear: number, maxYear: number, personID: string): void {

    this.api.filterDataForYearPersonResultYear(minYear, maxYear, personID)
      .subscribe(data => this.setYear(data));

    this.api.filterDataForYearPersonResultTopic(minYear, maxYear, personID)
      .subscribe(data => this.setTopic(data));

    this.api.filterDataForYearPersonResultItems(minYear, maxYear, personID)
      .subscribe(data => this.setItems(data));
  }

  filterDataByPersonAndTopic(personID: string, topicID: string): void {
    this.api.filterDataForPersonTopicResultYear(personID, topicID)
      .subscribe(data => this.setYear(data));

    this.api.filterDataForPersonTopicResultItems(personID, topicID)
      .subscribe(data => this.setItems(data));
  }

  filterDataByYearAndTopic(minYear: number, maxYear: number, topicID: string): void {
    this.api.filterDataForYearTopicResultYear(minYear, maxYear, topicID)
      .subscribe(data => this.setYear(data));

    this.api.filterDataForYearTopicResultItems(minYear, maxYear, topicID)
      .subscribe(data => this.setItems(data));
  }

  filterDataByYearAndPersonAndTopic(minYear: number, maxYear: number, personID: string, topicID: string): void {
    this.api.filterDataForYearPersonTopicResultYear(minYear, maxYear, personID, topicID)
      .subscribe(data => this.setYear(data));

    this.api.filterDataForYearPersonTopicResultItems(minYear, maxYear, personID, topicID)
      .subscribe(data => this.setItems(data));
  }

}
