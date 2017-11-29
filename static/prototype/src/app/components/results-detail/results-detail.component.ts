import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {trigger, state, style, animate, transition} from '@angular/animations';
import {ApiService} from '../../services/api.service';

import {IItem, IPerson, ITopic} from '../../app.interfaces';
import {DataService} from '../../services/data.service';
import {SelectionService} from '../../services/selection.service';
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
  public selectedMinYear: number;
  public selectedMaxYear: number;
  public selectedPerson: IPerson;
  public selectedTopic: ITopic;

  @Output() closeDetail: EventEmitter<any> = new EventEmitter();
  @Input() loadingData = false;
  @Input() item: any = null;
  @Input() itemTitle: string = null;
  @Input() itemAutor: string = null;

  public items: Observable<IItem[]>;

  public inOut = 'in';

  constructor(
    private selection: SelectionService,
    private dataService: DataService
  ) {
    selection.selPerson$.subscribe(
      person => {
        this.selectedPerson = person;
      }
    );

    selection.selTopic$.subscribe(
      topic => {
        this.selectedTopic = topic;
      }
    );

    selection.selMinYear$.subscribe(
      year => {
        this.selectedMinYear = year;
      }
    );
    selection.selMaxYear$.subscribe(
      year => {
        this.selectedMaxYear = year;
      }
    );
  }

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

  reset () {
    this.selection.setYear(null, null);
    this.selection.setTopic(null);
    this.selection.setPerson(null);
  }

  selectYear(year): void {
    this.reset();
    this.selection.setYear(year, null);
    this.dataService.setFilter();
    this.close();
  }
  selectTopic(topic): void {
    this.reset();
    this.selection.setTopic(topic);
    this.dataService.setFilter();
    this.close();
  }
  selectPerson(person): void {
    this.reset();
    this.selection.setPerson(person);
    this.dataService.setFilter();
    this.close();
  }
}
