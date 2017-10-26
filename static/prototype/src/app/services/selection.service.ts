import {Injectable} from '@angular/core';

import {IPerson, ITopic, IYear} from '../app.interfaces';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class SelectionService {
  private selectedPerson = new Subject<IPerson>();
  private selectedTopic = new Subject<ITopic>();
  private selectedMinYear = new Subject<number>();
  private selectedMaxYear = new Subject<number>();

  private personID: string = null;
  private topicID: number = null;
  private yearMin: number = null;
  private yearMax: number = null;

  selPerson$ = this.selectedPerson.asObservable();
  selTopic$ = this.selectedTopic.asObservable();
  selMinYear$ = this.selectedMinYear.asObservable();
  selMaxYear$ = this.selectedMaxYear.asObservable();

  setPerson(person: IPerson): void {
    this.personID = person.id;
    this.selectedPerson.next(person);
  }

  getPerson(): Subject<IPerson> {
    return this.selectedPerson;
  }

  setTopic(topic: ITopic): void {
    this.topicID = topic.id;
    this.selectedTopic.next(topic);
  }

  getTopic(): Subject<ITopic> {
    return this.selectedTopic;
  }

  setYear(yearMin: number, yearMax: number): void {
    this.yearMin = yearMin;
    this.yearMax = yearMax;
    this.selectedMinYear.next(yearMin);
    this.selectedMaxYear.next(yearMax);
  }

  // getYears(): Subject<Number[]> {
  //   return [this.selectedMinYear, this.selectedMaxYear];
  // }

  getSelection(): Object {
    return {
      'person_id': this.personID,
      'topic_id': this.topicID,
      'min_year': this.yearMin,
      'max_year': this.yearMax
    };
  }
}
