import {Component, OnInit} from '@angular/core';
import {ApiService} from '../services/api.service';

import {IPerson} from "../app.interfaces";

@Component({
  selector: 'person',
  templateUrl: './person.component.html'
})

export class PersonComponent {

  private persons: Array<IPerson>;

  constructor(private api: ApiService) {

  }

  ngOnInit(): void {
    this.api.getPersons().subscribe(
      result => {
        this.persons = Object.keys(result).map(key => {
          return {
            id: result[key].id,
            name: result[key].name,
            count: result[key].count
          };
        });
      },
      error => {
        this.persons = [
          { id: '66048', name: 'z Geschichte 1956-1966', count: 6},
          { id: '1280', name: '547.8404572', count: 6},
          { id: '12468', name: 'Deutsche Literatur', count: 405236},
          { id: '35273', name: 'Medizin, Gesundheit', count: 329684},
        ]

      },
      () => {

      }
    )
  }

}
