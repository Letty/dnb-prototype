import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";

import {ApiService} from '../services/api.service';
import {SelectionService} from "./selection.service";
import {IPerson, ITopic, IYear} from '../app.interfaces';
import {Observable} from "rxjs/Observable";

@Injectable()
export class DataService {
  private defaultYear: Array<IYear>;
  private defaultPerson: Array<IPerson>;
  private defaultTopic: Array<ITopic>;

  topics: Observable<ITopic[]>;
  persons: Observable<IPerson[]>;
  private _topics: BehaviorSubject<ITopic[]>;
  private _persons: BehaviorSubject<IPerson[]>;

  private year: Array<IYear>;

  private dataStore: {
    persons: IPerson[],
    defaultPersons: IPerson[],

    topics: ITopic[],
    defaultTopics: ITopic[]
  };

  constructor(private api: ApiService, private selection: SelectionService) {

    this.dataStore = {
      persons: [], defaultPersons: [],
      topics: [], defaultTopics: []
    };
    this._topics = <BehaviorSubject<ITopic[]>>new BehaviorSubject([]);
    this._persons = <BehaviorSubject<IPerson[]>>new BehaviorSubject([]);

    this.topics = this._topics.asObservable();
    this.persons = this._persons.asObservable();

    this.api.getYears().subscribe(
      result => {
        this.defaultYear = Object.keys(result).map(key => {
          return {
            id: result[key].id,
            year: result[key].year,
            count: result[key].count
          };
        });
      },
      error => {
      },
      () => {
        this.year = this.defaultYear;
      }
    );

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


  setTopic(topics_: ITopic[]): void {
    this.dataStore.topics = topics_;
    this._topics.next(Object.assign({}, this.dataStore).topics);
  }

  setPerson(persons_: IPerson[]): void {
    this.dataStore.persons = persons_;
    this._persons.next(Object.assign({}, this.dataStore).persons);
  }

  setFilter(): void {
    let filter = this.selection.getSelection();

    if (filter['person_id'] !== null && filter['topic_id'] === null) { //&& filter['year'] === null
      // z: false  -  a: true  -  t: false
      this.filterDataByPerson(String(filter['person_id']));
    } else if (filter['person_id'] !== null && filter['topic_id'] === null) {//&& filter['year'] !== null
      // z: true  -  a: true  -  t: false

    } else if (filter['person_id'] === null && filter['topic_id'] !== null) {//&& filter['year'] === null
      // z: false  -  a: false  -  t: true
      this.filterDataByTopic(String(filter['topic_id']));
    } else if (filter['person_id'] === null && filter['topic_id'] !== null) {//&& filter['year'] !== null
      // z: true  -  a: false  -  t: true

    } else if (filter['person_id'] !== null && filter['topic_id'] !== null) {//&& filter['year'] === null
      // z: false  -  a: true  -  t: true

    } else if (filter['person_id'] !== null && filter['topic_id'] !== null) {//&& filter['year'] !== null
      // z: true  -  a: true  -  t: true

    } else {
      // z: false  -  a: false  -  t: false
      //defaultwerte

    }
  }

  filterDataByPerson(personID: string): void {
    this.api.filterDataByPersonResultTopic(personID)
      .subscribe(data => {
        this.setTopic(data);
      });
    // this.http.put('/setFilterForPersonResultTopic', personID, this.headers)
    //   .subscribe(res => {
    //     console.log('---thema---');
    //     console.log(res.json());
	//
    //   }, error => {
    //     console.log(error);
    //   });
  }

  filterDataByTopic(topicID: string): void {
    this.api.filterDataByTopicResultPerson(topicID)
      .subscribe(data => {
        this.setPerson(data);
      })
    // this.http.put('/setFilterForTopicResultYear', topicID, this.headers)
    //   .subscribe(res => {
    //     console.log('---jahr---');
    //     console.log(res.json());
    //     this.dataService.setTopic(res.json())
    //   }, error => {
    //     console.log(error);
    //   });

  }


  getYear(): Array<IYear> {
    return this.year;
  }
}
