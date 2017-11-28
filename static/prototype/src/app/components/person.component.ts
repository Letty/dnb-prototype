import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ApiService } from '../services/api.service';
import { SelectionService } from '../services/selection.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { scaleLinear } from 'd3-scale';

// import _ from 'lodash';
import {debounce} from '../decorators';

import { IPerson, IYear } from '../app.interfaces';
import { DataService } from '../services/data.service';
import { RouterService } from '../services/router.service';

import * as d3 from 'd3';

@Component({
  selector: 'chart-person',
  templateUrl: './person.component.html'
})

export class PersonComponent implements OnInit {

  @ViewChild('temp') temp;
  @ViewChild('svgWrapper') svg;

  public detail = false;
  public _persons: Observable<IPerson[]>;
  public rawPersons: IPerson[];
  public persons = [];
  public loadingData = true;
  public offResults = '0';
  private personYears = [];
  public personYearsLines = [];
  public min = 1000;
  public max = 2018;
  public width = 0;
  public ticks = [];
  public tags = [];
  public collapsed = false;

  public selectedPerson: IPerson = null;
  public selectedTag = null;

  private yScale = d3.scalePow().exponent(0.3).range([27, 6]);
  public yearScale = scaleLinear();
  private maxPubInYear = 0;

  constructor(
    private api: ApiService,
    private selection: SelectionService,
    private sanitizer: DomSanitizer,
    private dataService: DataService,
    private routerService: RouterService
    ) {
      api.loadingData$.subscribe((e) => {
        if (e === 'person') { this.loadingData = true; }
      });
      selection.selPerson$.subscribe(
        person => {
          this.selectedPerson = person;
          this.tags = this.rawPersons.filter(d => this.selectedPerson == null || d.id !== this.selectedPerson.id).map(tag => {
            return {label: `${tag.name} ${tag.lastname}`, tag};
          });
          this.selectedTag = this.selectedPerson != null ?
            {label: `${this.selectedPerson.name} ${this.selectedPerson.lastname}`, tag: this.selectedPerson} : null;
        }
      );
    }

  @HostListener('window:resize', ['$event'])
  @debounce(250)
  onResize(event) {
    this.width = this.svg.nativeElement.clientWidth;
    this.layout();
  }


  ngOnInit(): void {
    this.width = this.svg.nativeElement.clientWidth;

    this._persons = this.dataService.persons;
    this.dataService.persons.subscribe(value => {
      this.rawPersons = value;
      this.tags = value.filter(d => this.selectedPerson == null || d.id !== this.selectedPerson.id).map(tag => {
        return {label: `${tag.name} ${tag.lastname}`, tag};
      });
      this.selectedTag = this.selectedPerson != null ? {label: `${this.selectedPerson.name} ${this.selectedPerson.lastname}`, tag: this.selectedPerson} : null;
      this.layout();
      this.loadingData = false;
    });

    // this.routerService.view.subscribe(view => {
    //   this.detail = view === 'person';
    // });

    this.routerService.person.subscribe(size => {
      this.detail = size === 2;
      this.collapsed = size === 0 ? true : false;
    });

    this.dataService.personYears.subscribe(value => {
      this.personYears = value;
      const birthYears = this.persons.map(d => (d as any).year_of_birth).filter(y => y != null);
      const pubYears = Array.prototype.concat(...value.map(d => d.map(e => e.year).filter(y => y !== 0)));

      if (birthYears.length === 0 && pubYears.length === 0) return;

      const minYear = Math.min(...birthYears, ...pubYears);

      this.min = Math.floor(minYear / 50) * 50;
      this.yearScale
        .domain([this.min, this.max])
        .rangeRound([200, this.width - 60]);

      this.maxPubInYear = Math.max(...Array.prototype.concat(...value.map(d => d.map(e => e.count))));
      this.yScale.domain([0, this.maxPubInYear]);

      const line = d3.line<IYear>()
        .x(d => this.yearScale(d.year))
        .y(d => this.yScale(d.count));

      this.personYearsLines = value.map(v => line(this.addMissingYears(v)));

      // console.log(birthYears, Math.min(...birthYears), Math.min(...pubYears));
      this.ticks = '.'.repeat(Math.ceil((this.max - this.min) / 50)).split('').map((t, i) => {
        const year = this.min + i * 50;
        return {
          year,
          x: this.yearScale(year)
        };
      });
    });
  }

  onSelect(person: IPerson): void {
    this.selection.setPerson(person);
    this.dataService.setFilter();
  }

  layout () {
    const temp = d3.select(this.temp.nativeElement);
    this.rawPersons.forEach(p => {
      temp.append('text').html(`${p.name} ${p.lastname}`).attr('attr-id', p.id);
    });
    this.persons = temp.selectAll('text').nodes().map(n => {
      const person = this.rawPersons.find(p => d3.select(n).attr('attr-id') === p.id);
      const {id, name, lastname, date_of_birth, date_of_death, count} = person;

      const year_of_birth = date_of_birth && date_of_birth.match(/[0-9]{4}/) ? +date_of_birth.match(/[0-9]{4}/)[0] : null;
      const year_of_death = date_of_death && date_of_death.match(/[0-9]{4}/) ? +date_of_death.match(/[0-9]{4}/)[0] : null;

      return {
        id, name, lastname, year_of_birth, year_of_death, count,
        width: (n as any).getBBox().width
      };
    });
    temp.selectAll('text').remove();

    let remainingWidth = this.width;
    const scales = [3.2, 2.4, 1.8, 1.4];
    const height = 16.5;
    let row = 0;
    let y = height * scales[0];

    this.persons.forEach((p, i) => {
      let scale = scales[Math.min(row, 3)];
      if (i > 0 && remainingWidth - p.width * scale < 0) {
        remainingWidth = this.width;
        row += 1;
        y += 16.5 * scales[Math.min(row, 3)] + 8 + 4 * Math.min(row, 3);
      }
      scale = scales[Math.min(row, 3)];
      p.scale = scale;
      p.x = this.width - remainingWidth;
      p.row = row;
      p.y = y;
      remainingWidth -= p.width * p.scale + 24;

      const transform = `translate(${p.x}px, ${p.y}px) scale(${p.scale})`;
      p.transform = this.sanitizer.bypassSecurityTrustStyle(transform);

      const transformDetail = `translate(0, ${i * 32 + 26}px) scale(1)`;
      p.transformDetail = this.sanitizer.bypassSecurityTrustStyle(transformDetail);
    });
  }

  formatNum (d) {
    return d3.format(',')(d);
  }

  addMissingYears(years: IYear[]): IYear[] {
    const minYear = Math.min(...years.map(y => y.year)) - 1;
    const maxYear = Math.max(...years.map(y => y.year)) + 1;

    let allYears: IYear[] = [];
    for (let i = minYear; i <= maxYear; i++) {
      const year = years.find(y => y.year === i);
      if (i >= this.min && i <= this.max) {
        allYears.push(year ? year : {count: 0, year: i});
      }
    }
    if (allYears.find(y => y.year === this.max) == null) allYears = [...allYears, {count: 0, year: this.max}];
    if (allYears.find(y => y.year === this.min) == null) allYears = [{count: 0, year: this.min}, ...allYears];
    return allYears;
  }
}
