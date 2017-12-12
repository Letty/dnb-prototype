import {Component, OnInit, ViewChild, HostListener} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

import {formatNum, formatTitleResult} from '../../services/formatting';
import {debounce} from '../../decorators';

import {ITopic, INetworkLink} from '../../app.interfaces';
import {SelectionService} from '../../services/selection.service';
import {DataService} from '../../services/data.service';
import {ApiService} from '../../services/api.service';
import {RouterService} from '../../services/router.service';

import * as d3 from 'd3';
import _ from 'lodash';
import rectCollide from './forceforce';

@Component({
  selector: 'topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})

export class TopicsComponent implements OnInit {
  @ViewChild('svgWrapper') svg;

  public nodes = [];
  public links = [];
  public tags = [];
  public selectedTag = null;
  private upcomingTopics = [];
  private upcomingLinks = [];
  public collapsed = false;
  public detail = false;

  private simulation;
  public width = 0;
  public height = 0;
  public translate = 'translate(0 0)';

  public p1Corner = [0, 0];
  public p2Corner = [0, 0];

  private loadingTopic = false;
  private loadingLinks = false;
  public loadingData = true;

  public selectedTopic: ITopic = null;

  constructor(
    private sanitizer: DomSanitizer,
    private selection: SelectionService,
    private dataService: DataService,
    private api: ApiService,
    private routerService: RouterService
  ) {
    this.simulation = d3.forceSimulation()
      .force('link', d3.forceLink()
        .id((d: ITopic) => String(d.id))
        .strength(0))
      .force('charge', d3.forceManyBody()
        .strength(d => (d as any).type === 'gravity' ? -500 : -200))
      .force('collision', rectCollide()
        .size(d => [d.width + 20, d.height + 20])
        .iterations(1)
        .strength(1))
      .on('tick', () => this.ticked());
  }

  // Listeners
  @HostListener('window:resize', ['$event'])
  @debounce(250)
  onResize(event) {
    this.width = this.svg.nativeElement.clientWidth;
    this.height = (window.innerHeight - 248) * (this.detail ? 1 : 0.5) - 32;
    this.update();
    this.simulate();
  }

  // Life-cycle hooks
  ngOnInit () {
    this.width = this.svg.nativeElement.clientWidth;
    this.height = (window.innerHeight - 248) * (this.detail ? 1 : 0.5) - 32;

    this.dataService.loadingData$.subscribe((e) => {
      if (e === 'data') this.loadingTopic = this.loadingData = true;
      if (e === 'links') this.loadingLinks = true;
    });

    this.selection.selTopic$.subscribe(topic => {
      this.selectedTopic = topic;
      this.selectedTag = this.selectedTopic != null ? {label: this.selectedTopic.keyword, tag: this.selectedTopic} : null;
    });

    this.dataService.topics.subscribe(values => {
        this.loadingTopic = false;
        this.upcomingTopics = values;
        this.tags = values.map(tag => {
          return {label: tag.keyword, tag};
        }).filter(tag => this.selectedTopic == null || tag.tag.id !== this.selectedTopic.id);
        this.selectedTag = this.selectedTopic != null ? {label: this.selectedTopic.keyword, tag: this.selectedTopic} : null;
        this.update();
    });

    this.routerService.topic.subscribe(size => {
      this.collapsed = size === 0;
      this.detail = size === 2;
    });

    this.routerService.view.subscribe(view => {
      this.detail = view === 'topic';
      this.height = (window.innerHeight - 248) * (this.detail ? 1 : 0.5) - 32;
      if (this.detail && !this.loadingLinks) this.simulate();
      else if (this.detail) this.links = [];
      else {
        this.simulation.alpha(0);
        this.pack(this.nodes.filter(n => n.type !== 'gravity'));
      }
    });

    this.dataService.networkLinks.subscribe(values => {
      this.loadingLinks = false;
      this.upcomingLinks = values;
      this.simulate();
    });
  }

  update(): void {
    if (this.loadingTopic) return;
    if (this.detail === false) this.loadingData = false;

    const nodes = this.upcomingTopics;

    // calc layout
    this.pack(nodes);

    // keep exsiting nodes
    this.nodes = this.nodes.filter(oldNode =>
      nodes.find(newNode => {
        if (newNode.id === oldNode.id) {
          oldNode.width = newNode.width;
          oldNode.height = newNode.height;
          oldNode.count = newNode.count;
          oldNode.fontSize = newNode.fontSize;

          if (this.detail === false) {
            oldNode.x = newNode.x;
            oldNode.y = newNode.y;
          }
          return true;
        }
        return false;
      })
    );

    // concat new nodes
    this.nodes = this.nodes.concat(nodes.filter(newNode =>
      this.nodes.find(oldNode => newNode.id === oldNode.id) == null
    ));

    // add helpers for improved force-layout
    for (let i = 0; i <= 1; i += 0.25) {
      this.nodes.push({
        type: 'gravity',
        fx: 0,
        fy: this.height * i,
        multiplyer: i,
        width: 0,
        height: 0
      });
      this.nodes.push({
        type: 'gravity',
        fx: this.width,
        fy: this.height * i,
        multiplyer: i,
        width: 0,
        height: 0
      });
    }
  }

  // Methods
  simulate(): void {
    if (this.nodes.length === 0 || this.detail === false) {
      this.links = [];
      return;
    }
    this.loadingData = false;

    const max = Math.max(...this.upcomingLinks.map(l => l.strength));
    const links = this.upcomingLinks.filter(d => d.strength >= max / 16);
    const min = Math.min(...links.map(l => l.strength));
    const scale = d3.scaleLinear().domain([min, max]).range([0.25, 4]);

    this.links = links.map(d => {
      return {
        source: d.source,
        target: d.target,
        value: scale(d.strength)
      };
    });

    // update y-position from gravity helpers
    this.nodes.filter(n => n.type === 'gravity').forEach(n => {
      n.fy = this.height * n.multiplyer;
    });

    // update nodes
    this.simulation.nodes(this.nodes);
    // update links
    this.simulation.force('link').links(this.links);
    // restart simulation
    this.simulation.alpha(1).restart();
  }

  pack(nodes): void {
    if (nodes.length === 0) return;

    nodes = _.sortBy(nodes, 'count');

    const maxCount = nodes.length >= 2 ? nodes[nodes.length - 2].count * 2 : Infinity;
    const height = (window.innerHeight - 248) * 0.5 - 32;
    const minHeight = 32 / height;

    let remainingWidth = this.width;
    let remainingCount = nodes.map(n => n.count).reduce((a, b) => a + Math.min(b, maxCount));
    let packs = [{
      width: 0,
      count: 0,
      nodes: []
    }];

    nodes.forEach((node, i) => {
      let pack = packs[packs.length - 1];
      const packCount = pack.count + Math.min(maxCount, node.count);
      const packWidth = pack.count / remainingCount * remainingWidth;

      const hasSpace = pack.nodes.find(pNode => Math.min(maxCount, pNode.count) / packCount < minHeight) == null
        && !(pack.nodes.length > 1 && packWidth > this.width * 0.15);

      if (hasSpace) {
        pack.count = packCount;
        pack.nodes.push(node);
      } else {
        pack.width = Math.max(packWidth, 64);
        remainingCount -= pack.count;
        remainingWidth -= pack.width;

        packs.push({
          width: 0,
          count: Math.min(maxCount, node.count),
          nodes: [node]
        });
      }

      if (i >= nodes.length - 1) {
        pack = packs[packs.length - 1];
        pack.width = pack.count / remainingCount * remainingWidth;
      }
    });

    packs = _.orderBy(packs, p => -p.width / p.nodes.length);
    const packsA = packs.filter((d, i) => i % 2 === 0).reverse();
    const packsB = packs.filter((d, i) => i % 2 === 1);
    packs = packsA.concat(packsB);

    let xOffset = 0;
    packs.forEach(p => {
      let yOffset = 0;
      p.nodes.forEach(n => {
        n.width = p.width;
        n.height = (Math.min(maxCount, n.count) / p.count * height);
        n.x = xOffset + n.width / 2;
        n.y = yOffset + n.height / 2;

        n.fontSize =
          n.width >= 200 && n.height >= 64 ? 18 :
          n.width >= 128 && n.height >= 48 ? 14 : 12;

        yOffset += (Math.min(maxCount, n.count) / p.count * this.height);
      });
      xOffset += p.width;
    });
  }

  ticked(): void {
    if (this.detail === false) {
      this.pack(this.nodes.filter(n => n.type !== 'gravity'));
      return;
    }

    this.constrainNodesToBBox();
    this.links.filter((d, i) => i >= 0).forEach(link => {
      link.path = this.linkPathProperties(link);
    });
  }

  constrainNodesToBBox(): void {
    this.nodes.filter(d => d.type !== 'gravity').forEach((n, i) => {
      n.x = this.constrain(n.x, n.width * 0.5, this.width - n.width * 0.5);
      n.y = this.constrain(n.y, n.height * 0.5, this.height - n.height * 0.5);
    });
  }

  constrain (value: number, min: number, max: number): number {
    return Math.min(Math.max(min, value), max);
  }

  linkPathProperties (link: any): {
    source: {x: number, y: number},
    target: {x: number, y: number},
    d: string
  } {
    const {source, target} = link;

    const dir = {
      x: target.x - source.x > 0 ? 'right' : 'left',
      y: target.y - source.y > 0 ? 'up' : 'down'
    };

    const closestVertices = [{
      x: dir.x === 'right' ? source.x + (source.width / 2) : source.x - (source.width / 2),
      y: dir.y === 'up' ? source.y + (source.height / 2) : source.y - (source.height / 2)
    }, {
      x: dir.x === 'right' ? target.x - (target.width / 2) : target.x + (target.width / 2),
      y: dir.y === 'up' ? target.y - (target.height / 2) : target.y + (target.height / 2)
    }];

    const vector = [closestVertices[1].x - closestVertices[0].x, closestVertices[1].y - closestVertices[0].y];

    let multiply;
    if (dir.x === 'right') {
      if (dir.y === 'up') multiply = (vector[0] > vector[1]) ? {x: 1, y: 0} : {x: 0, y: 1};
      else multiply = (vector[0] > -vector[1]) ? {x: 1, y: 0} : {x: 0, y: -1};
    } else {
      if (dir.y === 'up') multiply = (vector[0] > -vector[1]) ? {x: 0, y: 1} : {x: -1, y: 0};
      else multiply = (vector[0] > vector[1]) ? {x: 0, y: -1} : {x: -1, y: 0};
    }

    const s = {
      x: link.source.x + (link.source.width / 2 - 2) * multiply.x,
      y: link.source.y + (link.source.height / 2 - 2) * multiply.y
    };
    const t = {
      x: link.target.x + (link.target.width / 2 - 2) * -multiply.x,
      y: link.target.y + (link.target.height / 2 - 2) * -multiply.y
    };
    const offset = {
      x: multiply.x !== 0 ? (t.x - s.x) * 0.25 : 0,
      y: multiply.x !== 0 ? 0 : (t.y - s.y) * 0.25,
    };

    return {
      source: {x: s.x, y: s.y},
      target: {x: t.x, y: t.y},
      d: `M ${s.x},${s.y} C${s.x + offset.x},${s.y + offset.y} ${t.x - offset.x},${t.y - offset.y} ${t.x},${t.y}`
    };
  }

  nodeLinkMismatch (): boolean {
    const mismatch = this.upcomingLinks.find(l => {
      return this.upcomingTopics.find(t => t.id === l.source) == null ||
        this.upcomingTopics.find(t => t.id === l.target) == null;
    });
    return mismatch == null;
  }

  getTranslate(n) {
    const transform = `translate(${n.x - n.width / 2}px, ${n.y - n.height / 2}px)`;
    return this.sanitizer.bypassSecurityTrustStyle(transform);
  }

  setTopic(topic: ITopic): void {
    this.selection.setTopic(topic);
    this.dataService.setFilter();
  }

  _formatNum (value) {
    return formatNum(value);
  }

  _formatTitleResult (topic, subject, value) {
    return formatTitleResult(topic, subject, value);
  }
}
