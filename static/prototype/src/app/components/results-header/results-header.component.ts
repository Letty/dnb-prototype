import {Component, ElementRef, Renderer2, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';

import {IYear} from '../../app.interfaces';
import {SelectionService} from '../../services/selection.service';
import {getClassMembers} from '@angular/compiler-cli/src/diagnostics/typescript_symbols';
import {DataService} from '../../services/data.service';
import {Observable} from 'rxjs/Observable';

import {format} from 'd3';

@Component({
  selector: 'results-header',
  templateUrl: './results-header.component.html',
  styleUrls: ['./results-header.component.scss']
})

export class ResultsHeaderComponent implements OnInit {
  private _years: Observable<IYear[]>;
  public results = '0';
  public years: IYear[] = [];
  public loadingData = true;

  constructor(
    private api: ApiService,
    private selection: SelectionService,
    private dataService: DataService) {
      dataService.loadingData$.subscribe(() => this.loadingData = true);
    }

  ngOnInit(): void {
    this._years = this.dataService.years;
    this.dataService.years.subscribe(value => {
      this.years = value;
      this.loadingData = false;
      this.results = format(',')(this.years.length ? this.years.map(y => y.count).reduce((a, b) => a + b) : 0);
    });
  }
}
