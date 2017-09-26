import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map'
import {Observable} from 'rxjs/Observable';

import {IPerson, ITopic, IYear} from '../app.interfaces';

@Injectable()
export class ApiService {

  constructor(private http: Http){}

  getTopics(): Observable<ITopic> {
    return this.http.get('/getTopTopics').map(res => <ITopic>res.json());
  }

  getPersons(): Observable<IPerson> {
    return this.http.get('/getTopPeople').map(res => <IPerson>res.json());
  }

  getYears(): Observable<IYear> {
    return this.http.get('/getTimeline').map(res => <IYear>res.json());
  }
}

