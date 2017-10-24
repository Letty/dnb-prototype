import {Component, ElementRef, Renderer2, OnInit} from '@angular/core';
import {ApiService} from '../services/api.service';
import * as d3 from 'd3';

import {IYear} from '../app.interfaces';
import {SelectionService} from '../services/selection.service';
import {getClassMembers} from '@angular/compiler-cli/src/diagnostics/typescript_symbols';
import {DataService} from '../services/data.service';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html'
})

export class TimelineComponent implements OnInit {
  private _years: Observable<IYear[]>;
  private years: IYear[] = [];
  init = 0;

  constructor(private api: ApiService, private selection: SelectionService, private dataService: DataService) {

  }

  ngOnInit(): void {

    this._years = this.dataService.years;

    this.dataService.years.subscribe(
      value => {
        if (value.length > 0) {
          this.init = this.init + 1;
        }

        const y: IYear[] = [];

        if (this.init === 1) {
          value.forEach(function (d) {
            y.push(d);
          });

          this.years = y;

          this.showAreaChart();

        } else {
          console.log('update data');
          console.log(value);
        }
      }
    );

  }

  showAreaChart(): void {

    const margin = {top: 20, bottom: 20, left: 50, right: 20};

    const height = 200 - margin.top - margin.bottom;
    const width = 1350 - margin.left - margin.right;


    const x = d3.scaleTime()
      .rangeRound([0, width]);


    const y = d3.scalePow()
      .exponent(0.3)
      .rangeRound([height, 0]);

    const brush = d3.brushX()
      .extent([[0, 0], [width, height]])
      .on('brush end', () => {
        if (d3.event.type === 'end' && (d3.event.selection[0] !== 0 && d3.event.selection[1] !== width)) {
          this.selection.setYear(x.invert(d3.event.selection[0]).getFullYear(),
            x.invert(d3.event.selection[1]).getFullYear());
          this.dataService.setFilter();
        }
      });

    const area = d3.area<IYear>()
      .x(d => {
        return x(new Date(d.year, 1, 1));
      })
      .y0(height)
      .y1(d => {
        return y(d.count);
      });


    const svg = d3.select('#viz').append('svg')
      .attr('height', height + margin.top + margin.bottom)
      .attr('width', width + margin.left + margin.right)
      .attr('class', 'year-area-svg')
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // ------
    x.domain(d3.extent(this.years, function (d) {
      return new Date(d.year, 1, 1);
    }));
    y.domain([0, d3.max(this.years, function (d) {
      return d.count;
    })]);

    svg.append('path')
      .datum(this.years)
      .attr('class', 'area-path')
      .attr('d', area)
      .on('mousemove', function (d) {
        // extraxtion des jahres + infos
        // console.log(x.invert(d3.mouse(this)[0]).getFullYear(), year[new Date(x.invert(d3.mouse(this)[0]).getFullYear(),1,1)]);
      });

    svg.append('g')
      .attr('class', 'brush')
      .call(brush)
      .call(brush.move, x.range());

    d3.select('.brush .selection')
      .style('display', 'none');
    d3.select('.brush .handle')
      .style('display', 'none');

    svg.append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x));
    svg.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y)
        .tickSize(-width))
      .append('text')
      .attr('fill', '#000')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('Veröffentlichungen');

  }
}
