import {Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges, HostListener} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import * as d3 from 'd3';
import _ from 'lodash';

import {ITopic} from '../../app.interfaces';

import { debounce } from '../../decorators';

import rectCollide from './forceforce';

@Component({
  selector: 'topic-detail',
  templateUrl: './topic-detail.component.html',
  styleUrls: ['./topic-detail.component.scss']
})

export class TopicDetailComponent implements OnInit, OnChanges {
  @Input() topics: Observable<ITopic[]>;

  @ViewChild('svg') svg;

  public nodes;
  public links;
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

      nodes.forEach(n => {
        n.height = Math.max(n.percentage * 2, 20);
      });

      this.nodes = this.nodes.filter(oldNode =>
        nodes.find(newNode => newNode.id === oldNode.id)
      );

      this.nodes = this.nodes.concat(nodes.filter(newNode =>
        this.nodes.find(oldNode => newNode.id === oldNode.id) == null
      ));

      this.links = this.randomLinks();

      const collisionForce = rectCollide()
        .size((d) => {
            return [this.width / 5 + 20, d.height + 20];
        });
        // .iterations(12);

      this.simulation
        .nodes(this.nodes)
        .on('tick', () => {this.ticked(); })
        // .force('cf', (a) => this.customForce(a));
        .force('collision', collisionForce)
        .force('center', d3.forceCenter(0, 0));

      this.simulation.force('link').links(this.links);

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
        .strength(0.05)
        .distance(200)
      )
      .force('charge', d3.forceManyBody()
        .strength(-200)
      )
      .alphaDecay(0.006883951579);
  }

  ticked(): void {
    console.log(this.links[0]);
    this.nodes.forEach((n, i) => {
      n.x = Math.max(n.x, (-this.width + this.width / 5) / 2);
      n.x = Math.min(n.x, (this.width - this.width / 5) / 2);

      n.y = Math.max(n.y, (-this.height + n.height) / 2);
      n.y = Math.min(n.y, (this.height - n.height) / 2);

    });
  }

  getTranslate(x, y): string {
    return `translate(${x} ${y})`;
  }

  customForce(alpha): void {
    this.nodes.forEach((n, i) => {
      const hw = this.width / 2;
      const hh = this.height / 2;
      if ((n.x < -hw && n.vx < 0) || (n.x > hw && n.vx > 0)) {
        n.vx *= -1;
      }

      if ((n.y < -hh && n.vy < 0) || (n.y > hh && n.vy > 0)) {
        n.vy *= -1;
      }
    });
  }

  randomLinks() {
    return '.'.repeat(40).split('').map(d => {
      return {
        source: this.nodes[Math.floor(Math.random() * this.nodes.length)].id,
        target: this.nodes[Math.floor(Math.random() * this.nodes.length)].id
      };
    });
  }
}
