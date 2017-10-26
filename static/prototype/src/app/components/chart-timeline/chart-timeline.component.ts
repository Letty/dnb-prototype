import {Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges, HostListener} from '@angular/core';
import * as d3 from 'd3';

import {IYear} from '../../app.interfaces';

import {Observable} from 'rxjs/Observable';

import { debounce } from '../../decorators';

@Component({
  selector: 'chart-timeline',
  templateUrl: './chart-timeline.component.html'
})

export class ChartTimelineComponent implements OnInit, OnChanges {
  @Input() years: IYear[] = [];
  @Input() xAxis = false;
  @Input() yAxis = false;
  @Input() brush = true;
  @Input() logXScale = true;
  @Input() startYear = 1500;
  @Input() endYear = 2017;
  @Input() height = 96;

  @ViewChild('svg') svg;



  public path: string;

  private width = 0;

  ngOnInit () {
    this.width = this.svg.nativeElement.clientWidth;
  }

  ngOnChanges (changes: SimpleChanges) {
    if (changes.years) {
      this.updatePath();
    }
  }

  @HostListener('window:resize', ['$event'])
  @debounce(250)
  onResize(event) {
    this.width = this.svg.nativeElement.clientWidth;
    this.updatePath();
  }

  updatePath(): void {
    const xScale = this.logXScale ?
      d3.scalePow().exponent(2) : d3.scaleLinear();

    xScale.rangeRound([0, this.width])
      .domain(d3.extent(this.years, d => d.year));

    const yScale = d3.scalePow()
      .exponent(0.3)
      .rangeRound([this.height, 0])
      .domain([0, d3.max(this.years, d => d.count)]);

    const area = d3.area<IYear>()
      .x(d => xScale(d.year))
      .y0(this.height)
      .y1(d => yScale(d.count));

    this.path = area(this.years);
  }
}
