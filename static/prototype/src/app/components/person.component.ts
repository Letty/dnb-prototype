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
  private min = Number.POSITIVE_INFINITY;
  private max = Number.NEGATIVE_INFINITY;

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
        person['date_of_birth'] = _.random(1100, 1900);
        person['date_of_death'] = person['date_of_birth'] + _.random(10, 100);
      });

      const years_birth: Array<number> = value.map(p => p['date_of_birth']);
      const years_death: Array<number> = value.map(p => p['date_of_death']);

      const years = years_birth.concat(years_death);

      this.yearScale.domain([_.min(years), _.max(years)]);

      this.loadingData = false;
      const counts: Array<number> = value.map(p => p.count);
      this.fontScale.domain([Math.min(...counts), Math.max(...counts)]);
      this.offResults = format(',')(123456);
    });

    this.routerService.view.subscribe(view => {
      this.detail = view === 'person';
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
    let style: any;
    style = this.sanitizer.bypassSecurityTrustStyle('width: ' + (this.yearScale(birth) - this.yearScale(death)) + '%');
    return style;
  }
}
