import {Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges, HostListener} from '@angular/core';
import * as d3 from 'd3';

import {ITopic} from '../../app.interfaces';

import { debounce } from '../../decorators';

@Component({
  selector: 'topic-detail',
  templateUrl: './topic-detail.component.html',
  styleUrls: ['./topic-detail.component.scss']
})

export class TopicDetailComponent implements OnInit, OnChanges {
  @Input() topics: ITopic[] = [];

  @ViewChild('svg') svg;

  constructor() {}

  // Listeners
  @HostListener('window:resize', ['$event'])
  @debounce(250)
  onResize(event) {
  }

  // Life-cycle hooks
  ngOnInit () {
    console.log(this.topics);
  }

  ngOnChanges (changes: SimpleChanges) {
  }

  // Methods
}
