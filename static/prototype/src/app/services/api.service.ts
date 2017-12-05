import {Injectable, EventEmitter} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise';
import {Observable} from 'rxjs/Observable';

import {IPerson, ITopic, IYear, IItem} from '../app.interfaces';

import {trackPiwik} from './piwikTracking';

@Injectable()
export class ApiService {
  private headers = new Headers();
  public loadingData$: EventEmitter<string>;

  constructor(private http: Http) {
    this.headers.append('Content-Type', 'application/json');
  }

  getTopics(): Observable<ITopic[]> {
    return this.http.get('/getTopTopics')
      .map(res => <ITopic[]>res.json());
  }

  getPersons(): Observable<IPerson[]> {
    return this.http.get('/getTopPeople')
      .map(res => <IPerson[]>res.json());
  }

  getYears(): Observable<IYear[]> {
    return this.http.get('/getTimeline')
      .map(res => <IYear[]>res.json());
  }

  getResults(): Observable<IItem[]> {
    return this.http.get('/getStartResults')
      .map(res => <IItem[]>res.json());
  }

  getResultsForPage(page: number): Observable<IItem[]> {
    return this.http.post('/getResultsForPage', JSON.stringify({page}), this.headers)
      .map(res => <IItem[]>res.json());
  }

  filterDataByPersonResultYear(personID: string): Observable<IYear[]> {
    return this.http.post('/setFilterForPersonResultYear', personID, this.headers)
      .map(res => <IYear[]>res.json().data);
  }

  filterDataByPersonResultTopic(personID: string): Observable<ITopic[]> {
    return this.http.post('/setFilterForPersonResultTopic', personID, this.headers)
      .map(res => <ITopic[]>res.json().data);
  }

  filterDataByPersonResultPerson(personID: string): Observable<IPerson[]> {
    return this.http.post('/setFilterForPersonResultPerson', personID, this.headers)
      .map(res => <IPerson[]>res.json().data);
  }

  filterDataByPersonResultItems(personID: string, page = 0): Observable<IItem[]> {
    return this.http.post('/setFilterForPersonResultItems', JSON.stringify({person_id: personID, page}), this.headers)
      .map(res => <IItem[]>res.json().data);
  }

  filterDataByTopicResultYear(topicID: string): Observable<IYear[]> {
    return this.http.post('/setFilterForTopicResultYear', topicID, this.headers)
      .map(res => <IYear[]>res.json().data);
  }

  filterDataByTopicResultPerson(topicID: string): Observable<IPerson[]> {
    return this.http.post('/setFilterForTopicResultPerson', topicID, this.headers)
      .map(res => <IPerson[]>res.json().data);
  }

  filterDataByTopicResultTopic(topicID: string): Observable<ITopic[]> {
    return this.http.post('/setFilterForTopicResultTopic', topicID, this.headers)
      .map(res => <ITopic[]>res.json().data);
  }

  filterDataByTopicResultItems(topicID: string, page = 0): Observable<IItem[]> {
    return this.http.post('/setFilterForTopicResultItems', JSON.stringify({topic_id: topicID, page}), this.headers)
      .map(res => <IItem[]>res.json().data);
  }

  filterDataByYearResultPerson(yearMin: number, yearMax: number): Observable<IPerson[]> {
    return this.http.post('/setFilterForYearResultPerson',
      JSON.stringify([yearMin, yearMax]), this.headers)
      .map(res => <IPerson[]>res.json().data);
  }

  filterDataByYearResultTopic(yearMin: number, yearMax: number): Observable<ITopic[]> {
    return this.http.post('/setFilterForYearResultTopic',
      JSON.stringify([yearMin, yearMax]), this.headers)
      .map(res => <ITopic[]>res.json().data);
  }

  filterDataByYearResultItems(yearMin: number, yearMax: number, page = 0): Observable<IItem[]> {
    return this.http.post('/setFilterForYearResultItems',
      JSON.stringify({years: [yearMin, yearMax], page}), this.headers)
      .map(res => <IItem[]>res.json().data);
  }

  filterDataForYearPersonResultYear(personID: string): Observable<IYear[]> {
    return this.http.post('/setFilterForYearPersonResultYear',
      JSON.stringify({'person_id': personID}), this.headers)
      .map(res => <IYear[]>res.json().data);
  }

  filterDataForYearPersonResultPerson(yearMin: number, yearMax: number, personID: string): Observable<IPerson[]> {
    return this.http.post('/setFilterForYearPersonResultPerson',
      JSON.stringify({'person_id': personID, 'min_year': yearMin, 'max_year': yearMax}), this.headers)
      .map(res => <IPerson[]>res.json().data);
  }

  filterDataForYearPersonResultTopic(yearMin: number, yearMax: number, personID: string): Observable<ITopic[]> {
    return this.http.post('/setFilterForYearPersonResultTopic',
      JSON.stringify({'person_id': personID, 'min_year': yearMin, 'max_year': yearMax}), this.headers)
      .map(res => <ITopic[]>res.json().data);
  }

  filterDataForYearPersonResultItems(yearMin: number, yearMax: number, personID: string, page = 0): Observable<IItem[]> {
    return this.http.post('/setFilterForYearPersonResultItems',
      JSON.stringify({'person_id': personID, 'min_year': yearMin, 'max_year': yearMax, page}), this.headers)
      .map(res => <IItem[]>res.json().data);
  }

  filterDataForPersonTopicResultPerson(personID: string, topicID: string): Observable<IPerson[]> {
    return this.http.post('/setFilterForPersonTopicResultPerson',
      JSON.stringify({'person_id': personID, 'topic_id': topicID}), this.headers)
      .map(res => <IPerson[]>res.json().data);
  }

  filterDataForPersonTopicResultYear(personID: string, topicID: string): Observable<IYear[]> {
    return this.http.post('/setFilterForPersonTopicResultYear',
      JSON.stringify({'person_id': personID, 'topic_id': topicID}), this.headers)
      .map(res => <IYear[]>res.json().data);
  }

  filterDataForPersonTopicResultTopic(personID: string, topicID: string): Observable<ITopic[]> {
    return this.http.post('/setFilterForPersonTopicResultTopic',
      JSON.stringify({'person_id': personID, 'topic_id': topicID}), this.headers)
      .map(res => <ITopic[]>res.json().data);
  }

  filterDataForPersonTopicResultItems(personID: string, topicID: string, page = 0): Observable<IItem[]> {
    return this.http.post('/setFilterForPersonTopicResultItems',
      JSON.stringify({'person_id': personID, 'topic_id': topicID, page}), this.headers)
      .map(res => <IItem[]>res.json().data);
  }

  filterDataForYearTopicResultYear(topicID: string): Observable<IYear[]> {
    return this.http.post('/setFilterForYearTopicResultYear',
      JSON.stringify({'topic_id': topicID}), this.headers)
      .map(res => <IYear[]>res.json().data);
  }

  filterDataForYearTopicResultPerson(yearMin: number, yearMax: number, topicID: string): Observable<IPerson[]> {
    return this.http.post('/setFilterForYearTopicResultPerson',
      JSON.stringify({'min_year': yearMin, 'max_year': yearMax, 'topic_id': topicID}), this.headers)
      .map(res => <IPerson[]>res.json().data);
  }
  filterDataForYearTopicResultTopic(yearMin: number, yearMax: number, topicID: string): Observable<ITopic[]> {
    return this.http.post('/setFilterForYearTopicResultTopic',
      JSON.stringify({'min_year': yearMin, 'max_year': yearMax, 'topic_id': topicID}), this.headers)
      .map(res => <ITopic[]>res.json().data);
  }

  filterDataForYearTopicResultItems(yearMin: number, yearMax: number, topicID: string, page = 0): Observable<IItem[]> {
    return this.http.post('/setFilterForYearTopicResultItems',
      JSON.stringify({'min_year': yearMin, 'max_year': yearMax, 'topic_id': topicID, page}), this.headers)
      .map(res => <IItem[]>res.json().data);
  }

  filterDataForYearPersonTopicResultYear(personID: string,
                                         topicID: string): Observable<IYear[]> {
    return this.http.post('/setFilterForYearPersonTopicResultYear',
      JSON.stringify({'person_id': personID, 'topic_id': topicID}), this.headers)
      .map(res => <IYear[]>res.json().data);
  }

  filterDataForYearPersonTopicResultPerson(yearMin: number, yearMax: number, personID: string,
                                          topicID: string): Observable<IPerson[]> {
    return this.http.post('/setFilterForYearPersonTopicResultPerson',
      JSON.stringify({'person_id': personID, 'min_year': yearMin, 'max_year': yearMax, 'topic_id': topicID}), this.headers)
      .map(res => <IPerson[]>res.json().data);
  }
  filterDataForYearPersonTopicResultTopic(yearMin: number, yearMax: number, personID: string,
                                          topicID: string): Observable<ITopic[]> {
    return this.http.post('/setFilterForYearPersonTopicResultTopic',
      JSON.stringify({'person_id': personID, 'min_year': yearMin, 'max_year': yearMax, 'topic_id': topicID}), this.headers)
      .map(res => <ITopic[]>res.json().data);
  }
  filterDataForYearPersonTopicResultItems(yearMin: number, yearMax: number, personID: string,
                                          topicID: string, page = 0): Observable<IItem[]> {
    return this.http.post('/setFilterForYearPersonTopicResultItems',
      JSON.stringify({'person_id': personID, 'min_year': yearMin, 'max_year': yearMax, 'topic_id': topicID, page}), this.headers)
      .map(res => <IItem[]>res.json().data);
  }

  getItem(itemID: string): Observable<any> {
    trackPiwik('ViewResultDetail', itemID);
    return this.http.post('/getItem', itemID, this.headers)
      .map(res => res.json().data);
  }

  searchForPerson(query: string): Observable<IPerson[]> {
    return this.http.post('/searchForPerson', query, this.headers)
      .map(res => res.json().data);
  }

  searchForTopic(query: string): Observable<ITopic[]> {
    return this.http.post('/searchForTopic', query, this.headers)
      .map(res => res.json().data);
  }

  getTopTopicConnections(): Observable<any> {
    return this.http.get('/getTopTopicNetwork')
      .map(res => res.json().data);
  }

  getTopicNetworkFilterPerson(personID: string): Observable<any> {
    return this.http.post('/getTopicNetworkFilterPerson', personID, this.headers)
      .map(res => res.json().data);
  }

  getTopicNetworkFilterTopic(topicID: string): Observable<any> {
    return this.http.post('/getTopicNetworkFilterTopic', topicID, this.headers)
      .map(res => res.json().data);
  }

  getTopicNetworkFilterYear(yearMin: number, yearMax: number): Observable<any> {
    return this.http.post('/getTopicNetworkFilterYear',
      JSON.stringify([yearMin, yearMax]), this.headers)
      .map(res => res.json().data);
  }

  getTopicNetworkFilterYearTopic(yearMin: number, yearMax: number, topicID: string): Observable<any> {
    return this.http.post('/getTopicNetworkFilterYearTopic',
      JSON.stringify({'min_year': yearMin, 'max_year': yearMax, 'topic_id': topicID}),
      this.headers)
      .map(res => res.json().data);
  }

  getTopicNetworkFilterYearPerson(yearMin: number, yearMax: number, personID: string): Observable<any> {
    return this.http.post('/getTopicNetworkFilterYearPerson',
      JSON.stringify({'person_id': personID, 'min_year': yearMin, 'max_year': yearMax}),
      this.headers)
      .map(res => res.json().data);
  }

  getTopicNetworkFilterPersonTopic(personID: string, topicID: string): Observable<any> {
    return this.http.post('/getTopicNetworkFilterPersonTopic',
      JSON.stringify({'person_id': personID, 'topic_id': topicID}),
      this.headers)
      .map(res => res.json().data);
  }

  getTopicNetworkFilterYearPersonTopic(yearMin: number, yearMax: number, personID: string, topicID: string): Observable<any> {
    return this.http.post('/getTopicNetworkFilterYearPersonTopic',
      JSON.stringify({'person_id': personID, 'min_year': yearMin, 'max_year': yearMax, 'topic_id': topicID}),
      this.headers)
      .map(res => res.json().data);
  }

  getYearsForMultiplePersons(personIDs: string[]): Observable<IYear[][]> {
    const promises = personIDs.map(personID => this.http.post('/setFilterForPersonResultYear', personID, this.headers)
      .toPromise().then(res => res.json().data as IYear[]));
    return Observable.fromPromise(Promise.all(promises));
  }

  getYearsForMultiplePersonsFilterTopics(personIDs: string[], topicID: string): Observable<IYear[][]> {
    const promises = personIDs.map(personID => this.http.post('/setFilterForPersonTopicResultYear',
      JSON.stringify({'person_id': personID, 'topic_id': topicID}), this.headers)
      .toPromise().then(res => res.json().data as IYear[]));
    return Observable.fromPromise(Promise.all(promises));
  }
}
