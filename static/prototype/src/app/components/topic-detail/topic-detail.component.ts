import {Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges, HostListener} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import * as d3 from 'd3';
import _ from 'lodash';

import {ITopic} from '../../app.interfaces';

import { debounce } from '../../decorators';

@Component({
  selector: 'topic-detail',
  templateUrl: './topic-detail.component.html',
  styleUrls: ['./topic-detail.component.scss']
})

export class TopicDetailComponent implements OnInit, OnChanges {
  @Input() topics: Observable<ITopic[]>;

  @ViewChild('svg') svg;

  public nodes;
  private simulation;
  public width = 0;
  public height = 0;
  public translate = 'translate(0 0)';

  constructor() {}

  // Listeners
  @HostListener('window:resize', ['$event'])
  @debounce(250)
  onResize(event) {
  }

  // Life-cycle hooks
  ngOnInit () {
    this.width = this.svg.nativeElement.clientWidth;
    this.height = window.innerHeight - 288;

    this.translate = `translate(${this.width / 2} ${this.height / 2})`;

    this.simulation = this.getSimulation();

    this.topics.subscribe(value => {
      if (this.nodes == null) { this.nodes = []; }
      const nodes = _.cloneDeep(value.reduce(function(a, b) {
        return a.concat(b);
      }, []));

      this.nodes = this.nodes.filter(oldNode =>
        nodes.find(newNode => newNode.id === oldNode.id)
      );

      this.nodes = this.nodes.concat(nodes.filter(newNode =>
        this.nodes.find(oldNode => newNode.id === oldNode.id) == null
      ));

      this.simulation
        .nodes(this.nodes)
        .on('tick', this.ticked)
        .force('center', d3.forceCenter(0, 0));

      this.simulation.force('link').links([]);

      this.simulation.alpha(1).restart();
    });
  }

  ngOnChanges (changes: SimpleChanges) {
  }

  // Methods
  getSimulation() {
    return d3.forceSimulation()
      .force('link', d3.forceLink()
        .id(function (d: ITopic) { return `${d.id}`; })
        .strength(1)
        .distance(20)
      )
      .force('charge', d3.forceManyBody()
        .strength(-20)
      );
  }

  ticked(): void {
  }

  getTranslate(x, y): string {
    return `translate(${x} ${y})`;
  }
}
