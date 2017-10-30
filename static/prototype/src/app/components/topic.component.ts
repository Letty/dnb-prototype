import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../services/api.service';
import { SelectionService } from '../services/selection.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from '../services/data.service';
import * as d3 from 'd3';

import { ITopic } from '../app.interfaces';

@Component({
  selector: 'topic',
  templateUrl: './topic.component.html'
})

export class TopicComponent implements OnInit {

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
    private dataService: DataService
  ) {
    dataService.loadingData$.subscribe(() => this.loadingData = true);
  }

  ngOnInit(): void {
    this.topics = this.dataService.topics;
    this.dataService.topics.subscribe(
      value => {
        console.log('value::::', value);
        this.loadingData = false;
        // let counts: Array<number> = value.map(p => p.count);
        // this.fontScale.domain([Math.min(...counts), Math.max(...counts)]);
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

  // showTreemap(): void {
  //   let width = 961,
  //     height = 1061,
  //     ratio = 4;
  //
  //   let treemap = d3.treemap()
  //     .tile(d3.treemapSquarify.ratio(1))
  //     .size([width / ratio, height]);
  //
  //   let root = d3.hierarchy(this.topicTree)
  //     // .eachBefore(function(d) { d.data.id = (d.parent ? d.parent.data.id + '.' : ') + d.data.keyword; })
  //     .sum(sumBySize)
  //     .sort(function(a, b) { return b.height - a.height || b.value - a.value; });
  //
  //   treemap(root);
  //   console.log(root.leaves());
  //
  //   d3.select('body')
  //     .selectAll('.node')
  //     .data(root.leaves())
  //     // .data(this.topicTree.children)
  //     .enter().append('div')
  //     .attr('class', 'node')
  //     .attr('title', function (d) {
  //       console.log(d);
  //       return d.data.keyword + '\n' + d.value;
  //     })
  //     .style('left', function (d) {
  //       return Math.round(d.x0 * ratio) + 'px';
  //     })
  //     .style('top', function (d) {
  //       return Math.round(d.y0) + 'px';
  //     })
  //     .style('width', function (d) {
  //       return Math.round(d.x1 * ratio) - Math.round(d.x0 * ratio) - 1 + 'px';
  //     })
  //     .style('height', function (d) {
  //       return Math.round(d.y1) - Math.round(d.y0) - 1 + 'px';
  //     })
  //     .append('div')
  //     .attr('class', 'node-label')
  //     .text(function (d) {
  //       return d.data.keyword;
  //     });
  //
  //   function sumBySize(d) {
  //     return d.count;
  //   }
  // }
}
