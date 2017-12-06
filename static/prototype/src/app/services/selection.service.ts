import {Injectable} from '@angular/core';

import {IPerson, ITopic, IYear} from '../app.interfaces';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class SelectionService {
  private selectedPerson = new Subject<IPerson>();
  private selectedTopic = new Subject<ITopic>();
  private selectedMinYear = new Subject<number>();
  private selectedMaxYear = new Subject<number>();

  private personId: string = null;
  private topicId: number = null;
  private minYear: number = null;
  private maxYear: number = null;

  selPerson$ = this.selectedPerson.asObservable();
  selTopic$ = this.selectedTopic.asObservable();
  selMinYear$ = this.selectedMinYear.asObservable();
  selMaxYear$ = this.selectedMaxYear.asObservable();

  setPerson(person: IPerson): void {
    if (person && this.personId === person.id) person = null;
    this.personId = person ? person.id : null;
    this.selectedPerson.next(person);
  }

  getPerson(): Subject<IPerson> {
    return this.selectedPerson;
  }

  setTopic(topic: ITopic): void {
    if (topic && this.topicId === topic.id) topic = null;
    this.topicId = topic ? topic.id : null;
    this.selectedTopic.next(topic);
  }

  getTopic(): Subject<ITopic> {
    return this.selectedTopic;
  }

  setYear(minYear: number, maxYear: number): void {
    this.minYear = minYear;
    this.maxYear = maxYear;
    this.selectedMinYear.next(minYear);
    this.selectedMaxYear.next(maxYear);
  }

  // getYears(): Subject<Number[]> {
  //   return [this.selectedMinYear, this.selectedMaxYear];
  // }

  getSelection(): Object {
    const {personId, topicId, minYear, maxYear} = this;
    return {personId, topicId, minYear, maxYear};
  }
}
