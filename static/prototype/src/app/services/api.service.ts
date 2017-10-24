import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map'
import {Observable} from 'rxjs/Observable';

import {IPerson, ITopic, IYear} from '../app.interfaces';

@Injectable()
export class ApiService {
  private headers = new Headers();

  constructor(private http: Http) {
    this.headers.append('Content-Type', 'application/json');
  }

  getTopics(): Observable<ITopic[]> {
    return this.http.get('/getTopTopics').map(res => <ITopic[]>res.json());
  }

  getPersons(): Observable<IPerson[]> {
    return this.http.get('/getTopPeople').map(res => <IPerson[]>res.json());
  }

  getYears(): Observable<IYear[]> {
    return this.http.get('/getTimeline').map(res => <IYear[]>res.json());
  }


  filterDataByPersonResultYear(personID: string): Observable<IYear[]> {
    return this.http.put('/setFilterForPersonResultYear', personID, this.headers)
      .map(res => <IYear[]>res.json().data);

  }

  filterDataByPersonResultTopic(personID: string): Observable<ITopic[]> {
    return this.http.put('/setFilterForPersonResultTopic', personID, this.headers).map(
      res => <ITopic[]>res.json().data);
  }

  filterDataByTopicResultYear(topicID: string): Observable<IYear[]> {
    return this.http.put('/setFilterForTopicResultYear', topicID, this.headers).map(
      res => <IYear[]>res.json().data);
  }

  filterDataByTopicResultPerson(topicID: string): Observable<IPerson[]> {
    return this.http.put('/setFilterForTopicResultPerson', topicID, this.headers).map(
      res => <IPerson[]>res.json().data);
  }

  filterDataByYearResultPerson(yearMin: number, yearMax: number): Observable<IPerson[]> {
    return this.http.put('/setFilterForYearResultPerson', JSON.stringify([yearMin,yearMax]), this.headers)
      .map(res => <IPerson[]>res.json().data);
  }
  filterDataByYearResultTopic(yearMin: number, yearMax: number): Observable<ITopic[]> {
    return this.http.put('/setFilterForYearResultTopic', JSON.stringify([yearMin,yearMax]), this.headers)
      .map(res => <ITopic[]>res.json().data);
  }
}

