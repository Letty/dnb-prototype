import {Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges, HostListener} from '@angular/core';
import * as d3 from 'd3';
import {formatNum} from '../../services/formatting';
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

  @Input() minYear = 1000;
  @Input() maxYear = new Date().getFullYear();

  @ViewChild('svgWrapper') svg;
  @ViewChild('brush') brushContainer;
  @ViewChild('rulerLabel') rulerLabel;

  public path: string;
  public xTicks = [];
  public yTicks = [];
  public width = 0;
  public ruler;
  public rulerOffset = 'translate(0 3)';
  public init = true;
  private xTickValues = [1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000];
  private yTickValues = [100000, 200000, 300000, 400000];
  private brush = d3.brushX();
  private xScale;
  private yScale;

  private breakRecursion = false;

  private selMin: number = null;
  private selMax: number = null;

  constructor(
    private selection: SelectionService,
    private dataService: DataService) {
      selection.selMinYear$.subscribe(
        year => {
          this.selMin = year;
          this.updateBrush();
        }
      );
      selection.selMaxYear$.subscribe(
        year => {
          this.selMax = year;
          this.updateBrush();
        }
      );
    }

  // Listeners
  @HostListener('window:resize', ['$event'])
  // @debounce(250)
  onResize(event) {
    this.width = this.svg.nativeElement.clientWidth;
    this.brush.extent([[0, 0], [this.width, this.height]]);
    this.updatePath();
    console.log(this.width);
    this.updateBrush();
  }

  // Life-cycle hooks
  ngOnInit () {
    this.width = this.svg.nativeElement.clientWidth;

    if (this.enableBrush) {
      this.brush
        .extent([[0, 0], [this.width, this.height]])
        .on('brush end', (e) => {
          const sel = d3.event.selection;
          if (d3.event.type === 'end' && sel) {
            if (this.breakRecursion) {
              this.breakRecursion = false;
              return;
            }
            this.selMin = Math.round(this.xScale.invert(sel[0]));
            this.selMax = Math.round(this.xScale.invert(sel[1]));
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
    this.updatePath();
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
    // const selection = this.selection.getSelection();
    const maxY = _.maxBy(this.years, 'count');

    this.xScale = this.logXScale ?
      d3.scalePow().exponent(3) : d3.scaleLinear();

    this.xScale.rangeRound([0, this.width])
      .domain([this.minYear, this.maxYear]);

    const areaHeight = this.showXTicks ? this.height - 16 : this.height;

    this.yScale = d3.scalePow()
      .exponent(0.3)
      .rangeRound([areaHeight, 8])
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
        value: formatNum(d),
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
    this.updateRuler(Math.round(this.xScale.invert(e.clientX - this.svg.nativeElement.getBoundingClientRect().left)));
  }

  resetYear() {
    const years = this.years.filter(y => {
      return y.year <= this.maxYear && y.year >= this.minYear;
    });
    if (years != null && years.length) {
      this.updateRuler(_.maxBy(years, 'count').year);
    } else {
      this.updateRuler(this.maxYear);
    }
  }

  updateRuler (fullyear) {
    if (!this.showRuler) { return; }

    const year = this.years.find(y => y.year === fullyear);
    const x = this.xScale(year ? year.year : fullyear);

    this.ruler = year ? {
      count: formatNum(year.count),
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
      this.rulerOffset = `translate(${offset}, 3)`;
    }, 0);
  }

  updateBrush (): void {
    if (this.enableBrush && this.selMin != null && this.selMax != null) {
      this.breakRecursion = true;
      this.brush.move(d3.select(this.brushContainer.nativeElement), [this.xScale(this.selMin), this.xScale(this.selMax)]);
    } else if (this.enableBrush) {
      this.brush.move(d3.select(this.brushContainer.nativeElement), null);
    }
  }
}
