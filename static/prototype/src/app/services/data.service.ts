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
  private _topics: BehaviorSubject<ITopic[]>;
  private year: Array<IYear>;
  private person: Array<IPerson>;
  private topic: Observable<ITopic[]>;

  private dataStore: {
    topics: ITopic[],
    defaultTopics: ITopic[]
  };

  constructor(private api: ApiService, private selection: SelectionService) {

    this.dataStore = {topics: [], defaultTopics: []};
    this._topics = <BehaviorSubject<ITopic[]>>new BehaviorSubject([]);
    this.topics = this._topics.asObservable();

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

    this.api.getPersons().subscribe(
      result => {
        this.defaultPerson = Object.keys(result).map(key => {
          return {
            id: result[key].id,
            name: result[key].name,
            lastname: result[key].lastname,
            count: result[key].count
          };
        });
      },
      error => {
      },
      () => {
        this.person = this.defaultPerson;
      }
    );

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
    // this.http.put('/setFilterForTopicResultYear', topicID, this.headers)
    //   .subscribe(res => {
    //     console.log('---jahr---');
    //     console.log(res.json());
    //     this.dataService.setTopic(res.json())
    //   }, error => {
    //     console.log(error);
    //   });
    // this.http.put('/setFilterForTopicResultPerson', topicID, this.headers)
    //   .subscribe(res => {
    //     console.log('---personen---');
    //     console.log(res.json());
    //   }, error => {
    //     console.log(error);
    //   });
  }

  getPerson(): Array<IPerson> {
    return this.person;
  }

  getYear(): Array<IYear> {
    return this.year;
  }
}
