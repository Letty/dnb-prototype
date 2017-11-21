import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {trigger, state, style, animate, transition} from '@angular/animations';
import {ApiService} from '../../services/api.service';

import {IItem} from '../../app.interfaces';
import {DataService} from '../../services/data.service';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'results-detail',
  templateUrl: './results-detail.component.html',
  styleUrls: ['./results-detail.component.scss'],
  animations: [
  trigger('fadeInOut', [
    transition(':enter', [   // :enter is alias to 'void => *'
      style({opacity: 0}),
      animate(200, style({opacity: 1}))
    ]),
    transition('in => out', [
      animate(200, style({opacity: 0}))
    ])
  ]),
  trigger('slideInOut', [
    transition(':enter', [   // :enter is alias to 'void => *'
      style({transform: 'translateX(100%)'}),
      animate(200, style({transform: 'translateX(0)'}))
    ]),
    transition('in => out', [
      animate(200, style({transform: 'translateX(100%)'}))
    ])
  ])
]
})

export class ResultsDetailComponent implements OnInit, OnChanges {

  @Output() closeDetail: EventEmitter<any> = new EventEmitter();
  @Input() loadingData = false;
  @Input() item: any = null;
  @Input() itemTitle: string = null;

  public items: Observable<IItem[]>;

  public inOut = 'in';

  constructor() {}

  ngOnInit(): void {
  }

  ngOnChanges (changes: SimpleChanges) {
  }

  close () {
    this.inOut = 'out';
  }

  animationDone (e) {
    if (e.toState === 'out') this.closeDetail.emit();
  }
}
