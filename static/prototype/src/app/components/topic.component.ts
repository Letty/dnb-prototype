import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../services/api.service';
import { SelectionService } from '../services/selection.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from '../services/data.service';
import { RouterService } from '../services/router.service';
import * as d3 from 'd3';

import { ITopic } from '../app.interfaces';

@Component({
  selector: 'topic',
  templateUrl: './topic.component.html'
})

export class TopicComponent implements OnInit {

  public detail = false;
  public show = true;
  public loadingData = true;
  public topics: Observable<ITopic[]>;
  private topicTree = {
    'keyword': 'tree',
    'children': []
  };

  constructor(
    private api: ApiService,
    private selection: SelectionService,
    private sanitizer: DomSanitizer,
    private dataService: DataService,
    private routerService: RouterService
  ) {
    api.loadingData$.subscribe((e) => {
      if (e === 'topic') { this.loadingData = true; }
    });
  }

  ngOnInit(): void {
    this.topics = this.dataService.topics;
    this.dataService.topics.subscribe(value => {
      this.loadingData = false;
      // let counts: Array<number> = value.map(p => p.count);
      // this.fontScale.domain([Math.min(...counts), Math.max(...counts)]);
    });

    this.routerService.view.subscribe(view => {
      this.show = view !== 'person';
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
