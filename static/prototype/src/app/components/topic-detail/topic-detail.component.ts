import {Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges, HostListener} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DomSanitizer } from '@angular/platform-browser';

import * as d3 from 'd3';
import _ from 'lodash';

import {ITopic} from '../../app.interfaces';

import {debounce} from '../../decorators';

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

  public p1Corner = [0, 0];
  public p2Corner = [0, 0];

  constructor(private sanitizer: DomSanitizer) {}

  // Listeners
  @HostListener('window:resize', ['$event'])
  @debounce(250)
  onResize(event) {
    console.log('resize');
    this.width = this.svg.nativeElement.clientWidth;
    this.translate = `translate(${this.width / 2} ${this.height / 2})`;
    this.simulate(this.nodes);
  }

  // Life-cycle hooks
  ngOnInit () {

    this.width = this.svg.nativeElement.clientWidth;
    this.height = window.innerHeight - 288;

    this.translate = `translate(${this.width / 2} ${this.height / 2})`;

    this.simulation = this.getSimulation();

    this.topics.subscribe(values => {
      if (this.nodes == null) { this.nodes = []; }

      const _values = _.cloneDeep(values);

      _values.forEach((group, i) => {
        let yOffset = 0;
        group.forEach(d => {

          d.height = Math.max(d.percentage * 2, 32);
          d.x = i * this.width / 5;
          d.y = yOffset;
          yOffset += d.height;
        });
        yOffset = 0;
      });

      const nodes = _.cloneDeep(_values.reduce(function(a, b) {
        return a.concat(b);
      }, []));

      this.nodes = this.nodes.filter(oldNode =>
        nodes.find(newNode => newNode.id === oldNode.id)
      );

      this.nodes = this.nodes.concat(nodes.filter(newNode =>
        this.nodes.find(oldNode => newNode.id === oldNode.id) == null
      ));

      this.simulate(values);
    });
  }

  ngOnChanges (changes: SimpleChanges) {
  }

  // Methods
  getSimulation() {
    return d3.forceSimulation()
      .force('link', d3.forceLink()
        .id(function (d: ITopic) { return `${d.id}`; })
        .strength(d => {
          return (d as any).value * 0.01;
        })
        // .distance(200)
      )
      .force('charge', d3.forceManyBody()
        .strength(-200)
      );
      // .alphaDecay(0.006883951579);
  }

  simulate(values): void {

    if (this.nodes.length === 0) {
      this.links = [];
      return;
    }

    console.log(this.nodes);

    this.links = this.randomLinks();

    const collisionForce = rectCollide();

    collisionForce.size((d) => {
      return [this.width / 5 + 20, d.height + 20];
    });

    collisionForce.iterations(1);

    collisionForce.strength(1);

    this.simulation
      .nodes(this.nodes)
      .on('tick', () => {this.ticked(); })
      // .force('cf', (a) => this.customForce(a));
      .force('collision', collisionForce)
      .force('center', d3.forceCenter(0, 0));

    this.simulation.force('link').links(this.links);

    this.simulation.alpha(1).restart();
  }

  ticked(): void {
    this.nodes.forEach((n, i) => {
      n.x = Math.max(n.x, (-this.width + this.width / 5) / 2);
      n.x = Math.min(n.x, (this.width - this.width / 5) / 2);

      n.y = Math.max(n.y, (-this.height + n.height) / 2);
      n.y = Math.min(n.y, (this.height - n.height) / 2);

    });

    this.links.filter((d, i) => i >= 0).forEach(link => {
      const p1 = [link.source.x, link.source.y];
      const p2 = [link.target.x, link.target.y];

      const dist = [p2[0] - p1[0], p2[1] - p1[1]];

      const dir = [dist[0] > 0 ? 1 : -1, dist[1] > 0 ? 1 : -1];

      const p1Corner = [link.source.x + (this.width / 10) * dir[0],
        link.source.y + (link.source.height / 2) * dir[1]];

      const p2Corner = [link.target.x + (this.width / 10) * -dir[0],
        link.target.y + (link.target.height / 2) * -dir[1]];

      const cDist = [p2Corner[0] - p1Corner[0], p2Corner[1] - p1Corner[1]];


      let anchor = [];

      if (dir[0] === -1 && dir[1] === -1) {
        if (cDist[0] > cDist[1]) {
          anchor = [0, -1];
        } else {
          anchor = [-1, 0];
        }
      } else if (dir[0] === 1 && dir[1] === -1) {
        if (cDist[0] > -cDist[1]) {
          anchor = [1, 0];
        } else {
          anchor = [0, -1];
        }
      } else if (dir[0] === 1 && dir[1] === 1) {
        if (cDist[0] > cDist[1]) {
          anchor = [1, 0];
        } else {
          anchor = [0, 1];
        }
      } else {
        if (cDist[0] > -cDist[1]) {
          anchor = [0, 1];
        } else {
          anchor = [-1, 0];
        }
      }

      const s = {
        x: link.source.x + (this.width / 10) * anchor[0],
        y: link.source.y + (link.source.height / 2) * anchor[1]
      };

      const t = {
        x: link.target.x + (this.width / 10) * -anchor[0],
        y: link.target.y + (link.target.height / 2) * -anchor[1]
      };

      const offset = {
        x: anchor[0] !== 0 ? (t.x - s.x) * 0.25 : 0,
        y: anchor[0] !== 0 ? 0 : (t.y - s.y) * 0.25,
      };

      link.path = `M ${s.x},${s.y} C${s.x + offset.x},${s.y + offset.y} ${t.x - offset.x},${t.y - offset.y} ${t.x},${t.y}`;
      link.sourceAnchor = s;
      link.targetAnchor = t;
    });
  }

  getTranslate(n) {
    const transform = `translate(${n.x - this.width / 10}px, ${n.y - n.height / 2}px)`;
    return this.sanitizer.bypassSecurityTrustStyle(transform);
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
    if (this.nodes == null) { return; }
    return '.'.repeat(40).split('').map(d => {
      return {
        source: this.nodes[Math.floor(Math.random() * this.nodes.length)].id,
        target: this.nodes[Math.floor(Math.random() * this.nodes.length)].id,
        value: Math.ceil(Math.random() * 4)
      };
    }).filter(d => d.source !== d.target);
  }
}
