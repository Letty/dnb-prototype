import {Component, OnInit} from '@angular/core';
import {ApiService} from '../services/api.service';
import {SelectionService} from "../services/selection.service";
import {DomSanitizer} from "@angular/platform-browser";
import {Observable} from "rxjs/Observable";
import * as d3 from 'd3';

import {IPerson} from "../app.interfaces";
import {DataService} from "../services/data.service";

@Component({
  selector: 'person',
  templateUrl: './person.component.html'
})

export class PersonComponent {

  private persons: Observable<IPerson[]>;
  private min: number = 1e10;
  private max: number = -1e10;

  private fontScale = d3.scaleLinear()
    .range([0.8, 2.5]);

  constructor(private api: ApiService, private selection: SelectionService, private sanitizer: DomSanitizer,
              private dataService: DataService) {

  }

  ngOnInit(): void {

    this.persons = this.dataService.persons;
    this.dataService.persons.subscribe(
      value => {
        value.forEach(p => {
            if (p.count < this.min) {
              this.min = p.count;
            }
            if (p.count > this.max) {
              this.max = p.count;
            }
          }
        );
        this.fontScale.domain([this.min, this.max]);
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
