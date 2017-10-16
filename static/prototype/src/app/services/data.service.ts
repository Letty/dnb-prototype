import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {ApiService} from '../services/api.service';
import {IPerson, ITopic, IYear} from '../app.interfaces';

@Injectable()
export class DataService {
  private defaultYear: Array<IYear>;
  private defaultPerson: Array<IPerson>;
  private defaultTopic: Array<ITopic>;

  private year: Array<IYear>;
  private person: Array<IPerson>;
  private topic: Array<ITopic>;

  constructor(private http: Http, private api: ApiService) {

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

    this.api.getTopics().subscribe(
      result => {
        this.defaultTopic = Object.keys(result).map(key => {
          return {
            id: result[key].id,
            keyword: result[key].keyword,
            count: result[key].count
          };
        });
      },
      error => {
      },
      () => {
        this.topic = this.defaultTopic;
        console.log(this.topic);
      })
  }

  getPerson(): Array<IPerson> {
    return this.person;
  }

  getTopic(): Array<ITopic> {
    return this.topic;
  }

  getYear(): Array<IYear> {
    return this.year;
  }
}
