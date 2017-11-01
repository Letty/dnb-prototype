import {Injectable, EventEmitter} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

import {IPerson, ITopic, IYear} from '../app.interfaces';

@Injectable()
export class ApiService {
  private headers = new Headers();
  private server = 'http://localhost:5000'; // set to '' for production
  public loadingData$: EventEmitter<string>;

  constructor(private http: Http) {
    this.headers.append('Content-Type', 'application/json');
    this.loadingData$ = new EventEmitter();
  }

  getTopics(): Observable<ITopic[]> {
    this.loadingData$.emit('topic');
    return this.http.get(`${this.server}/getTopTopics`).map(res => <ITopic[]>res.json());
  }

  getPersons(): Observable<IPerson[]> {
    this.loadingData$.emit('person');
    return this.http.get(`${this.server}/getTopPeople`).map(res => <IPerson[]>res.json());
  }

  getYears(): Observable<IYear[]> {
    this.loadingData$.emit('year');
    return this.http.get(`${this.server}/getTimeline`).map(res => <IYear[]>res.json());
  }


  filterDataByPersonResultYear(personID: string): Observable<IYear[]> {
    this.loadingData$.emit('year');
    return this.http.put(`${this.server}/setFilterForPersonResultYear`, personID, this.headers)
      .map(res => <IYear[]>res.json().data);

  }

  filterDataByPersonResultTopic(personID: string): Observable<ITopic[]> {
    this.loadingData$.emit('topic');
    return this.http.put(`${this.server}/setFilterForPersonResultTopic`, personID, this.headers).map(
      res => <ITopic[]>res.json().data);
  }

  filterDataByTopicResultYear(topicID: string): Observable<IYear[]> {
    this.loadingData$.emit('year');
    return this.http.put(`${this.server}/setFilterForTopicResultYear`, topicID, this.headers).map(
      res => <IYear[]>res.json().data);
  }

  filterDataByTopicResultPerson(topicID: string): Observable<IPerson[]> {
    this.loadingData$.emit('person');
    return this.http.put(`${this.server}/setFilterForTopicResultPerson`, topicID, this.headers).map(
      res => <IPerson[]>res.json().data);
  }

  filterDataByYearResultPerson(yearMin: number, yearMax: number): Observable<IPerson[]> {
    this.loadingData$.emit('person');
    return this.http.put(`${this.server}/setFilterForYearResultPerson`, JSON.stringify([yearMin, yearMax]), this.headers)
      .map(res => <IPerson[]>res.json().data);
  }

  filterDataByYearResultTopic(yearMin: number, yearMax: number): Observable<ITopic[]> {
    this.loadingData$.emit('topic');
    return this.http.put(`${this.server}/setFilterForYearResultTopic`, JSON.stringify([yearMin, yearMax]), this.headers)
      .map(res => <ITopic[]>res.json().data);
  }

  filterDataForYearPersonResultYear(yearMin: number, yearMax: number, personID: string): Observable<IYear[]> {
    return this.http.put('/setFilterForYearPersonResultYear',
      JSON.stringify({'person_id': personID, 'min_year': yearMin, 'max_year': yearMax}), this.headers)
      .map(res => <IYear[]>res.json().data);
  }

  filterDataForYearPersonResultTopic(yearMin: number, yearMax: number, personID: string): Observable<ITopic[]> {
    return this.http.put('/setFilterForYearPersonResultTopic',
      JSON.stringify({'person_id': personID, 'min_year': yearMin, 'max_year': yearMax}), this.headers)
      .map(res => <ITopic[]>res.json().data);
  }
}
