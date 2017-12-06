import {Injectable, EventEmitter} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';

import {DataService} from './data.service';
import {trackPiwik} from './piwikTracking';

@Injectable()
export class RouterService {
  view: Observable<string>;
  topic: Observable<number>;
  person: Observable<number>;
  result: Observable<number>;

  private _view: BehaviorSubject<string>;
  private _topic: BehaviorSubject<number>;
  private _person: BehaviorSubject<number>;
  private _result: BehaviorSubject<number>;

  private routerStore: {
    view: string,
    topic: number,
    person: number,
    result: number
  };

  private showInfo = false;
  public showInfo$: EventEmitter<boolean>;

  constructor(private dataService: DataService) {
    this.routerStore = {
      view: 'index',
      topic: 1,
      person: 1,
      result: 0
    };
    this._view = <BehaviorSubject<string>>new BehaviorSubject('');
    this._topic = <BehaviorSubject<number>>new BehaviorSubject(null);
    this._person = <BehaviorSubject<number>>new BehaviorSubject(null);
    this._result = <BehaviorSubject<number>>new BehaviorSubject(null);

    this.view = this._view.asObservable();
    this.topic = this._topic.asObservable();
    this.person = this._person.asObservable();
    this.result = this._result.asObservable();

    this.setView('index');
    this.showInfo$ = new EventEmitter();
  }

  setView(view: string): void {
    this.routerStore.view = view;
    this._view.next(Object.assign('', this.routerStore).view);
    this.dataService.setRoute(this.routerStore.view);

    let piwikDescription;
    switch (view) {
      case 'index':
        piwikDescription = 'StartView';
        break;
      case 'topic':
        piwikDescription = 'TopicDetailView';
        break;
      case 'person':
        piwikDescription = 'PersonDetailView';
        break;
      case 'results':
        piwikDescription = 'PersonResultView';
        break;
    }
    trackPiwik('setRoute', piwikDescription);
  }

  toggle(section: string): void {
    let {view, topic, person, result} = this.routerStore;
    switch (section) {
      case 'topic': view = topic === 2 ? 'index' : 'topic';
      break;
      case 'person': view = person === 2 ? 'index' : 'person';
      break;
      case 'result': view = result === 2 ? 'index' : 'result';
      break;
    }
    switch (view) {
      case 'topic': topic = 2; person = 0; result = 0;
      break;
      case 'person': topic = 0; person = 2; result = 0;
      break;
      case 'result': topic = 0; person = 0; result = 2;
      break;
      default: topic = 1; person = 1; result = 0;
      break;
    }

    this.routerStore = {view, topic, person, result};

    this._view.next(Object.assign('', this.routerStore).view);
    this._topic.next(Object.assign('', this.routerStore).topic);
    this._person.next(Object.assign('', this.routerStore).person);
    this._result.next(Object.assign('', this.routerStore).result);
    this.dataService.setRoute(this.routerStore.view);
  }

  toggleInfo () {
    this.showInfo = !this.showInfo;
    this.showInfo$.emit(this.showInfo);
  }
}
