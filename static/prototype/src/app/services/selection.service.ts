import {Injectable} from '@angular/core';

import {IPerson, ITopic, IYear} from '../app.interfaces';
import {Subject} from "rxjs/Subject";

@Injectable()
export class SelectionService {
  private selectedPerson = new Subject<IPerson>();
  private selectedTopic = new Subject<ITopic>();
  private selectedYear = new Subject<IYear>();

  private personID: string = null;
  private topicID: number = null;
  private yearMin: number = null;
  private yearMax: number = null;

  selPerson$ = this.selectedPerson.asObservable();
  selTopic$ = this.selectedTopic.asObservable();
  selYear$ = this.selectedYear.asObservable();

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

  setYear(year: IYear): void {
    this.selectedYear.next(year);
  }

  getYear(): Subject<IYear> {
    return this.selectedYear;
  }

  getSelection(): Object {
    return {
      'person_id': this.personID,
      'topic_id': this.topicID
      // 'year': this.selectedYear
    }
  }
}

