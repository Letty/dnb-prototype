import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {ApiService} from '../../services/api.service';

import {IItem} from '../../app.interfaces';
import {DataService} from '../../services/data.service';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit, OnChanges {

  @Output() close: EventEmitter<any> = new EventEmitter();
  @Input() term: string = null;

  constructor() {}

  ngOnInit(): void {
  }

  ngOnChanges (changes: SimpleChanges) {
  }
}
