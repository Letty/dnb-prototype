import {Injectable, EventEmitter} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class RouterService {
  view: Observable<string>;

  private _view: BehaviorSubject<string>;

  private routerStore: {
    view: string
  };

  constructor() {
    this.routerStore = {
      view: 'index'
    };
    this._view = <BehaviorSubject<string>>new BehaviorSubject('');

    this.view = this._view.asObservable();
  }

  setView(view_: string): void {
    this.routerStore.view = view_;
    this._view.next(Object.assign('', this.routerStore).view);
  }
}
