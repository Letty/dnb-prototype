import {Injectable, EventEmitter} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';

import {DataService} from './data.service';

@Injectable()
export class RouterService {
  view: Observable<string>;

  private _view: BehaviorSubject<string>;

  private routerStore: {
    view: string
  };

  constructor(private dataService: DataService) {
    this.routerStore = {
      view: 'index'
    };
    this._view = <BehaviorSubject<string>>new BehaviorSubject('');

    this.view = this._view.asObservable();

    this.setView('index');
  }

  setView(view_: string): void {
    this.routerStore.view = view_;
    this._view.next(Object.assign('', this.routerStore).view);
    this.dataService.setRoute(this.routerStore.view);
  }
}
