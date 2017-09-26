import {Component, OnInit} from '@angular/core';
import {ApiService} from '../services/api.service';

import {ITopic} from "../app.interfaces";

@Component({
  selector: 'topic',
  templateUrl: './topic.component.html'
})

export class TopicComponent {

  private topics: Array<ITopic>;
  selectedTopic: ITopic;

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
        
      },
      () => {

      }
    )
  }

  onSelect(topic: ITopic): void {
    this.selectedTopic = topic;
    this.api.setFilter(this.selectedTopic.id, 'topic');
  }

}
