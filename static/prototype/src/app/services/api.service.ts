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

  getTopics(): Observable<ITopic> {
    return this.http.get('/getTopTopics').map(res => <ITopic>res.json());
  }

  getPersons(): Observable<IPerson> {
    return this.http.get('/getTopPeople').map(res => <IPerson>res.json());
  }

  getYears(): Observable<IYear> {
    return this.http.get('/getTimeline').map(res => <IYear>res.json());
  }

  setFilter(id: any, filterName: string): void {
    if (filterName === 'topic') {
      this.http.put('/setFilterForTopic', {id: id}, this.headers)
        .subscribe(res => {
          // console.log(res);
        }, error => {
          console.log(error);
        });
    } else if (filterName === 'person') {
      this.http.put('/setFilterForPerson', {id: id}, this.headers)
        .subscribe(res => {
          // console.log(res);
        }, error => {
          console.log(error);
        });
    } else if (filterName === 'year') {
      this.http.put('/setFilterForYear', {id: id}, this.headers)
        .subscribe(res => {
          // console.log(res);
        }, error => {
          console.log(error);
        });
    }
  }
}

