import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { SelectionService } from '../services/selection.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { scaleLinear } from 'd3-scale';

import _ from 'lodash';

import { IPerson } from '../app.interfaces';
import { DataService } from '../services/data.service';
import { RouterService } from '../services/router.service';

import { format } from 'd3';

@Component({
  selector: 'chart-person',
  templateUrl: './person.component.html'
})

export class PersonComponent implements OnInit {

  public detail = false;
  public persons: Observable<IPerson[]>;
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

  ngOnInit(): void {
    this.persons = this.dataService.persons;
    this.dataService.persons.subscribe(value => {

      _.each(value, person => {
        person.year_of_birth = person.date_of_birth && person.date_of_birth.match(/[0-9]{4}/) ? +person.date_of_birth.match(/[0-9]{4}/)[0] : null;
        person.year_of_death = person.date_of_death && person.date_of_death.match(/[0-9]{4}/) ? +person.date_of_death.match(/[0-9]{4}/)[0] : null;
      });

      this.max = 2018;

      this.min = value.filter(d => (d as any).year_of_birth !== null) ?
        Math.min(...value.filter(d => (d as any).year_of_birth !== null).map(d => (d as any).year_of_birth)) : 0;


      this.yearScale.domain([this.min, this.max]);

      this.loadingData = false;
      const counts: Array<number> = value.map(p => p.count);
      this.fontScale.domain([Math.min(...counts), Math.max(...counts)]);
      this.offResults = format(',')(123456);
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
}
