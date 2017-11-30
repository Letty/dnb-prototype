import {Component, ElementRef, Renderer2, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';

import {IYear} from '../../app.interfaces';
import {getClassMembers} from '@angular/compiler-cli/src/diagnostics/typescript_symbols';
import {DataService} from '../../services/data.service';
import {Observable} from 'rxjs/Observable';

import {formatNum} from '../../services/formatting';

@Component({
  selector: 'results-header',
  templateUrl: './results-header.component.html',
  styleUrls: ['./results-header.component.scss']
})

export class ResultsHeaderComponent implements OnInit {
  private _years: Observable<IYear[]>;
  public results = '0';
  public years: IYear[] = [];

  constructor(
    private api: ApiService,
    private dataService: DataService) {}

  ngOnInit(): void {
    this._years = this.dataService.years;
    this.dataService.years.subscribe(value => {
      this.years = value;
      this.results = formatNum(this.years.length ? this.years.map(y => y.count).reduce((a, b) => a + b) : 0);
    });
  }
}
