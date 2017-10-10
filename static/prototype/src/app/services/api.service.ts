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
    this.http.put('/setFilter',  this.selection.getSelection(), this.headers)
      .subscribe(res => {
        console.log(res);
      }, error => {
        console.log(error);
      });
  }
}

