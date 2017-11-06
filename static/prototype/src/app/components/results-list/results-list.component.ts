import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

import { IYear, IItem } from '../../app.interfaces';
import { DataService } from '../../services/data.service';
import { Observable } from 'rxjs/Observable';

import _ from 'lodash';

@Component({
  selector: 'results-list',
  templateUrl: './results-list.component.html',
  styleUrls: ['./results-list.component.scss']
})

export class ResultsListComponent implements OnInit {
  private items: Observable<IItem[]>;
  public loadingData = true;

  constructor(
    private api: ApiService,
    private dataService: DataService) {
      api.loadingData$.subscribe((e) => {
        if (e === 'item') { this.loadingData = true; }
      });
    }

  ngOnInit(): void {
    this.items = this.dataService.items;
    this.dataService.items.subscribe(value => {
      this.loadingData = false;
      this.items = _.chunk(value, _.ceil(_.size(value) / 5));
    })

  }
}
