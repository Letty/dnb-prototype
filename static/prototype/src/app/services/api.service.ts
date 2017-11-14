import {Injectable, EventEmitter} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

import {IPerson, ITopic, IYear, IItem} from '../app.interfaces';

@Injectable()
export class ApiService {
  private headers = new Headers();
  // private server = ''; // set to '' for production
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

  getResults(): Observable<IItem[]> {
    this.loadingData$.emit('item');
    return this.http.get(`${this.server}/getStartResults`).map(res => <IItem[]>res.json());
  }


  filterDataByPersonResultYear(personID: string): Observable<IYear[]> {
    this.loadingData$.emit('year');
    return this.http.post(`${this.server}/setFilterForPersonResultYear`, personID, this.headers)
      .map(res => <IYear[]>res.json().data);

  }

  filterDataByPersonResultTopic(personID: string): Observable<ITopic[]> {
    this.loadingData$.emit('topic');
    return this.http.post(`${this.server}/setFilterForPersonResultTopic`, personID, this.headers).map(
      res => <ITopic[]>res.json().data);
  }

  filterDataByPersonResultItems(personID: string): Observable<IItem[]> {
    this.loadingData$.emit('item');
    return this.http.post(`${this.server}/setFilterForPersonResultItems`, personID, this.headers)
      .map(res => <IItem[]>res.json().data)
  }

  filterDataByTopicResultYear(topicID: string): Observable<IYear[]> {
    this.loadingData$.emit('year');
    return this.http.post(`${this.server}/setFilterForTopicResultYear`, topicID, this.headers).map(
      res => <IYear[]>res.json().data);
  }

  filterDataByTopicResultPerson(topicID: string): Observable<IPerson[]> {
    this.loadingData$.emit('person');
    return this.http.post(`${this.server}/setFilterForTopicResultPerson`, topicID, this.headers).map(
      res => <IPerson[]>res.json().data);
  }

  filterDataByTopicResultItems(topicID: string): Observable<IItem[]> {
    this.loadingData$.emit('item');
    return this.http.post(`${this.server}/setFilterForTopicResultItems`, topicID, this.headers)
      .map(res => <IItem[]>res.json().data);
  }

  filterDataByYearResultPerson(yearMin: number, yearMax: number): Observable<IPerson[]> {
    this.loadingData$.emit('person');
    return this.http.post(`${this.server}/setFilterForYearResultPerson`,
      JSON.stringify([yearMin, yearMax]), this.headers)
      .map(res => <IPerson[]>res.json().data);
  }

  filterDataByYearResultTopic(yearMin: number, yearMax: number): Observable<ITopic[]> {
    this.loadingData$.emit('topic');
    return this.http.post(`${this.server}/setFilterForYearResultTopic`,
      JSON.stringify([yearMin, yearMax]), this.headers)
      .map(res => <ITopic[]>res.json().data);
  }

  filterDataByYearResultItems(yearMin: number, yearMax: number): Observable<IItem[]> {
    this.loadingData$.emit('item');
    return this.http.post(`${this.server}/setFilterForYearResultItems`,
      JSON.stringify([yearMin, yearMax]), this.headers)
      .map(res => <IItem[]>res.json().data);
  }

  filterDataForYearPersonResultYear(yearMin: number, yearMax: number, personID: string): Observable<IYear[]> {
    this.loadingData$.emit('year');
    return this.http.post(`${this.server}/setFilterForYearPersonResultYear`,
      JSON.stringify({'person_id': personID, 'min_year': yearMin, 'max_year': yearMax}), this.headers)
      .map(res => <IYear[]>res.json().data);
  }

  filterDataForYearPersonResultTopic(yearMin: number, yearMax: number, personID: string): Observable<ITopic[]> {
    this.loadingData$.emit('topic');
    return this.http.post(`${this.server}/setFilterForYearPersonResultTopic`,
      JSON.stringify({'person_id': personID, 'min_year': yearMin, 'max_year': yearMax}), this.headers)
      .map(res => <ITopic[]>res.json().data);
  }

  filterDataForYearPersonResultItems(yearMin: number, yearMax: number, personID: string): Observable<IItem[]> {
    this.loadingData$.emit('item');
    return this.http.post(`${this.server}/setFilterForYearPersonResultItems`,
      JSON.stringify({'person_id': personID, 'min_year': yearMin, 'max_year': yearMax}), this.headers)
      .map(res => <IItem[]>res.json().data);
  }

  filterDataForPersonTopicResultYear(personID: string, topicID: string): Observable<IYear[]> {
    this.loadingData$.emit('item');
    return this.http.post(`${this.server}/setFilterForPersonTopicResultYear`,
      JSON.stringify({'person_id': personID, 'topic_id': topicID})
      , this.headers)
      .map(res => <IYear[]>res.json().data);
  }

  filterDataForPersonTopicResultItems(personID: string, topicID: string): Observable<IItem[]> {
    this.loadingData$.emit('item');
    return this.http.post(`${this.server}/setFilterForPersonTopicResultItems`,
      JSON.stringify({'person_id': personID, 'topic_id': topicID})
      , this.headers)
      .map(res => <IItem[]>res.json().data);
  }

  filterDataForYearTopicResultYear(yearMin: number, yearMax: number, topicID: string): Observable<IYear[]> {
    this.loadingData$.emit('item');
    return this.http.post(`${this.server}/setFilterForYearTopicResultYear`,
      JSON.stringify({'min_year': yearMin, 'max_year': yearMax, 'topic_id': topicID})
      , this.headers)
      .map(res => <IYear[]>res.json().data);
  }

  filterDataForYearTopicResultItems(yearMin: number, yearMax: number, topicID: string): Observable<IItem[]> {
    this.loadingData$.emit('item');
    return this.http.post(`${this.server}/setFilterForYearTopicResultItems`,
      JSON.stringify({'min_year': yearMin, 'max_year': yearMax, 'topic_id': topicID})
      , this.headers)
      .map(res => <IItem[]>res.json().data);
  }

  filterDataForYearPersonTopicResultYear(yearMin: number, yearMax: number, personID: string,
                                          topicID: string): Observable<IYear[]> {
    this.loadingData$.emit('item');
    return this.http.post(`${this.server}/setFilterForYearPersonTopicResultYear`,
      JSON.stringify({'person_id': personID, 'min_year': yearMin, 'max_year': yearMax, 'topic_id': topicID})
      , this.headers)
      .map(res => <IYear[]>res.json().data);
  }

  filterDataForYearPersonTopicResultItems(yearMin: number, yearMax: number, personID: string,
                                          topicID: string): Observable<IItem[]> {
    this.loadingData$.emit('item');
    return this.http.post(`${this.server}/setFilterForYearPersonTopicResultItems`,
      JSON.stringify({'person_id': personID, 'min_year': yearMin, 'max_year': yearMax, 'topic_id': topicID})
      , this.headers)
      .map(res => <IItem[]>res.json().data);
  }

  getItem(itemID: string): Observable<any>{
    return this.http.post(`${this.server}/getItem`, itemID, this.headers).map(res => res.json().data);
  }

  searchForPerson(query: string): Observable<IPerson[]>{
    return this.http.post(`${this.server}/searchForPerson`, query, this.headers).map(res => res.json().data)
  }
  searchForTopic(query: string): Observable<ITopic[]>{
    return this.http.post(`${this.server}/searchForTopic`, query, this.headers).map(res => res.json().data)
  }

  getTopTopicConnections(): Observable<any> {
    return this.http.get(`${this.server}/getTopTopicNetwork`).map(res => res.json().data)
  }
}
