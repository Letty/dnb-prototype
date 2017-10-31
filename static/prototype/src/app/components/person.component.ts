import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { SelectionService } from '../services/selection.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { scaleLinear } from 'd3-scale';

import { IPerson } from '../app.interfaces';
import { DataService } from '../services/data.service';

@Component({
  selector: 'chart-person',
  templateUrl: './person.component.html'
})

export class PersonComponent implements OnInit {

  public detail = false;
  public persons: Observable<IPerson[]>;
  public loadingData = true;
  private min = Number.POSITIVE_INFINITY;
  private max = Number.NEGATIVE_INFINITY;

  private fontScale = scaleLinear()
    .range([0.8, 2.5]);

  constructor(
    private api: ApiService,
    private selection: SelectionService,
    private sanitizer: DomSanitizer,
    private dataService: DataService
    ) {
      api.loadingData$.subscribe((e) => {
        if (e === 'person') { this.loadingData = true; }
      });
    }

  ngOnInit(): void {

    this.persons = this.dataService.persons;
    this.dataService.persons.subscribe(
      value => {
        this.loadingData = false;
        const counts: Array<number> = value.map(p => p.count);
        this.fontScale.domain([Math.min(...counts), Math.max(...counts)]);
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
}
