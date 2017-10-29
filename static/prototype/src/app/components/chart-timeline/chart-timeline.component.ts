import {Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges, HostListener} from '@angular/core';
import * as d3 from 'd3';
import _ from 'lodash';

import {SelectionService} from '../../services/selection.service';
import {DataService} from '../../services/data.service';

import {IYear} from '../../app.interfaces';

import {Observable} from 'rxjs/Observable';

import { debounce } from '../../decorators';

@Component({
  selector: 'chart-timeline',
  templateUrl: './chart-timeline.component.html',
  styleUrls: ['./chart-timeline.component.scss']
})

export class ChartTimelineComponent implements OnInit, OnChanges {
  @Input() years: IYear[] = [];
  @Input() showXTicks = false;
  @Input() showYTicks = false;
  @Input() showRuler = false;
  @Input() interactiveRuler = false;
  @Input() enableBrush = false;
  @Input() logXScale = false;
  @Input() height = 160;

  @ViewChild('svg') svg;
  @ViewChild('brush') brushContainer;
  @ViewChild('rulerLabel') rulerLabel;

  public path: string;
  public xTicks = [];
  public yTicks = [];
  public width = 0;
  public ruler;
  public rulerOffset = 'translate(0 -8)';
  public init = false;

  private minYear = 1000;
  private maxYear = new Date().getFullYear();
  private xTickValues = [1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000];
  private yTickValues = [100000, 200000, 300000, 400000];
  private brush = d3.brushX();
  private xScale;
  private yScale;

  constructor(
    private selection: SelectionService,
    private dataService: DataService) {}

  // Listeners
  @HostListener('window:resize', ['$event'])
  @debounce(250)
  onResize(event) {
    this.width = this.svg.nativeElement.clientWidth;
    this.brush.extent([[0, 0], [this.width, this.height]]);
    this.updatePath();
  }

  // Life-cycle hooks
  ngOnInit () {
    this.width = this.svg.nativeElement.clientWidth;

    if (this.enableBrush) {
      this.brush
        .extent([[0, 0], [this.width, this.height]])
        .on('brush end', () => {
          const sel = d3.event.selection;
          if (d3.event.type === 'end' && sel && (sel[0] !== 0 && sel[1] !== this.width)) {
            this.selection.setYear(
              Math.round(this.xScale.invert(sel[0])),
              Math.round(this.xScale.invert(sel[1]))
            );
            this.dataService.setFilter();
          }
      });

      d3.select(this.brushContainer.nativeElement)
        .call(this.brush)
        .call(this.brush.move, this.xScale.range());

      d3.select('.brush .handle')
        .style('display', 'none');
    }
  }

  ngOnChanges (changes: SimpleChanges) {
    if (changes.years) {
      if (!changes.years.firstChange) {
        this.init = true;
      }
      this.updatePath();
    }
  }

  // Methods
  updatePath(): void {
    const selection = this.selection.getSelection();
    const maxY = _.maxBy(this.years, 'count');

    this.xScale = this.logXScale ?
      d3.scalePow().exponent(3) : d3.scaleLinear();

    this.xScale.rangeRound([0, this.width])
      .domain([this.minYear, this.maxYear]);

    const areaHeight = this.showXTicks ? this.height - 16 : this.height;

    this.yScale = d3.scalePow()
      .exponent(0.3)
      .rangeRound([areaHeight, 16])
      .domain([0, maxY ? maxY.count : 0]);

    const area = d3.area<IYear>()
      .x(d => this.xScale(d.year))
      .y0(areaHeight)
      .y1(d => this.yScale(d.count));

    this.path = area(this.addMissingYears(this.years));

    this.xTicks = this.showXTicks ? this.xTickValues.map(d => {
      return {
        year: d,
        x: this.xScale(d)
      };
    }) : [];
    this.yTicks = this.showYTicks ? this.yTickValues.map(d => {
      return {
        value: d3.format(',')(d),
        transform: `translate(0 ${isNaN(this.yScale(d)) ? 0 : this.yScale(d)})`
      };
    }) : [];

    if (maxY != null) {
      this.resetYear();
    }
  }

  addMissingYears(years: IYear[]): IYear[] {
    const minYear = Math.min(...years.map(y => y.year)) - 1;
    const maxYear = Math.max(...years.map(y => y.year)) + 1;

    const allYears: IYear[] = [];
    for (let i = minYear; i <= maxYear; i++) {
      const year = years.find(y => y.year === i);
      if (i >= this.minYear && i <= this.maxYear) {
        allYears.push(year ? year : {count: 0, year: i});
      }
    }
    return allYears;
  }

  setYear(e): void {
    if (!this.interactiveRuler) { return; }
    this.updateRuler(Math.round(this.xScale.invert(e.offsetX)));
  }

  resetYear() {
    const years = this.years.filter(y => {
      return y.year <= this.maxYear && y.year >= this.minYear;
    });
    this.updateRuler(_.maxBy(years, 'count').year);
  }

  updateRuler (fullyear) {
    if (!this.showRuler) { return; }

    const year = this.years.find(y => y.year === fullyear);
    const x = this.xScale(year ? year.year : fullyear);

    this.ruler = year ? {
      count: d3.format(',')(year.count),
      transform: `translate(${x}, ${this.yScale(year.count)})`
    } : {
      count: 0,
      transform: `translate(${this.xScale(fullyear)}, ${this.yScale(0)})`
    };

    setTimeout(() => {
      const elWidth = this.rulerLabel.nativeElement.getBBox().width;
      let offset = 0;
      if (x + elWidth / 2 > this.width - 2) {
        offset = this.width - 2 - (x + elWidth / 2);
      } else if (x - elWidth / 2 < 2) {
        offset = 2 - (x - elWidth / 2);
      }
      this.rulerOffset = `translate(${offset}, -8)`;
    }, 0);
  }
}
