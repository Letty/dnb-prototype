import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ApiService } from '../services/api.service';
import { SelectionService } from '../services/selection.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { scaleLinear } from 'd3-scale';

// import _ from 'lodash';
import {debounce} from '../decorators';

import { IPerson } from '../app.interfaces';
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
  public personYears = [];
  public min = 1000;
  public max = 2018;

  private fontScale = scaleLinear()
    .range([0.8, 2.5]);
  private yearScale = scaleLinear()
    .range([0, 100]);

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
    }

  @HostListener('window:resize', ['$event'])
  @debounce(250)
  onResize(event) {
    this.layout();
  }


  ngOnInit(): void {
    this._persons = this.dataService.persons;
    this.dataService.persons.subscribe(value => {
      this.rawPersons = value;

      this.layout();

      this.max = 2018;

      this.min = this.persons.filter(d => (d as any).year_of_birth !== null) ?
        Math.min(...this.persons.filter(d => (d as any).year_of_birth !== null).map(d => (d as any).year_of_birth)) : 0;


      this.yearScale.domain([this.min, this.max]);

      this.loadingData = false;
      const counts: Array<number> = this.persons.map(p => p.count);
      this.fontScale.domain([Math.min(...counts), Math.max(...counts)]);
      this.offResults = d3.format(',')(123456);
    });

    this.routerService.view.subscribe(view => {
      this.detail = view === 'person';
    });

    this.dataService.personYears.subscribe(value => {
      this.personYears = value;
    });
  }

  onSelect(person: IPerson): void {
    this.selection.setPerson(person);
    this.dataService.setFilter();
  }

  setFontSize(count: number): string {
    let style: any;
    style = this.sanitizer.bypassSecurityTrustStyle('font-size: ' + this.fontScale(count) + 'em');
    return style;
  }

  setBirthWidth(count: number): string {
    let style: any;
    style = this.sanitizer.bypassSecurityTrustStyle('width: ' + this.yearScale(count) + '%');
    return style;
  }

  setLifeWidth(birth: number, death: number): string {
    if (birth !== null && death === null) death = 2018;
    let style: any;
    style = this.sanitizer.bypassSecurityTrustStyle('width: ' + (this.yearScale(death) - this.yearScale(birth)) + '%');
    return style;
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

    const width = this.svg.nativeElement.clientWidth;
    let remainingWidth = width;
    const scales = [3.2, 2.4, 1.8, 1.4];
    const height = 16.5;
    let row = 0;
    let y = height * scales[0];

    this.persons.forEach(p => {
      let scale = scales[Math.min(row, 3)];
      console.log(this.svg.nativeElement.clientWidth);
      if (remainingWidth - p.width * scale < 0) {
        remainingWidth = width;
        row += 1;
        y += 16.5 * scales[Math.min(row, 3)] + 8 + 4 * Math.min(row, 3);
      }
      scale = scales[Math.min(row, 3)];
      p.scale = scale;
      p.x = width - remainingWidth;
      p.row = row;
      p.y = y;
      remainingWidth -= p.width * p.scale + 24;

      // const h = height * p.scale;
      // const w = p.width * p.scale;
      // p.path = `M-8,-3 L-8,${-h - 3} A-3,${-h - 8} L${w + 3},${-h - 8} A${w + 8},${-h - 3} L${w + 8},-3 A${w + 3},-8 L-3,-8 A-8,-3`;
    });
  }
}
