import {Component, OnInit, NgModule, ViewChild} from '@angular/core';
import {ApiService} from '../../services/api.service';

import {IYear, IItem} from '../../app.interfaces';
import {DataService} from '../../services/data.service';
import {Observable} from 'rxjs/Observable';
import {RouterService} from '../../services/router.service';

import _ from 'lodash';
import { MasonryModule } from 'angular2-masonry';

import {format} from 'd3-format';

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
  public totalResults: string = null;
  public collapsed = true;

  constructor(private api: ApiService,
              private dataService: DataService,
              private routerService: RouterService) {
    api.loadingData$.subscribe((e) => {
      if (e === 'item') {
        this.loadingData = true;
      }
    });
    routerService.result.subscribe(size => {
      this.collapsed = size === 0 || size === null;
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

    this.dataService.totalResults.subscribe(value => {
      this.totalResults = format(',')(value);
    });
  }

  getItem(item: IItem): void {
    this.loadingDetailData = true;
    this.itemTitle = `${item.name} ${item.lastname}: ${item.title}`;
    this.api.getItem(item.id).subscribe(data => {
      if (this.loadingDetailData === false) return;
      this.loadingDetailData = false;
      this.item = data;
    });
  }

  close() {
    this.loadingDetailData = false;
    this.item = null;
  }
}
