import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map'
import {Observable} from 'rxjs/Observable';

import {IPerson, ITopic, IYear} from '../app.interfaces';
import {SelectionService} from "./selection.service";

@Injectable()
export class ApiService {
  private headers = new Headers();

  constructor(private http: Http, private selection: SelectionService) {
    this.headers.append('Content-Type', 'application/json');
  }

  getTopics(): Observable<ITopic> {
    return this.http.get('/getTopTopics').map(res => <ITopic>res.json());
  }

  getPersons(): Observable<IPerson> {
    return this.http.get('/getTopPeople').map(res => <IPerson>res.json());
  }

  getYears(): Observable<IYear> {
    return this.http.get('/getTimeline').map(res => <IYear>res.json());
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
    this.http.put('/setFilterForPersonResultYear', personID, this.headers)
      .subscribe(res => {
        console.log('---jahr---');
        console.log(res.json());
      }, error => {
        console.log(error);
      });
    this.http.put('/setFilterForPersonResultTopic', personID, this.headers)
      .subscribe(res => {
        console.log('---thema---');
        console.log(res.json());
      }, error => {
        console.log(error);
      });
  }

  filterDataByTopic(topicID: string): void {
    this.http.put('/setFilterForTopicResultYear', topicID, this.headers)
      .subscribe(res => {
        console.log('---jahr---');
        console.log(res.json());
      }, error => {
        console.log(error);
      });
    this.http.put('/setFilterForTopicResultPerson', topicID, this.headers)
      .subscribe(res => {
        console.log('---personen---');
        console.log(res.json());
      }, error => {
        console.log(error);
      });
  }
}

