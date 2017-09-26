import {Component, OnInit} from '@angular/core';
import {ApiService} from '../services/api.service';

import {ITopic} from "../app.interfaces";

@Component({
  selector: 'topic',
  templateUrl: './topic.component.html'
})

export class TopicComponent {

  private topics: Array<ITopic>;

  constructor(private api: ApiService) {

  }

  ngOnInit(): void {
    this.api.getTopics().subscribe(
      result => {
        this.topics = Object.keys(result).map(key => {
          return {
            id: result[key].id,
            keyword: result[key].keyword,
            count: result[key].count
          };
        });
      },
      error => {
        this.topics = [
          { id: 66048, keyword: 'z Geschichte 1956-1966', count: 6},
          { id: 1280, keyword: '547.8404572', count: 6},
          { id: 12468, keyword: 'Deutsche Literatur', count: 405236},
          { id: 35273, keyword: 'Medizin, Gesundheit', count: 329684},
        ]

      },
      () => {

      }
    )
  }

}
