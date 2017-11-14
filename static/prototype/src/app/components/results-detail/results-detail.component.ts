import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {ApiService} from '../../services/api.service';

import {IItem} from '../../app.interfaces';
import {DataService} from '../../services/data.service';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'results-detail',
  templateUrl: './results-detail.component.html',
  styleUrls: ['./results-detail.component.scss']
})

export class ResultsDetailComponent implements OnInit {

  @Output() closeDetail: EventEmitter<any> = new EventEmitter();
  @Input() loadingData = false;
  @Input() item: any = null;
  @Input() itemTitle: string = null;

  public items: Observable<IItem[]>;


  constructor() {}

  ngOnInit(): void {
  }

  close () {
    this.closeDetail.emit();
  }
}
