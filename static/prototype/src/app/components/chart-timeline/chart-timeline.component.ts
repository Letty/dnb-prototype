import {Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges, HostListener} from '@angular/core';
import * as d3 from 'd3';
import {formatNum} from '../../services/formatting';
import _ from 'lodash';

import {SelectionService} from '../../services/selection.service';
import {DataService} from '../../services/data.service';
import {ApiService} from '../../services/api.service';

import {IYear} from '../../app.interfaces';

import {Observable} from 'rxjs/Observable';

import { debounce } from '../../decorators';

@Component({
  selector: 'chart-timeline',
  templateUrl: './chart-timeline.component.html',
  styleUrls: ['./chart-timeline.component.scss']
})

export class ChartTimelineComponent implements OnInit, OnChanges {
  @Input() showXTicks = false;
  @Input() showYTicks = true;
  @Input() showRuler = false;
  @Input() interactiveRuler = false;
  @Input() enableBrush = false;
  @Input() logXScale = false;
  @Input() height = 64;

  @Input() minYear = 1000;
  @Input() maxYear = 2018;

  @ViewChild('svgWrapper') svg;
  @ViewChild('brush') brushContainer;
  @ViewChild('rulerLabel') rulerLabel;

  public path: string;
  public pathFromSelection: string;
  public xTicks = [];
  public yTicks = [];
  public brushTicks = [];
  public width = 0;
  public ruler;
  public label: string = null;
  public rulerOffset = 'translate(0 -6)';
  public init = true;
  public years: IYear[] = [];

  private xTickValues = [1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000];
  private yTickValues = [1, 2];
  private brush = d3.brushX();
  private xScale;
  private yScale;
  private _years: Observable<IYear[]>;

  public loadingData = true;

  private breakRecursion = false;

  private selMin: number = null;
  private selMax: number = null;

  public brushStart = 0;

  constructor(
    private api: ApiService,
    private selection: SelectionService,
    private dataService: DataService) {
      selection.selMinYear$.subscribe(
        year => {
          console.log(year);
          this.selMin = year;
          this.updateBrush();
        }
      );
      selection.selMaxYear$.subscribe(
        year => {
          console.log(year);
          this.selMax = year;
          this.updateBrush();
        }
      );
      dataService.loadingData$.subscribe((e) => {
        if (e === 'data') { this.loadingData = true; }
      });
      dataService.years.subscribe(value => {
        this.loadingData = false;
        this.years = value;
        this.updatePath();
      });
    }

  // Listeners
  @HostListener('window:resize', ['$event'])
  @debounce(250)
  onResize(event) {
    this.width = this.svg.nativeElement.clientWidth;
    this.brush.extent([[0, 0], [this.width, this.height]]);
    this.updatePath();
    this.updateBrush();
  }

  // Life-cycle hooks
  ngOnInit () {
    this.width = this.svg.nativeElement.clientWidth;

    // this.xScale.rangeRound([0, this.width])
    //   .domain([this.minYear, this.maxYear]);

    if (this.enableBrush) {
      this.brush
        .extent([[0, 0], [this.width, this.height]])
        .on('brush end', () => {
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
          this.updatePath();
        });

      d3.select(this.brushContainer.nativeElement)
        .call(this.brush)
        .selectAll('.overlay')
          .on('mousedown', () => {
            this.brushStart = this.offsetX(d3.event.clientX);
          })
          .on('mouseup', () => {
            if (this.offsetX(d3.event.clientX) !== this.brushStart) return;
            this.selection.setYear(
              Math.round(this.xScale.invert(this.brushStart)),
              Math.round(this.xScale.invert(this.brushStart))
            );
            this.dataService.setFilter();
          });

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
    this.label = this.selMin && this.selMax ? this.selMin === this.selMax ? `${this.selMin}` : `${this.selMin}-${this.selMax}` : null;
    // const selection = this.selection.getSelection();
    const maxY = _.maxBy(this.years, 'count');

    this.xScale = this.logXScale ?
      d3.scalePow().exponent(3) : d3.scaleLinear();

    this.xScale.rangeRound([0, this.width])
      .domain([this.minYear, this.maxYear]);

    const areaHeight = this.height - 19;

    this.yScale = d3.scalePow()
      .exponent(0.3)
      .rangeRound([areaHeight, 18])
      .domain([0, maxY ? maxY.count : 0]);

    const minHeight = 2;

    const area = d3.area<IYear>()
      .x(d => this.xScale(d.year))
      .y0(areaHeight)
      .y1(d => {
        const height = this.yScale(d.count);
        if (height > areaHeight - minHeight && d.count > 0) return areaHeight - minHeight;
        return height;
      });

    this.path = area(this.addMissingYears(this.years, this.minYear, this.maxYear));
    this.pathFromSelection = (this.selMin != null && this.selMax != null) ?
      area(this.addMissingYears(this.years, this.selMin, this.selMax)) : this.path;

    this.xTicks = this.showXTicks ? this.xTickValues.map(d => {
      return {
        year: d,
        x: this.xScale(d)
      };
    }) : [];

    this.brushTicks = (this.selMin != null && this.selMax != null) ?
    [{
      x: this.xScale(this.selMin),
      year: this.selMin
    }, {
      x: this.xScale(this.selMax),
      year: this.selMax
    }] : [];

    const yTickScale = d3.scalePow()
      .exponent(0.3)
      .rangeRound([areaHeight, 18])
      .domain([0, 2]);

    this.yTicks = this.showYTicks ? this.yTickValues.map(d => {
      return {
        value: formatNum(d),
        transform: `translate(0 ${isNaN(yTickScale(d)) ? 0 : yTickScale(d)})`
      };
    }) : [];

    if (maxY != null) {
      this.resetRuler();
    }
  }

  addMissingYears(years: IYear[], start: number, end: number): IYear[] {
    const minYear = Math.min(...years.map(y => y.year)) - 1;
    const maxYear = Math.max(...years.map(y => y.year)) + 1;

    const allYears: IYear[] = [];
    for (let i = minYear; i <= maxYear; i++) {
      const year = years.find(y => y.year === i);
      if (i >= start && i <= end) {
        allYears.push(year ? year : {count: 0, year: i});
      }
    }
    return allYears;
  }

  setYear(e): void {
    if (!this.interactiveRuler) { return; }
    this.updateRuler(Math.round(this.xScale.invert(this.offsetX(e.clientX))));
  }

  offsetX(x) {
    return x - this.svg.nativeElement.getBoundingClientRect().left;
  }

  resetRuler() {
    const years = this.years.filter(y => {
      if (this.selMin && this.selMax) return y.year <= this.selMax && y.year >= this.selMin;
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
      transform: `translate(${x}, ${this.yScale(year.count)})`,
      year: year.year,
      x: x
    } : {
      count: 0,
      transform: `translate(${x}, ${this.yScale(0)})`,
      year: fullyear,
      x: x
    };

    this.xTicks.forEach(t => {
      t.show = Math.abs(t.x - this.ruler.x) > 32 && (
        this.brushTicks.length < 2 || (
          Math.abs(t.x - this.brushTicks[0].x) > 32 && Math.abs(t.x - this.brushTicks[1].x) > 32
        )
      );
    });

    this.brushTicks.forEach((t, i) => {
      t.show = Math.abs(t.x - this.ruler.x) > 32 && (i > 0 || Math.abs(t.x - this.brushTicks[1].x) > 32);
    });

    setTimeout(() => {
      const elWidth = this.rulerLabel.nativeElement.getBBox().width;
      let offset = 0;
      if (x + elWidth / 2 > this.width + 8) {
        offset = this.width + 8 - (x + elWidth / 2);
      } else if (x - elWidth / 2 < -8) {
        offset = -8 - (x - elWidth / 2);
      }
      this.rulerOffset = `translate(${offset} -6)`;
    }, 0);
  }

  updateBrush (): void {
    console.log('UPDATEBRUSH');
    if (this.enableBrush && this.selMin != null && this.selMax != null) {
      if (this.selMin !== this.selMax) this.breakRecursion = true;
      this.brush.move(d3.select(this.brushContainer.nativeElement), [this.xScale(this.selMin), this.xScale(this.selMax)]);
    } else if (this.enableBrush) {
      this.brush.move(d3.select(this.brushContainer.nativeElement), null);
    }
  }

  resetYear(): void {
    this.selection.setYear(null, null);
    this.dataService.setFilter();
  }
}
