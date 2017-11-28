import {Component, OnInit, NgModule, ViewChild} from '@angular/core';
import {ApiService} from '../../services/api.service';

import {IYear, IItem} from '../../app.interfaces';
import {DataService} from '../../services/data.service';
import {Observable} from 'rxjs/Observable';

import _ from 'lodash';
import { MasonryModule } from 'angular2-masonry';

@NgModule({
  imports: [
    MasonryModule
  ]
})

@Component({
  selector: 'results-list',
  templateUrl: './results-list.component.html',
  styleUrls: ['./results-list.component.scss']
})

export class ResultsListComponent implements OnInit {
  @ViewChild('resultList') resultList;

  public items: Observable<IItem[]>;
  public item: any = null;
  public tags = [];
  public itemTitle: string = null;
  public loadingData = true;
  public loadingDetailData = false;

  constructor(private api: ApiService,
              private dataService: DataService) {
    api.loadingData$.subscribe((e) => {
      if (e === 'item') {
        this.loadingData = true;
      }
    });
  }

  ngOnInit(): void {
    this.items = this.dataService.items;
    this.dataService.items.subscribe(value => {
      this.tags = value.map(tag => {
        return {label: tag.title, tag};
      });
      this.loadingData = false;
      this.resultList.nativeElement.scrollTop = 0;
    });

  }

  getItem(item: IItem): void {
    this.loadingDetailData = true;
    this.itemTitle = `${item.name} ${item.lastname}: ${item.title}`;
    this.api.getItem(item.id).subscribe(data => {
      if (this.loadingDetailData === false) { return; }
      this.loadingDetailData = false;
      this.item = data;
    });
  }

  close() {
    this.loadingDetailData = false;
    this.item = null;
  }
}
