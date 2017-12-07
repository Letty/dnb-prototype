import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {trigger, state, style, animate, transition} from '@angular/animations';

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
    transition(':enter', [
      style({opacity: 0}),
      animate(200, style({opacity: 1}))
    ]),
    transition('in => out', [animate(200, style({opacity: 0}))])
  ]),
  trigger('slideInOut', [
    transition(':enter', [
      style({transform: 'translateX(100%)'}),
      animate(200, style({transform: 'translateX(0)'}))
    ]),
    transition('in => out', [animate(200, style({transform: 'translateX(100%)'}))])
  ])
]
})

export class ResultsDetailComponent implements OnInit {
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
  ) {}

  ngOnInit() {
    this.selection.selPerson$.subscribe(person => this.selectedPerson = person);
    this.selection.selTopic$.subscribe(topic => this.selectedTopic = topic);
    this.selection.selMinYear$.subscribe(year => this.selectedMinYear = year);
    this.selection.selMaxYear$.subscribe(year => this.selectedMaxYear = year);
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
    this.selection.setYear(year, year);
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
