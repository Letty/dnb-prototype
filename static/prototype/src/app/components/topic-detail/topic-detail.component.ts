import {Component, Input, OnInit, OnChanges, ViewChild, SimpleChanges, HostListener} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DomSanitizer } from '@angular/platform-browser';
import { SelectionService } from '../../services/selection.service';
import { DataService } from '../../services/data.service';

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
  @Input() forces = false;

  @ViewChild('svg') svg;

  public nodes;
  public links;
  private simulation;
  public width = 0;
  public height = 0;
  public translate = 'translate(0 0)';

  public p1Corner = [0, 0];
  public p2Corner = [0, 0];

  constructor(private sanitizer: DomSanitizer,
              private selection: SelectionService,
              private dataService: DataService) {}

  // Listeners
  @HostListener('window:resize', ['$event'])
  @debounce(250)
  onResize(event) {
    this.width = this.svg.nativeElement.clientWidth;
    this.height = this.svg.nativeElement.clientHeight;
    this.pack(this.nodes.filter(n => n.type !== 'gravity'));
    this.simulate(this.nodes);
  }

  // Life-cycle hooks
  ngOnInit () {
    this.width = this.svg.nativeElement.clientWidth;
    this.height = this.svg.nativeElement.clientHeight;

    this.simulation = this.getSimulation();

    this.topics.subscribe(values => {
      if (this.nodes == null) { this.nodes = []; }

      const _values = _.cloneDeep(values);

      const nodes = _values.reduce(function(a, b) {
        return a.concat(b);
      }, []);

      if (nodes.length === 0) { return; }

      this.pack(nodes);

      this.nodes = this.nodes.filter(oldNode =>
        nodes.find(newNode => {
          if (newNode.id === oldNode.id) {
            oldNode.width = newNode.width;
            oldNode.height = newNode.height;

            if (this.forces === false) {
              oldNode.x = newNode.x;
              oldNode.y = newNode.y;
            }

            return true;
          }
          return false;
        })
      );

      this.nodes = this.nodes.concat(nodes.filter(newNode =>
        this.nodes.find(oldNode => newNode.id === oldNode.id) == null
      ));

      for (let i = 0; i <= 1; i += 0.25) {
        this.nodes.push({
          type: 'gravity',
          x: this.width,
          y: this.height * i,
          fx: this.width,
          fy: this.height * i,
          multiplyer: i,
          width: 0,
          height: 0
        });

        this.nodes.push({
          type: 'gravity',
          x: 0,
          y: this.height * i,
          fx: 0,
          fy: this.height * i,
          multiplyer: i,
          width: 0,
          height: 0
        });
      }

      this.simulate(values);
    });
  }

  onSelect(topic: ITopic): void {
    this.selection.setTopic(topic);
    this.dataService.setFilter();
  }

  ngOnChanges (changes: SimpleChanges) {
    if (changes.forces && !changes.forces.firstChange) {
      window.setTimeout(() => {
        if (changes.forces.currentValue) {
          this.nodes.forEach(n => {
            n.y += ((this.svg.nativeElement.clientHeight + 56) / 2);
          });
          this.height = this.svg.nativeElement.clientHeight;
          this.simulate(this.nodes);
        } else {
          this.simulation.alpha(0);
          this.pack(this.nodes.filter(n => n.type !== 'gravity'));
        }
      }, 0);
    }
    //   if (!changes.years.firstChange) {
    //     this.init = true;
    //   }
    //   this.updatePath();
    // }
  }
  // Methods
  getSimulation() {
    return d3.forceSimulation()
      .force('link', d3.forceLink()
        .id(function (d: ITopic) { return `${d.id}`; })
        .strength(0)
      )
      .force('charge', d3.forceManyBody()
        .strength(d => (d as any).type === 'gravity' ? -200 - Math.random() * 400 : -200));
  }

  simulate(values): void {
    if (this.nodes.length === 0 || this.forces === false) {
      this.links = [];
      return;
    }

    this.nodes.filter(n => n.type === 'gravity').forEach(n => {
      n.fy = this.height * n.multiplyer;
    });

    this.links = this.randomLinks();

    const collisionForce = rectCollide();

    collisionForce.size((d) => {
      return [d.width + 20, d.height + 20];
    });

    collisionForce.iterations(1);

    collisionForce.strength(1);

    this.simulation
      .nodes(this.nodes)
      .on('tick', () => {this.ticked(); })
      .force('collision', collisionForce);

    this.simulation.force('link').links(this.links);
    this.simulation.alpha(1).restart();
  }

  pack(nodes): void {
    if (nodes.length === 0) { return; }

    nodes = _.sortBy(nodes, 'count');

    const height = this.forces ? (this.svg.nativeElement.clientHeight - 56) / 2 : this.svg.nativeElement.clientHeight;
    let remainingWidth = this.width;
    let remainingCount = nodes.map(n => n.count).reduce((a, b) => a + b);
    let packs = [{
      width: 0,
      count: 0,
      nodes: []
    }];

    const minHeight = 32 / height;

    nodes.forEach((node, i) => {
      let pack = packs[packs.length - 1];
      const packCount = pack.count + node.count;

      let hasSpace = true;

      pack.nodes.forEach(pNode => {
        if (pNode.count / packCount < minHeight) {
          hasSpace = false;
        }
      });

      const packWidth = pack.count / remainingCount * remainingWidth;

      if (pack.nodes.length > 1 && packWidth > this.width * 0.15) {
        hasSpace = false;
      }

      if (hasSpace) {
        pack.count = packCount;
        pack.nodes.push(node);
      } else {
        pack.width = packWidth;
        remainingCount -= pack.count;
        remainingWidth -= pack.width;

        packs.push({
          width: 0,
          count: node.count,
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
        n.height = (n.count / p.count * height);
        n.x = xOffset + n.width / 2;
        n.y = yOffset + n.height / 2;

        yOffset += n.height;
      });
      xOffset += p.width;
    });
  }

  ticked(): void {
    if (this.forces === false) {
      this.pack(this.nodes.filter(n => n.type !== 'gravity'));
      return;
    }

    // keep nodes in bounding box
    this.nodes.filter(d => d.type !== 'gravity').forEach((n, i) => {
      n.x = Math.max(n.x, n.width * 0.5);
      n.x = Math.min(n.x, this.width - n.width * 0.5);

      n.y = Math.max(n.y, n.height * 0.5);
      n.y = Math.min(n.y, this.height - n.height * 0.5);
    });

    // calculate link anchors
    this.links.filter((d, i) => i >= 0).forEach(link => {
      const p1 = [link.source.x, link.source.y];
      const p2 = [link.target.x, link.target.y];

      const dist = [p2[0] - p1[0], p2[1] - p1[1]];

      const dir = [dist[0] > 0 ? 1 : -1, dist[1] > 0 ? 1 : -1];

      const p1Corner = [link.source.x + (link.source.width / 2) * dir[0],
        link.source.y + (link.source.height / 2) * dir[1]];

      const p2Corner = [link.target.x + (link.target.width / 2) * -dir[0],
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
        x: link.source.x + (link.source.width / 2 - 2) * anchor[0],
        y: link.source.y + (link.source.height / 2 - 2) * anchor[1]
      };

      const t = {
        x: link.target.x + (link.target.width / 2 - 2) * -anchor[0],
        y: link.target.y + (link.target.height / 2 - 2) * -anchor[1]
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
    const transform = `translate(${n.x - n.width / 2}px, ${n.y - n.height / 2}px)`;
    return this.sanitizer.bypassSecurityTrustStyle(transform);
  }

  randomLinks() {
    if (this.nodes == null) { return; }
    const topics = this.nodes.filter(n => n.type !== 'gravity');
    return _.uniqBy(
      '.'.repeat(20).split('').map(d => {
        return {
          source: topics[Math.floor(Math.random() * (topics.length))].id,
          target: topics[Math.floor(Math.random() * (topics.length))].id,
          value: Math.ceil(Math.random() * 4)
        };
      }).filter(d => d.source !== d.target),
      d => d.source + d.target
    );
  }
}
