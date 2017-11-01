import {Injectable, EventEmitter} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {ApiService} from '../services/api.service';
import {SelectionService} from './selection.service';
import {IPerson, ITopic, IYear} from '../app.interfaces';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class DataService {
  public loadingData$: EventEmitter<string>;

  private defaultYear: Array<IYear>;
  private defaultPerson: Array<IPerson>;
  private defaultTopic: Array<ITopic>;

  topics: Observable<ITopic[]>;
  persons: Observable<IPerson[]>;
  years: Observable<IYear[]>;

  private _topics: BehaviorSubject<ITopic[]>;
  private _persons: BehaviorSubject<IPerson[]>;
  private _years: BehaviorSubject<IYear[]>;

  private year: Array<IYear>;

  private dataStore: {
    persons: IPerson[],
    defaultPersons: IPerson[],

    topics: ITopic[],
    defaultTopics: ITopic[],

    years: IYear[],
    defaultYears: IYear[]
  };

  constructor(private api: ApiService, private selection: SelectionService) {
    this.dataStore = {
      persons: [], defaultPersons: [],
      topics: [], defaultTopics: [],
      years: [], defaultYears: []
    };
    this._topics = <BehaviorSubject<ITopic[]>>new BehaviorSubject([]);
    this._persons = <BehaviorSubject<IPerson[]>>new BehaviorSubject([]);
    this._years = <BehaviorSubject<IYear[]>>new BehaviorSubject([]);

    this.topics = this._topics.asObservable();
    this.persons = this._persons.asObservable();
    this.years = this._years.asObservable();

    this.api.getYears()
      .subscribe( data => {
        console.log('data ', data);
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

  setFilter(): void {
    const filter = this.selection.getSelection();

    if (filter['person_id'] === null && filter['topic_id'] === null &&
      (filter['min_year'] !== null && filter['max_year'] !== null)) {
      // z: true  -  a: false  -  t: false
      this.filterDataByYear(filter['min_year'], filter['max_year']);


    } else if (filter['person_id'] !== null && filter['topic_id'] === null &&
      (filter['min_year'] === null && filter['max_year'] === null)) {
      // z: false  -  a: true  -  t: false
      this.filterDataByPerson(String(filter['person_id']));

    } else if (filter['person_id'] === null && filter['topic_id'] !== null &&
      (filter['min_year'] === null && filter['max_year'] === null)) {
      // z: false  -  a: false  -  t: true
      this.filterDataByTopic(String(filter['topic_id']));

    } else if (filter['person_id'] !== null && filter['topic_id'] === null &&
      (filter['min_year'] !== null && filter['max_year'] !== null)) {
      // z: true  -  a: true  -  t: false
      this.filterDataByYearAndPerson(filter['min_year'], filter['max_year'], String(filter['person_id']));

    } else if (filter['person_id'] === null && filter['topic_id'] !== null &&
      (filter['min_year'] !== null && filter['max_year'] !== null)) {
      // z: true  -  a: false  -  t: true


    } else if (filter['person_id'] !== null && filter['topic_id'] !== null &&
      (filter['min_year'] === null && filter['max_year'] === null)) {
      // z: false  -  a: true  -  t: true


    } else if (filter['person_id'] !== null && filter['topic_id'] !== null &&
      (filter['min_year'] !== null && filter['max_year'] !== null)) {
      // z: true  -  a: true  -  t: true


    } else {
      // z: false  -  a: false  -  t: false
      // defaultwerte

    }
  }

  filterDataByPerson(personID: string): void {
    this.api.filterDataByPersonResultTopic(personID)
      .subscribe(data => {
        this.setTopic(data);
      });

    this.api.filterDataByPersonResultYear(personID)
      .subscribe(data => {
        this.setYear(data);
      });
  }

  filterDataByTopic(topicID: string): void {
    this.api.filterDataByTopicResultPerson(topicID)
      .subscribe(data => {
        this.setPerson(data);
      });
    this.api.filterDataByTopicResultYear(topicID)
      .subscribe(data => {
        this.setYear(data);
      });
  }

  filterDataByYear(minYear: number, maxYear: number): void {
    this.api.filterDataByYearResultPerson(minYear, maxYear)
      .subscribe(data => {
        this.setPerson(data);
      });
    this.api.filterDataByYearResultTopic(minYear, maxYear)
      .subscribe(data => {
        this.setTopic(data);
      });
  }

  filterDataByYearAndPerson(minYear: number, maxYear: number, personID: string): void {

    this.api.filterDataForYearPersonResultYear(minYear, maxYear, personID)
      .subscribe(data => {
        console.log(data);
        this.setYear(data);
      });

    this.api.filterDataForYearPersonResultTopic(minYear, maxYear, personID)
      .subscribe(data => {
        console.log(data);
      })

  }

  getYear(): Array<IYear> {
    return this.year;
  }
}
