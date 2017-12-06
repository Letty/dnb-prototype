import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../services/api.service';
import { SelectionService } from '../services/selection.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from '../services/data.service';
import { RouterService } from '../services/router.service';

import { ITopic } from '../app.interfaces';

import {formatNum} from '../services/formatting';

@Component({
  selector: 'topic',
  templateUrl: './topic.component.html'
})

export class TopicComponent implements OnInit {

  public detail = false;
  public show = true;
  public topics: Observable<ITopic[]>;
  public loadingData = true;

  constructor(
    private api: ApiService,
    private selection: SelectionService,
    private sanitizer: DomSanitizer,
    private dataService: DataService,
    private routerService: RouterService
  ) {
    dataService.loadingData$.subscribe((e) => {
      if (e === 'data') { this.loadingData = true; }
    });
  }

  ngOnInit(): void {
    this.topics = this.dataService.topics;
    this.dataService.topics.subscribe(value => {
      this.loadingData = false;
    });

    this.routerService.view.subscribe(view => {
      this.detail = view === 'topic';
    });
  }

  onSelect(topic: ITopic): void {
    this.selection.setTopic(topic);
    this.dataService.setFilter();
  }

  setTopicHeight(count: number): string {
    let style: any;
    style = this.sanitizer.bypassSecurityTrustStyle('height: ' + count + '%');
    return style;
  }
}
