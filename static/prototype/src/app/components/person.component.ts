import {Component, OnInit} from '@angular/core';
import {ApiService} from '../services/api.service';
import {DomSanitizer} from "@angular/platform-browser";
import * as d3 from 'd3';

import {IPerson} from "../app.interfaces";

@Component({
  selector: 'person',
  templateUrl: './person.component.html'
})

export class PersonComponent {

  private persons: Array<IPerson>;
  private min: number = 1e10;
  private max: number = -1e10;

  selectedPerson: IPerson;

  private fontScale = d3.scaleLinear()
    .range([0.8, 2.5]);

  constructor(private api: ApiService, private sanitizer: DomSanitizer) {

  }

  ngOnInit(): void {
    this.api.getPersons().subscribe(
      result => {
        this.persons = Object.keys(result).map(key => {
          if (result[key].count < this.min) {
            this.min = result[key].count;
          }
          if (result[key].count > this.max) {
            this.max = result[key].count;
          }

          return {
            id: result[key].id,
            name: result[key].name,
            count: result[key].count
          };
        });

        this.fontScale.domain([this.min, this.max]);
      },
      error => {
        this.persons = [
          {id: '66048', name: 'z Geschichte 1956-1966', count: 6},
          {id: '1280', name: '547.8404572', count: 6},
          {id: '12468', name: 'Deutsche Literatur', count: 405236},
          {id: '35273', name: 'Medizin, Gesundheit', count: 329684},
        ]

      },
      () => {

      }
    )
  }

  onSelect(person: IPerson): void {
    this.selectedPerson = person;
    this.api.setFilter(this.selectedPerson.id, 'person');
  }


  setFontSize(count: number): string {
    let style: any;
    style = this.sanitizer.bypassSecurityTrustStyle('font-size: ' + this.fontScale(count) + 'em');
    return style;
  }

}
