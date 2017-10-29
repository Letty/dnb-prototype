import {Component, ElementRef, Renderer2, OnInit} from '@angular/core';
import {ApiService} from '../services/api.service';

import {IYear} from '../app.interfaces';
import {SelectionService} from '../services/selection.service';
import {getClassMembers} from '@angular/compiler-cli/src/diagnostics/typescript_symbols';
import {DataService} from '../services/data.service';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'results-header',
  templateUrl: './results-header.component.html'
})

export class ResultsHeaderComponent implements OnInit {
  private _years: Observable<IYear[]>;
  public years: IYear[] = [];

  constructor(
    private api: ApiService,
    private selection: SelectionService,
    private dataService: DataService) {}

  ngOnInit(): void {
    this._years = this.dataService.years;
    this.dataService.years.subscribe(value => this.years = value);
    }
  }
