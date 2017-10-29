import {Component, ElementRef, Renderer2, OnInit} from '@angular/core';
import {ApiService} from '../services/api.service';
import * as d3 from 'd3';

import {IYear} from '../app.interfaces';
import {SelectionService} from '../services/selection.service';
import {getClassMembers} from '@angular/compiler-cli/src/diagnostics/typescript_symbols';
import {DataService} from '../services/data.service';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html'
})

export class TimelineComponent implements OnInit {
  private _years: Observable<IYear[]>;
  public years: IYear[] = [];
  init = 0;

  constructor(
    private api: ApiService,
    private selection: SelectionService,
    private dataService: DataService) {}

  ngOnInit(): void {

    this._years = this.dataService.years;
    this.dataService.years.subscribe(
      value => {
        console.log(1);
        if (value.length > 0) {
          console.log(2);
          this.init = this.init + 1;
        }
        const y: IYear[] = [];

        // if (this.init === 1) {
        //   value.forEach(function (d) {
        //     y.push(d);
        //   });
        //
        //   this.years = y;
        //
        //   // this.showAreaChart();
        //
        // } else {
          console.log(4);
          this.years = value;
        // }
      }
    );
    }
  }
